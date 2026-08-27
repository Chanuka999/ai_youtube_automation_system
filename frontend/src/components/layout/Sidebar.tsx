import {
  CalendarClock,
  Clapperboard,
  LayoutDashboard,
  Settings,
  Sparkles,
  Video,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menuItems = [
  {
    label: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Video Projects",
    path: "/videos",
    icon: Clapperboard,
  },
  {
    label: "AI Generator",
    path: "/generator",
    icon: Sparkles,
  },
  {
    label: "Schedule",
    path: "/schedule",
    icon: CalendarClock,
  },
  {
    label: "YouTube",
    path: "/youtube",
    icon: Video,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-slate-200 bg-white">
      <div className="flex h-20 items-center border-b border-slate-200 px-6">
        <div>
          <h1 className="text-lg font-bold text-slate-900">
            AI YouTube
          </h1>

          <p className="text-xs text-slate-500">
            Automation
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              <Icon size={18} />

              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 p-4">
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-sm font-semibold text-slate-800">
            Automation
          </p>

          <p className="mt-1 text-xs text-slate-500">
            System is ready
          </p>
        </div>
      </div>
    </aside>
  );
}