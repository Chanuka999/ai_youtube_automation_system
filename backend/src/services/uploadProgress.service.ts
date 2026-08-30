interface UploadProgress {
  uploadLogId: number;
  progress: number;
  status:
    | "pending"
    | "uploading"
    | "processing"
    | "completed"
    | "failed";
  youtubeVideoId?: string;
  youtubeVideoUrl?: string;
  errorMessage?: string;
}

const progressMap = new Map<number, UploadProgress>();

export function createUploadProgress(
  uploadLogId: number
) {
  progressMap.set(uploadLogId, {
    uploadLogId,
    progress: 0,
    status: "pending",
  });
}

export function updateUploadProgress(
  uploadLogId: number,
  data: Partial<UploadProgress>
) {
  const current =
    progressMap.get(uploadLogId);

  if (!current) {
    return;
  }

  progressMap.set(uploadLogId, {
    ...current,
    ...data,
  });
}

export function getUploadProgress(
  uploadLogId: number
) {
  return progressMap.get(uploadLogId) ?? null;
}