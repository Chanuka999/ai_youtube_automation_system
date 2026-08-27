import { Router } from "express";
import { generateContent } from "../controllers/ai.controller.js";

const router = Router();

router.post("/generate-content", generateContent);

export default router;