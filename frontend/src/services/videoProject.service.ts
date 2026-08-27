import api from "./api";

import type {
  CreateVideoProjectPayload,
  UpdateVideoProjectPayload,
  VideoProject,
} from "../types/videoProject";

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export async function getVideoProjects(): Promise<VideoProject[]> {
  const response = await api.get<ApiResponse<VideoProject[]>>(
    "/video-projects"
  );

  return response.data.data;
}

export async function getVideoProject(
  id: number
): Promise<VideoProject> {
  const response = await api.get<ApiResponse<VideoProject>>(
    `/video-projects/${id}`
  );

  return response.data.data;
}

export async function createVideoProject(
  data: CreateVideoProjectPayload
): Promise<VideoProject> {
  const response = await api.post<ApiResponse<VideoProject>>(
    "/video-projects",
    data
  );

  return response.data.data;
}

export async function updateVideoProject(
  id: number,
  data: UpdateVideoProjectPayload
): Promise<VideoProject> {
  const response = await api.put<ApiResponse<VideoProject>>(
    `/video-projects/${id}`,
    data
  );

  return response.data.data;
}

export async function deleteVideoProject(
  id: number
): Promise<void> {
  await api.delete(`/video-projects/${id}`);
}