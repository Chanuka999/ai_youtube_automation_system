import { useEffect, useState } from "react";

import {
  CheckCircle2,
  ExternalLink,
  Loader2,
  XCircle,
} from "lucide-react";
//check
import {
  getUploadHistory,
} from "../../services/youtube.service";

interface UploadLog {
  id: number;
  youtube_video_id: string | null;
  youtube_video_url: string | null;
  title: string;
  privacy_status:
    | "private"
    | "public"
    | "unlisted";
  status:
    | "pending"
    | "uploading"
    | "processing"
    | "completed"
    | "failed";
  progress: number;
  error_message: string | null;
  created_at: string;
}

export default function YouTubeUploadHistory() {
  const [uploads, setUploads] =
    useState<UploadLog[]>([]);

  const [loading, setLoading] =
    useState(true);

  async function loadHistory() {
    try {
      setLoading(true);

      const response =
        await getUploadHistory();

      setUploads(
        response.data
      );
    } catch (error) {
      console.error(
        "Failed to load history:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Upload History
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          View your YouTube upload history.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <Loader2
              size={28}
              className="animate-spin text-slate-400"
            />
          </div>
        ) : uploads.length === 0 ? (
          <div className="flex min-h-[300px] items-center justify-center text-sm text-slate-500">
            No YouTube uploads yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">
                    Video
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">
                    Privacy
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">
                    Date
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {uploads.map(
                  (upload) => (
                    <tr
                      key={upload.id}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="px-6 py-5">
                        <div className="max-w-sm">
                          <p className="truncate font-medium text-slate-800">
                            {upload.title}
                          </p>

                          {upload.youtube_video_id && (
                            <p className="mt-1 text-xs text-slate-400">
                              ID:{" "}
                              {
                                upload.youtube_video_id
                              }
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium capitalize text-slate-600">
                          {
                            upload.privacy_status
                          }
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        {upload.status ===
                          "completed" && (
                          <span className="flex w-fit items-center gap-2 rounded-lg bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700">
                            <CheckCircle2
                              size={15}
                            />

                            Completed
                          </span>
                        )}

                        {upload.status ===
                          "uploading" && (
                          <span className="flex w-fit items-center gap-2 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700">
                            <Loader2
                              size={15}
                              className="animate-spin"
                            />

                            {upload.progress}%
                          </span>
                        )}

                        {upload.status ===
                          "failed" && (
                          <span className="flex w-fit items-center gap-2 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700">
                            <XCircle
                              size={15}
                            />

                            Failed
                          </span>
                        )}

                        {upload.status ===
                          "processing" && (
                          <span className="rounded-lg bg-yellow-50 px-3 py-1.5 text-xs font-medium text-yellow-700">
                            Processing
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-500">
                        {new Date(
                          upload.created_at
                        ).toLocaleString()}
                      </td>

                      <td className="px-6 py-5">
                        {upload.youtube_video_url && (
                          <a
                            href={
                              upload.youtube_video_url
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="flex w-fit items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                          >
                            View

                            <ExternalLink
                              size={14}
                            />
                          </a>
                        )}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}