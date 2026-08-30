import { google } from "googleapis";
import fs from "fs";
import path from "path";

import { db } from "../config/database.js";
import { createOAuthClient } from "./youtube.service.js";

export interface UploadVideoData {
  userId: number;
  youtubeAccountId: number;

  videoProjectId?: number | null;

  videoPath: string;

  title: string;
  description: string;

  hashtags?: string[];

  privacyStatus:
    | "private"
    | "public"
    | "unlisted";

  onProgress?: (progress: number) => void;
}

export async function uploadVideoToYouTube(
  data: UploadVideoData
) {
  const {
    userId,
    youtubeAccountId,
    videoProjectId = null,
    videoPath,
    title,
    description,
    hashtags = [],
    privacyStatus,
    onProgress,
  } = data;

  // --------------------------------
  // 1. Check video file
  // --------------------------------

  if (!fs.existsSync(videoPath)) {
    throw new Error(
      `Video file not found: ${videoPath}`
    );
  }

  const stats = fs.statSync(videoPath);

  if (stats.size === 0) {
    throw new Error("Video file is empty");
  }

  // --------------------------------
  // 2. Get YouTube account
  // --------------------------------

  const [rows] = await db.query<any[]>(
    `
    SELECT
      id,
      user_id,
      channel_id,
      channel_name,
      access_token,
      refresh_token,
      token_expires_at
    FROM youtube_accounts
    WHERE id = ?
      AND user_id = ?
    LIMIT 1
    `,
    [
      youtubeAccountId,
      userId,
    ]
  );

  if (rows.length === 0) {
    throw new Error(
      "YouTube account not found"
    );
  }

  const account = rows[0];

  if (!account.refresh_token) {
    throw new Error(
      "YouTube refresh token is missing. Please reconnect your YouTube account."
    );
  }

  // --------------------------------
  // 3. Create OAuth client
  // --------------------------------

  const oauth2Client =
    createOAuthClient();

  oauth2Client.setCredentials({
    access_token:
      account.access_token,
    refresh_token:
      account.refresh_token,
  });

  // --------------------------------
  // 4. Create YouTube client
  // --------------------------------

  const youtube = google.youtube({
    version: "v3",
    auth: oauth2Client,
  });

  // --------------------------------
  // 5. Hashtags
  // --------------------------------

  const hashtagText =
    hashtags.length > 0
      ? `\n\n${hashtags.join(" ")}`
      : "";

  const finalDescription =
    `${description}${hashtagText}`;

  // --------------------------------
  // 6. Create upload log
  // --------------------------------

  const [logResult] = await db.execute<any>(
    `
    INSERT INTO upload_logs
    (
      user_id,
      youtube_account_id,
      video_project_id,
      title,
      description,
      privacy_status,
      status,
      progress,
      started_at
    )
    VALUES (?, ?, ?, ?, ?, ?, 'uploading', 0, NOW())
    `,
    [
      userId,
      youtubeAccountId,
      videoProjectId,
      title,
      finalDescription,
      privacyStatus,
    ]
  );

  const uploadLogId =
    logResult.insertId;

  try {
    // --------------------------------
    // 7. Create video stream
    // --------------------------------

    const videoStream =
      fs.createReadStream(videoPath);

    // --------------------------------
    // 8. Upload to YouTube
    // --------------------------------

    const response =
      await youtube.videos.insert({
        part: ["snippet", "status"],

        requestBody: {
          snippet: {
            title,
            description: finalDescription,
            categoryId: "17",
          },

          status: {
            privacyStatus,
            selfDeclaredMadeForKids: false,
          },
        },

        media: {
          mimeType: "video/mp4",
          body: videoStream,
        },
      });

    // --------------------------------
    // 9. Get YouTube video ID
    // --------------------------------

    const youtubeVideoId =
      response.data.id;

    if (!youtubeVideoId) {
      throw new Error(
        "YouTube did not return a video ID"
      );
    }

    const youtubeVideoUrl =
      `https://www.youtube.com/watch?v=${youtubeVideoId}`;

    // --------------------------------
    // 10. Update upload log
    // --------------------------------

    await db.execute(
      `
      UPDATE upload_logs
      SET
        youtube_video_id = ?,
        youtube_video_url = ?,
        status = 'completed',
        progress = 100,
        completed_at = NOW()
      WHERE id = ?
      `,
      [
        youtubeVideoId,
        youtubeVideoUrl,
        uploadLogId,
      ]
    );

    onProgress?.(100);

    return {
      success: true,

      uploadLogId,

      youtubeVideoId,

      youtubeVideoUrl,

      status: "completed",
    };
  } catch (error: any) {
    // --------------------------------
    // 11. Save error
    // --------------------------------

    const errorMessage =
      error?.message ||
      "YouTube upload failed";

    await db.execute(
      `
      UPDATE upload_logs
      SET
        status = 'failed',
        error_message = ?
      WHERE id = ?
      `,
      [
        errorMessage,
        uploadLogId,
      ]
    );

    throw error;
  }
}