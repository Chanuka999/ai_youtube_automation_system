import type { Request, Response } from "express";
import { google } from "googleapis";

import {
  createOAuthClient,
  getYouTubeAuthorizationUrl,
} from "../services/youtube.service.js";

import { db } from "../config/database.js";

export async function connectYouTube(
  req: Request,
  res: Response
) {
  try {
    // Temporary until authentication is implemented.
    const userId = 1;

    const state = String(userId);

    const authorizationUrl =
      getYouTubeAuthorizationUrl(state);

    return res.redirect(authorizationUrl);
  } catch (error) {
    console.error(
      "YouTube connect error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to connect YouTube",
    });
  }
}

export async function youtubeCallback(
  req: Request,
  res: Response
) {
  try {
    const { code, state, error } = req.query;

    if (error) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/youtube?error=${encodeURIComponent(
          String(error)
        )}`
      );
    }

    if (!code || !state) {
      return res.status(400).json({
        success: false,
        message: "Missing OAuth code or state",
      });
    }

    const userId = Number(state);

    if (!Number.isInteger(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid OAuth state",
      });
    }

    const oauth2Client = createOAuthClient();

    const { tokens } =
      await oauth2Client.getToken(String(code));

    console.log("GRANTED SCOPES:", tokens.scope);

    oauth2Client.setCredentials(tokens);

    const youtube = google.youtube({
      version: "v3",
      auth: oauth2Client,
    });

    const response =
      await youtube.channels.list({
        part: ["snippet", "contentDetails"],
        mine: true,
      });

    const channel =
      response.data.items?.[0];

    if (!channel) {
      return res.status(400).json({
        success: false,
        message:
          "No YouTube channel found for this account",
      });
    }

    const channelId = channel.id;

    const channelName =
      channel.snippet?.title || "YouTube Channel";

    const channelThumbnail =
      channel.snippet?.thumbnails?.default?.url ||
      null;

    const accessToken =
      tokens.access_token || null;

    const refreshToken =
      tokens.refresh_token || null;

    let tokenExpiresAt: Date | null = null;

    if (tokens.expiry_date) {
      tokenExpiresAt = new Date(tokens.expiry_date);
    }

    const [existingRows] = await db.query<any[]>(
      `
      SELECT id
      FROM youtube_accounts
      WHERE user_id = ?
      LIMIT 1
      `,
      [userId]
    );

    if (existingRows.length > 0) {
      const existingId = existingRows[0].id;

      await db.execute(
        `
        UPDATE youtube_accounts
        SET
          channel_id = ?,
          channel_name = ?,
          channel_thumbnail = ?,
          access_token = ?,
          refresh_token = COALESCE(?, refresh_token),
          token_expires_at = ?
        WHERE id = ?
        `,
       [
          channelId ?? null,
          channelName,
          channelThumbnail ?? null,
          accessToken ?? null,
          refreshToken ?? null,
          tokenExpiresAt ?? null,
          existingId,
        ]
      );
    } else {
      await db.execute(
        `
        INSERT INTO youtube_accounts
        (
          user_id,
          channel_id,
          channel_name,
          channel_thumbnail,
          access_token,
          refresh_token,
          token_expires_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
          userId,
          channelId,
          channelName,
          channelThumbnail,
          accessToken,
          refreshToken,
          tokenExpiresAt,
        ]
      );
    }

    return res.redirect(
      `${process.env.FRONTEND_URL}/youtube?connected=true`
    );
  } catch (error) {
    console.error(
      "YouTube callback error:",
      error
    );

    return res.redirect(
      `${process.env.FRONTEND_URL}/youtube?error=oauth_failed`
    );
  }
}

export async function getYouTubeStatus(
  req: Request,
  res: Response
) {
  try {
    const userId = 1; // Temporary until auth is implemented

    const [rows] = await db.query<any[]>(
      `
      SELECT channel_name, channel_thumbnail 
      FROM youtube_accounts 
      WHERE user_id = ? 
      LIMIT 1
      `,
      [userId]
    );

    if (rows.length > 0) {
      return res.json({
        success: true,
        connected: true,
        channelName: rows[0].channel_name,
        channelThumbnail: rows[0].channel_thumbnail,
      });
    }

    return res.json({
      success: true,
      connected: false,
    });
  } catch (error) {
    console.error("YouTube status error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get YouTube status",
    });
  }
}