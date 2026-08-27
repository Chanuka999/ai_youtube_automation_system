import { Bell, UserCircle } from "lucide-react";

export default function Header() {
  return (
    <header className="fixed left-64 right-0 top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          AI YouTube Automation
        </h2>

        <p className="text-sm text-slate-500">
          Create and automate your YouTube Shorts
        </p>
      </div>

      <div className="flex items-center gap-5">
        <button className="relative text-slate-500 hover:text-slate-900">
          <Bell size={20} />

          <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="flex items-center gap-2">
          <UserCircle size={32} className="text-slate-400" />

          <div>
            <p className="text-sm font-semibold text-slate-800">
              Admin
            </p>

            <p className="text-xs text-slate-500">
              Administrator
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}