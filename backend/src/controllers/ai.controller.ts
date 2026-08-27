import type { Request, Response } from "express";
import { generateVideoContent } from "../services/ai.service.js";

export async function generateContent(
  req: Request,
  res: Response
) {
  try {
    const {
      topic,
      niche = "General",
      duration = 30,
    } = req.body;

    if (!topic?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Topic is required",
      });
    }

    const result = await generateVideoContent(
      topic,
      niche,
      Number(duration)
    );

    return res.json({
      success: true,
      message: "Content generated successfully",
      data: result,
    });
  } catch (error) {
    console.error("AI generation error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate AI content",
    });
  }
}