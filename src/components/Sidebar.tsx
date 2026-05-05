import { NavLink } from "react-router-dom";
import {
  ChartBarIcon,
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
  CogIcon,
} from "./ui/Icon";
import type { ReactNode } from "react";

interface NavItem {
  to: string;
  label: string;
  icon: ReactNode;
}

const main: NavItem[] = [
  { to: "/", label: "Dashboard", icon: <ChartBarIcon size={20} /> },
  { to: "/credit", label: "Credit", icon: <ArrowDownCircleIcon size={20} /> },
  { to: "/debit", label: "Debit", icon: <ArrowUpCircleIcon size={20} /> },
];

const bottom: NavItem[] = [
  { to: "/settings", label: "Settings", icon: <CogIcon size={20} /> },
];

function SideLink({ item }: { item: NavItem }) {
  return (
    <NavLink
      to={item.to}
      end={item.to === "/"}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2.5 mx-2 rounded-[10px] text-[14px] font-medium transition-colors ${
          isActive
            ? "bg-teal/10 text-teal border-l-[3px] border-teal pl-[13px]"
            : "text-navy hover:bg-surface"
        }`
      }
    >
      <span className="shrink-0">{item.icon}</span>
      <span>{item.label}</span>
    </NavLink>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-[240px] shrink-0 bg-white border-r border-border h-[calc(100vh-64px)] sticky top-[64px]">
      <nav className="flex-1 py-4 flex flex-col gap-1">
        {main.map((it) => (
          <SideLink key={it.to} item={it} />
        ))}
      </nav>
      <div className="border-t border-border py-3">
        {bottom.map((it) => (
          <SideLink key={it.to} item={it} />
        ))}
      </div>
    </aside>
  );
}

export function BottomTabs() {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-border h-16 flex items-center justify-around px-2">
      {[...main, ...bottom].map((it) => (
        <NavLink
          key={it.to}
          to={it.to}
          end={it.to === "/"}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-[11px] font-medium ${
              isActive ? "text-teal" : "text-muted"
            }`
          }
        >
          {it.icon}
          {it.label}
        </NavLink>
      ))}
    </nav>
  );
}
