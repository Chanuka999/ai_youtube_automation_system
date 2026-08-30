import { Router } from "express";

import {
  connectYouTube,
  youtubeCallback,
  getYouTubeStatus,
} from "../controllers/youtube.controller.js";
import { uploadVideo, getUploadStatus, getUploadHistory } from "../controllers/youtubeUpload.controller.js";
const router = Router();

router.get("/connect", connectYouTube);

router.get("/status", getYouTubeStatus);

router.get("/callback", youtubeCallback);
router.post("/upload",uploadVideo);
router.get("/upload/:id/status",getUploadStatus);
router.get("/uploads",getUploadHistory);
export default router;