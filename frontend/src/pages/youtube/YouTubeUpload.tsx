import { useEffect, useState } from "react";

import {
  CheckCircle2,
  ExternalLink,
  Loader2,
  Upload,
  PlaySquare as Youtube,
  XCircle,
} from "lucide-react";

import {
  getUploadStatus,
  uploadYouTubeVideo,
  type UploadProgress,
} from "../../services/youtube.service";
import { getVideoProjects } from "../../services/videoProject.service";
import type { VideoProject } from "../../types/videoProject";

export default function YouTubeUpload() {
  const [videoPath, setVideoPath] =
    useState("");

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [hashtags, setHashtags] =
    useState("");

  const [privacyStatus, setPrivacyStatus] =
    useState<
      "private" | "public" | "unlisted"
    >("private");

  const [uploading, setUploading] =
    useState(false);

  const [upload, setUpload] =
    useState<UploadProgress | null>(null);

  const [projects, setProjects] = useState<VideoProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | "">("");

  useEffect(() => {
    getVideoProjects()
      .then(setProjects)
      .catch((err) => console.error("Failed to fetch video projects", err));
  }, []);

  function handleProjectSelect(id: string) {
    const projectId = id === "" ? "" : Number(id);
    setSelectedProjectId(projectId);

    if (projectId === "") return;

    const project = projects.find((p) => p.id === projectId);
    if (project) {
      if (project.video_path) setVideoPath(project.video_path);
      if (project.title) setTitle(project.title);
      if (project.description) setDescription(project.description);
      if (project.hashtags) setHashtags(project.hashtags);
    }
  }

  async function handleUpload() {
    if (!videoPath) {
      alert("Please enter video path");
      return;
    }

    if (!title.trim()) {
      alert("Please enter video title");
      return;
    }

    try {
      setUploading(true);

      const response =
        await uploadYouTubeVideo({
          youtubeAccountId: 1,

          videoProjectId: selectedProjectId === "" ? null : selectedProjectId,

          videoPath,

          title,

          description,

          hashtags: hashtags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),

          privacyStatus,
        });

      const uploadLogId =
        response.uploadLogId;

      setUpload({
        uploadLogId,
        progress: 0,
        status: "uploading",
      });

      pollUploadStatus(
        uploadLogId
      );
    } catch (error) {
      console.error(error);

      setUploading(false);

      alert(
        "Failed to upload video"
      );
    }
  }

  async function pollUploadStatus(
    uploadLogId: number
  ) {
    try {
      const response =
        await getUploadStatus(
          uploadLogId
        );

      const data =
        response.data;

      setUpload(data);

      if (
        data.status ===
          "completed" ||
        data.status ===
          "failed"
      ) {
        setUploading(false);
        return;
      }

      setTimeout(() => {
        pollUploadStatus(
          uploadLogId
        );
      }, 1000);
    } catch (error) {
      console.error(
        "Progress error:",
        error
      );

      setUploading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}

      <div>
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-red-600 p-3 text-white">
            <Youtube size={22} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              YouTube Upload
            </h1>

            <p className="text-sm text-slate-500">
              Upload your generated Short
              directly to YouTube.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upload Form */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Video Details
          </h2>

          <div className="mt-6 space-y-5">
            {/* Project Selection */}
            {projects.length > 0 && (
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                <label className="mb-2 block text-sm font-semibold text-blue-900">
                  Select Generated Video
                </label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => handleProjectSelect(e.target.value)}
                  className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
                >
                  <option value="">-- Or type details manually below --</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title || `Project #${p.id} (${p.topic})`}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-xs text-blue-700">
                  Selecting a video will auto-fill the details below.
                </p>
              </div>
            )}

            {/* Video path */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                MP4 Video Path
              </label>

              <input
                value={videoPath}
                onChange={(e) =>
                  setVideoPath(
                    e.target.value
                  )
                }
                placeholder="./uploads/videos/test-short.mp4"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-500"
              />

              <p className="mt-2 text-xs text-slate-400">
                Example:
                ./uploads/videos/test-short.mp4
              </p>
            </div>

            {/* Title */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Title
              </label>

              <input
                value={title}
                onChange={(e) =>
                  setTitle(
                    e.target.value
                  )
                }
                placeholder="Amazing Football Goal 🔥"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-500"
              />
            </div>

            {/* Description */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Description
              </label>

              <textarea
                rows={5}
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
                placeholder="Write your YouTube description..."
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-500"
              />
            </div>

            {/* Hashtags */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Hashtags
              </label>

              <input
                value={hashtags}
                onChange={(e) =>
                  setHashtags(
                    e.target.value
                  )
                }
                placeholder="#football, #soccer, #shorts"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-500"
              />

              <p className="mt-2 text-xs text-slate-400">
                Separate hashtags with commas.
              </p>
            </div>

            {/* Privacy */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Privacy
              </label>

              <select
                value={privacyStatus}
                onChange={(e) =>
                  setPrivacyStatus(
                    e.target.value as
                      | "private"
                      | "public"
                      | "unlisted"
                  )
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
              >
                <option value="private">
                  Private
                </option>

                <option value="unlisted">
                  Unlisted
                </option>

                <option value="public">
                  Public
                </option>
              </select>
            </div>

            {/* Upload button */}

            <button
              onClick={handleUpload}
              disabled={uploading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />

                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={18} />

                  Upload to YouTube
                </>
              )}
            </button>
          </div>
        </div>

        {/* Progress */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Upload Progress
          </h2>

          {!upload ? (
            <div className="flex min-h-[400px] items-center justify-center text-center">
              <div>
                <Upload
                  size={42}
                  className="mx-auto text-slate-300"
                />

                <p className="mt-4 text-sm text-slate-500">
                  Upload progress will
                  appear here.
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-8">
              {/* Percentage */}

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    {upload.status ===
                    "completed"
                      ? "Upload Complete"
                      : upload.status ===
                        "failed"
                      ? "Upload Failed"
                      : "Uploading Video"}
                  </p>
                </div>

                <p className="text-3xl font-bold text-slate-900">
                  {upload.progress}%
                </p>
              </div>

              {/* Progress bar */}

              <div className="mt-4 h-4 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-red-600 transition-all duration-300"
                  style={{
                    width: `${upload.progress}%`,
                  }}
                />
              </div>

              {/* Status */}

              <div className="mt-6">
                {upload.status ===
                  "uploading" && (
                  <div className="flex items-center gap-3 rounded-xl bg-blue-50 p-4 text-sm text-blue-700">
                    <Loader2
                      size={20}
                      className="animate-spin"
                    />

                    Uploading video
                    to YouTube...
                  </div>
                )}

                {upload.status ===
                  "completed" && (
                  <div className="rounded-xl bg-green-50 p-4">
                    <div className="flex items-center gap-3 text-sm font-medium text-green-700">
                      <CheckCircle2
                        size={20}
                      />

                      Video uploaded
                      successfully!
                    </div>

                    {upload.youtubeVideoUrl && (
                      <a
                        href={
                          upload.youtubeVideoUrl
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 flex items-center gap-2 text-sm font-medium text-green-700 underline"
                      >
                        View on YouTube

                        <ExternalLink
                          size={15}
                        />
                      </a>
                    )}
                  </div>
                )}

                {upload.status ===
                  "failed" && (
                  <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
                    <div className="flex items-center gap-3 font-medium">
                      <XCircle
                        size={20}
                      />

                      Upload failed
                    </div>

                    {upload.errorMessage && (
                      <p className="mt-2 text-xs">
                        {
                          upload.errorMessage
                        }
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}