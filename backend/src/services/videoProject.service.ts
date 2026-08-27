import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../config/database.js";

export interface VideoProject extends RowDataPacket {
  id: number;
  user_id: number;
  title: string | null;
  topic: string;
  niche: string;
  video_type: "short" | "long";
  duration: number | null;
  status:
    | "draft"
    | "generating"
    | "processing"
    | "ready"
    | "scheduled"
    | "uploaded"
    | "failed";
  created_at: Date;
  updated_at: Date;
}

export interface CreateVideoProjectData {
  user_id: number;
  title?: string;
  topic: string;
  niche?: string;
  video_type?: "short" | "long";
  duration?: number;
}

export interface UpdateVideoProjectData {
  title?: string;
  topic?: string;
  niche?: string;
  video_type?: "short" | "long";
  duration?: number;
  status?: VideoProject["status"];
}

export async function getAllVideoProjects(): Promise<VideoProject[]> {
  const [rows] = await db.query<VideoProject[]>(
    `
    SELECT *
    FROM video_projects
    ORDER BY created_at DESC
    `
  );

  return rows;
}

export async function getVideoProjectById(
  id: number
): Promise<VideoProject | null> {
  const [rows] = await db.query<VideoProject[]>(
    `
    SELECT *
    FROM video_projects
    WHERE id = ?
    LIMIT 1
    `,
    [id]
  );

  return rows[0] ?? null;
}

export async function createVideoProject(
  data: CreateVideoProjectData
): Promise<number> {
  const [result] = await db.execute<ResultSetHeader>(
    `
    INSERT INTO video_projects
    (
      user_id,
      title,
      topic,
      niche,
      video_type,
      duration
    )
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [
      data.user_id,
      data.title || null,
      data.topic,
      data.niche || "General",
      data.video_type || "short",
      data.duration || null,
    ]
  );

  return result.insertId;
}

export async function updateVideoProject(
  id: number,
  data: UpdateVideoProjectData
): Promise<boolean> {
  const fields: string[] = [];
 const values: Array<string | number | boolean | null> = [];

  if (data.title !== undefined) {
    fields.push("title = ?");
    values.push(data.title);
  }

  if (data.topic !== undefined) {
    fields.push("topic = ?");
    values.push(data.topic);
  }

  if (data.niche !== undefined) {
    fields.push("niche = ?");
    values.push(data.niche);
  }

  if (data.video_type !== undefined) {
    fields.push("video_type = ?");
    values.push(data.video_type);
  }

  if (data.duration !== undefined) {
    fields.push("duration = ?");
    values.push(data.duration);
  }

  if (data.status !== undefined) {
    fields.push("status = ?");
    values.push(data.status);
  }

  if (fields.length === 0) {
    return false;
  }

  values.push(id);

  const [result] = await db.execute<ResultSetHeader>(
    `
    UPDATE video_projects
    SET ${fields.join(", ")}
    WHERE id = ?
    `,
    values
  );

  return result.affectedRows > 0;
}

export async function deleteVideoProject(id: number): Promise<boolean> {
  const [result] = await db.execute<ResultSetHeader>(
    `
    DELETE FROM video_projects
    WHERE id = ?
    `,
    [id]
  );

  return result.affectedRows > 0;
}