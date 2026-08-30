import api from "./api";

export interface UploadProgress {
  uploadLogId?: number;
  status: "pending" | "uploading" | "processing" | "completed" | "failed";
  progress: number;
  youtubeVideoId?: string;
  youtubeVideoUrl?: string;
  errorMessage?: string;
}

export const getUploadHistory = async () => {
  return await api.get("/youtube/uploads");
};

export const uploadYouTubeVideo = async (data: any) => {
  const response = await api.post("/youtube/upload", data);
  return response.data;
};

export const getUploadStatus = async (id: number) => {
  return await api.get(`/youtube/upload/${id}/status`);
};
