import express from "express";
import cors from "cors";

import videoProjectRoutes from "./routes/videoProject.routes.js";
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

export default app;