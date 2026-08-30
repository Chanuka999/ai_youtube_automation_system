import { Router } from "express";

import {
  connectYouTube,
  youtubeCallback,
  getYouTubeStatus,
} from "../controllers/youtube.controller.js";
import {uploadVideo} from "../controllers/youtubeUpload.controller.js";
const router = Router();

router.get("/connect", connectYouTube);

router.get("/status", getYouTubeStatus);

router.get("/callback", youtubeCallback);
router.post("/upload",uploadVideo);
export default router;