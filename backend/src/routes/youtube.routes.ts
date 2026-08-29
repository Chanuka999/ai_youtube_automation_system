import { Router } from "express";

import {
  connectYouTube,
  youtubeCallback,
  getYouTubeStatus,
} from "../controllers/youtube.controller.js";

const router = Router();

router.get("/connect", connectYouTube);

router.get("/status", getYouTubeStatus);

router.get("/callback", youtubeCallback);

export default router;