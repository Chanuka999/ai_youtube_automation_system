import type { Request, Response } from "express";
import path from "path";

import {
  uploadVideoToYouTube,
} from "../services/youtubeUpload.service.js";

export async function uploadVideo(
  req: Request,
  res: Response
) {
  try {
    const {
      youtubeAccountId,
      videoProjectId,
      videoPath,
      title,
      description,
      hashtags = [],
      privacyStatus = "private",
    } = req.body;

    // --------------------------------
    // Validation
    // --------------------------------

    if (!youtubeAccountId) {
      return res.status(400).json({
        success: false,
        message:
          "youtubeAccountId is required",
      });
    }

    if (!videoPath) {
      return res.status(400).json({
        success: false,
        message:
          "videoPath is required",
      });
    }

    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "title is required",
      });
    }

    if (!["private", "public", "unlisted"].includes(
      privacyStatus
    )) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid privacy status",
      });
    }

    // --------------------------------
    // Temporary user
    // --------------------------------

    // Later replace with req.user.id
    const userId = 1;

    // --------------------------------
    // Upload
    // --------------------------------
const cleanedVideoPath = videoPath.replace(/^(\.\/|\/)/, '');
    const result =
      await uploadVideoToYouTube({
        userId,

        youtubeAccountId:
          Number(youtubeAccountId),

        videoProjectId:
          videoProjectId
            ? Number(videoProjectId)
            : null,

     videoPath: path.join(
          process.cwd(),
          cleanedVideoPath
        ),

        title: title.trim(),

        description:
          description?.trim() || "",

        hashtags,

        privacyStatus,

        onProgress(progress) {
          console.log(
            `YouTube upload: ${progress}%`
          );
        },
      });

    return res.status(200).json(
      result
    );
  } catch (error: any) {
    console.error(
      "YouTube upload error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "YouTube upload failed",
    });
  }
}