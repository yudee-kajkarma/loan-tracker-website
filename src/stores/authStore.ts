import { create } from "zustand";
import bcrypt from "bcryptjs";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { DEFAULT_REMINDER_DAYS } from "../lib/constants";
import type { UserSettings } from "../types";

interface AuthState {
  user: User | null;
  session: Session | null;
  settings: UserSettings | null;
  loading: boolean;
  pinRequired: boolean;
  pinUnlocked: boolean;

  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  fetchSettings: () => Promise<void>;
  setPin: (pin: string | null) => Promise<void>;
  verifyPin: (pin: string) => boolean;
  unlockSession: () => void;
  updateNotificationSettings: (
    enabled: boolean,
    reminderDays: number,
  ) => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  session: null,
  settings: null,
  loading: true,
  pinRequired: false,
  pinUnlocked: false,

  initialize: async () => {
    set({ loading: true });
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      set({ session, user: session?.user ?? null });

      if (session?.user) {
        await get().fetchSettings();
      }

      // Listen for auth changes (sign in / sign out / token refresh)
      supabase.auth.onAuthStateChange(async (_event, newSession) => {
        set({ session: newSession, user: newSession?.user ?? null });
        if (newSession?.user) {
          await get().fetchSettings();
        } else {
          set({ settings: null, pinRequired: false, pinUnlocked: false });
        }
      });
    } finally {
      set({ loading: false });
    }
  },

  signIn: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    // pinUnlocked is reset on every fresh sign-in
    set({ pinUnlocked: false });
    await get().fetchSettings();
  },

  signUp: async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;

    // Create a default user_settings row
    if (data.user) {
      await supabase.from("user_settings").upsert({
        user_id: data.user.id,
        pin_hash: null,
        notification_enabled: true,
        reminder_days_before: DEFAULT_REMINDER_DAYS,
      });
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({
      user: null,
      session: null,
      settings: null,
      pinRequired: false,
      pinUnlocked: false,
    });
  },

  fetchSettings: async () => {
    const user = get().user;
    if (!user) return;

    const { data, error } = await supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("fetchSettings error", error);
      return;
    }

    if (data) {
      const settings = data as UserSettings;
      set({
        settings,
        pinRequired: !!settings.pin_hash && !get().pinUnlocked,
      });
    } else {
      // No row yet — create defaults
      const defaults: UserSettings = {
        user_id: user.id,
        pin_hash: null,
        notification_enabled: true,
        reminder_days_before: DEFAULT_REMINDER_DAYS,
      };
      await supabase.from("user_settings").upsert(defaults);
      set({ settings: defaults, pinRequired: false });
    }
  },

  setPin: async (pin) => {
    const user = get().user;
    if (!user) return;

    const pin_hash = pin
      ? bcrypt.hashSync(pin, 10)
      : null;

    const { error } = await supabase
      .from("user_settings")
      .update({ pin_hash })
      .eq("user_id", user.id);

    if (error) throw error;

    const settings = get().settings;
    if (settings) {
      set({
        settings: { ...settings, pin_hash },
        pinRequired: !!pin_hash && !get().pinUnlocked,
      });
    }
  },

  verifyPin: (pin) => {
    const settings = get().settings;
    if (!settings?.pin_hash) return false;
    const ok = bcrypt.compareSync(pin, settings.pin_hash);
    if (ok) set({ pinUnlocked: true, pinRequired: false });
    return ok;
  },

  unlockSession: () => set({ pinUnlocked: true, pinRequired: false }),

  updateNotificationSettings: async (enabled, reminderDays) => {
    const user = get().user;
    if (!user) return;

    const { error } = await supabase
      .from("user_settings")
      .update({
        notification_enabled: enabled,
        reminder_days_before: reminderDays,
      })
      .eq("user_id", user.id);

    if (error) throw error;

    const settings = get().settings;
    if (settings) {
      set({
        settings: {
          ...settings,
          notification_enabled: enabled,
          reminder_days_before: reminderDays,
        },
      });
    }
  },
}));
