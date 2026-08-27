export type VideoType = "short" | "long";

export type VideoStatus =
  | "draft"
  | "generating"
  | "processing"
  | "ready"
  | "scheduled"
  | "uploaded"
  | "failed";

export interface VideoProject {
  id: number;
  user_id: number;
  title: string | null;
  topic: string;
  niche: string;
  video_type: VideoType;
  duration: number | null;
  status: VideoStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateVideoProjectPayload {
  user_id: number;
  title?: string;
  topic: string;
  niche?: string;
  video_type?: VideoType;
  duration?: number;
}

export interface UpdateVideoProjectPayload {
  title?: string;
  topic?: string;
  niche?: string;
  video_type?: VideoType;
  duration?: number;
  status?: VideoStatus;
}