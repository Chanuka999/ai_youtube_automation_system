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
  description: string | null;
  hashtags: string | null;
  video_path: string | null;
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
  description?: string;
  hashtags?: string;
  video_path?: string;
}

export interface UpdateVideoProjectPayload {
  title?: string;
  topic?: string;
  niche?: string;
  video_type?: VideoType;
  duration?: number;
  description?: string;
  hashtags?: string;
  video_path?: string;
  status?: VideoStatus;
}