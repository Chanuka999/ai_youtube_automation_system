import { Router } from "express";

import {
  createVideoProjectController,
  deleteVideoProjectController,
  getVideoProject,
  getVideoProjects,
  updateVideoProjectController,
} from "../controllers/videoProject.controller.js";

const router = Router();

router.get("/", getVideoProjects);

router.get("/:id", getVideoProject);

router.post("/", createVideoProjectController);

router.put("/:id", updateVideoProjectController);

router.delete("/:id", deleteVideoProjectController);

export default router;