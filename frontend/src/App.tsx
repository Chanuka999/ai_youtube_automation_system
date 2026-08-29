import { BrowserRouter, Route, Routes } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import VideoProjects from "./pages/videos/VideoProjects";
import YouTube from "./pages/youtube/Youtube";

function Placeholder({ title }: { title: string }) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">
        {title}
      </h1>

      <p className="mt-2 text-sm text-slate-500">
        This module will be implemented next.
      </p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Dashboard />} />

          <Route
            path="/videos"
            element={<VideoProjects />}
          />

          <Route
            path="/generator"
            element={<Placeholder title="AI Generator" />}
          />

          <Route
            path="/schedule"
            element={<Placeholder title="Schedule" />}
          />



          <Route
            path="/settings"
            element={<Placeholder title="Settings" />}
          />
          <Route
            path="/youtube"
            element={<YouTube />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}