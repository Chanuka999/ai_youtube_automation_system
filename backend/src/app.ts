import express from "express";
import cors from "cors";

import videoProjectRoutes from "./routes/videoProject.routes.js";
import aiRoutes from "./routes/ai.route.js";
import youtubeRoutes from "./routes/youtube.routes.js";
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "AI YouTube Automation API is running",
  });
});

app.use("/api/video-projects", videoProjectRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/youtube", youtubeRoutes);
export default app;