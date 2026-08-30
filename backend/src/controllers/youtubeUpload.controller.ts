import type { Request, Response } from "express";
import path from "path";
import { db } from "../config/database.js";
import {
  uploadVideoToYouTube,
} from "../services/youtubeUpload.service.js";
import {getUploadProgress} from "../services/uploadProgress.service.js";

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

export async function getUploadStatus(
  req: Request,
  res: Response
) {
  try {
    const uploadLogId =
      Number(req.params.id);

    if (!uploadLogId) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid upload log ID",
      });
    }

    const progress =
      getUploadProgress(uploadLogId);

    if (!progress) {
      return res.status(404).json({
        success: false,
        message:
          "Upload progress not found",
      });
    }

    return res.json({
      success: true,
      data: progress,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "Failed to get upload status",
    });
  }
}

export async function getUploadHistory(
  req: Request,
  res: Response
) {
  try {
    const userId = 1;

    const [rows] = await db.query(
      `
      SELECT
        id,
        youtube_account_id,
        video_project_id,
        youtube_video_id,
        youtube_video_url,
        title,
        description,
        privacy_status,
        status,
        progress,
        error_message,
        started_at,
        completed_at,
        created_at
      FROM upload_logs
      WHERE user_id = ?
      ORDER BY created_at DESC
      `,
      [userId]
    );

    return res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error(
      "Upload history error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load upload history",
    });
  }
}