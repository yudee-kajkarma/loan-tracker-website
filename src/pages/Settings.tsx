import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { PIN_LENGTH } from "../lib/constants";

export default function SettingsPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const settings = useAuthStore((s) => s.settings);
  const setPin = useAuthStore((s) => s.setPin);
  const updateNotificationSettings = useAuthStore(
    (s) => s.updateNotificationSettings,
  );
  const signOut = useAuthStore((s) => s.signOut);

  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [reminderDays, setReminderDays] = useState<number>(
    settings?.reminder_days_before ?? 1,
  );
  const [notifEnabled, setNotifEnabled] = useState<boolean>(
    settings?.notification_enabled ?? true,
  );
  const [savingNotif, setSavingNotif] = useState(false);

  useEffect(() => {
    setReminderDays(settings?.reminder_days_before ?? 1);
    setNotifEnabled(settings?.notification_enabled ?? true);
  }, [settings]);

  const hasPin = !!settings?.pin_hash;

  const handleRemovePin = async () => {
    if (window.confirm("Remove your PIN?")) {
      await setPin(null);
    }
  };

  const handleSaveNotifications = async () => {
    setSavingNotif(true);
    try {
      await updateNotificationSettings(notifEnabled, reminderDays);
    } finally {
      setSavingNotif(false);
    }
  };

  return (
    <div className="max-w-[720px] mx-auto">
      <h1 className="text-[28px] font-bold text-navy mb-6">Settings</h1>

      {/* Profile */}
      <Section title="Profile">
        <Input label="Email" value={user?.email ?? ""} readOnly />
      </Section>

      {/* Security */}
      <Section title="Security">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[14px] font-medium text-navy">PIN Lock</p>
            <p className="text-[12px] text-muted mt-0.5">
              {hasPin
                ? "A 4-digit PIN protects your dashboard."
                : "No PIN set. Add one for extra protection."}
            </p>
          </div>
          <div className="flex gap-2">
            {hasPin ? (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setPinModalOpen(true)}
                >
                  Change PIN
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleRemovePin}
                >
                  Remove
                </Button>
              </>
            ) : (
              <Button size="sm" onClick={() => setPinModalOpen(true)}>
                Set PIN
              </Button>
            )}
          </div>
        </div>
      </Section>

      {/* Notifications */}
      <Section title="Notifications">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[14px] font-medium text-navy">Enable reminders</p>
          <Toggle
            checked={notifEnabled}
            onChange={(v) => setNotifEnabled(v)}
          />
        </div>
        <div className="flex items-center justify-between">
          <p className="text-[14px] font-medium text-navy">
            Remind me X days before due date
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setReminderDays((d) => Math.max(1, d - 1))}
              className="w-9 h-9 rounded-[10px] border border-border bg-white text-navy hover:bg-surface"
            >
              −
            </button>
            <span className="w-10 text-center text-[16px] font-semibold text-navy">
              {reminderDays}
            </span>
            <button
              onClick={() => setReminderDays((d) => Math.min(7, d + 1))}
              className="w-9 h-9 rounded-[10px] border border-border bg-white text-navy hover:bg-surface"
            >
              +
            </button>
          </div>
        </div>
        <div className="mt-4">
          <Button
            size="sm"
            loading={savingNotif}
            onClick={handleSaveNotifications}
          >
            Save preferences
          </Button>
        </div>
      </Section>

      {/* Danger zone */}
      <Section title="Danger Zone" tone="danger">
        <Button
          variant="destructive"
          onClick={async () => {
            if (window.confirm("Sign out of LoanTracker?")) {
              await signOut();
              navigate("/welcome");
            }
          }}
        >
          Sign out
        </Button>
      </Section>

      {pinModalOpen ? (
        <PinModal onClose={() => setPinModalOpen(false)} />
      ) : null}
    </div>
  );
}

function Section({
  title,
  children,
  tone,
}: {
  title: string;
  children: React.ReactNode;
  tone?: "danger";
}) {
  return (
    <section
      className={`bg-white rounded-[12px] border border-border p-5 mb-4 ${
        tone === "danger" ? "border-overdue/40" : ""
      }`}
    >
      <h2
        className={`text-[16px] font-semibold mb-4 ${
          tone === "danger" ? "text-overdue" : "text-navy"
        }`}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 ${
        checked ? "bg-teal" : "bg-border"
      }`}
    >
      <span
        className={`w-5 h-5 bg-white rounded-full transition-transform shadow ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function PinModal({ onClose }: { onClose: () => void }) {
  const setPin = useAuthStore((s) => s.setPin);
  const [pin, setPinValue] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  return (
    <Modal open onClose={onClose} title="Set your PIN" width={400}>
      <div className="flex flex-col gap-4">
        <Input
          label={`New ${PIN_LENGTH}-digit PIN`}
          type="password"
          inputMode="numeric"
          maxLength={PIN_LENGTH}
          value={pin}
          onChange={(e) => setPinValue(e.target.value.replace(/\D/g, ""))}
        />
        <Input
          label="Confirm PIN"
          type="password"
          inputMode="numeric"
          maxLength={PIN_LENGTH}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value.replace(/\D/g, ""))}
        />
        {error ? (
          <p className="text-[13px] text-overdue">{error}</p>
        ) : null}
        <div className="flex justify-end gap-2 mt-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            loading={saving}
            onClick={async () => {
              setError(null);
              if (pin.length !== PIN_LENGTH) {
                setError(`Enter a ${PIN_LENGTH}-digit PIN.`);
                return;
              }
              if (pin !== confirm) {
                setError("PINs don't match.");
                return;
              }
              setSaving(true);
              try {
                await setPin(pin);
                onClose();
              } catch (err: any) {
                setError(err?.message ?? "Failed to save PIN");
              } finally {
                setSaving(false);
              }
            }}
          >
            Save PIN
          </Button>
        </div>
      </div>
    </Modal>
  );
}
