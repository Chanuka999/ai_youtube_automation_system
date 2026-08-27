import { Outlet } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <Header />

      <main className="ml-64 pt-20">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}