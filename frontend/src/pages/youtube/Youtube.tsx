import { CheckCircle2, PlaySquare, User, History } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

export default function YouTube() {
  const [searchParams] = useSearchParams();

  const connected =
    searchParams.get("connected") === "true";

  const error = searchParams.get("error");

  const [status, setStatus] = useState<{
    connected: boolean;
    channelName?: string;
    channelThumbnail?: string;
    loading: boolean;
  }>({ connected: false, loading: true });

  useEffect(() => {
    fetch("http://localhost:5000/api/youtube/status")
      .then((res) => res.json())
      .then((data) => {
        setStatus({
          connected: data.connected,
          channelName: data.channelName,
          channelThumbnail: data.channelThumbnail,
          loading: false,
        });
      })
      .catch((err) => {
        console.error("Failed to fetch YouTube status", err);
        setStatus((prev) => ({ ...prev, loading: false }));
      });
  }, []);

  function handleConnect() {
    window.location.href =
      "http://localhost:5000/api/youtube/connect";
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            YouTube
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Connect your YouTube channel to enable
            automatic uploads.
          </p>
        </div>

        <Link
          to="/youtube/upload"
          className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800"
        >
          <History size={16} />
          View Upload History
        </Link>
      </div>

      {connected && (
        <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          <CheckCircle2 size={20} />

          YouTube channel connected successfully.
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Failed to connect YouTube. Please try again.
        </div>
      )}

      <div className="max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        {status.loading ? (
          <div className="flex h-32 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-red-600"></div>
          </div>
        ) : status.connected ? (
          <div>
            <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
              {status.channelThumbnail ? (
                <img
                  src={status.channelThumbnail}
                  alt={status.channelName}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                  <User className="text-slate-400" size={32} />
                </div>
              )}
              
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {status.channelName}
                </h2>
                <p className="text-sm text-green-600 font-medium mt-1 flex items-center gap-1">
                  <CheckCircle2 size={16} />
                  Active and ready
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleConnect}
                className="text-sm font-medium text-slate-500 hover:text-slate-700 underline"
              >
                Connect a different account
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-red-50 p-4">
                <PlaySquare
                  size={32}
                  className="text-red-600"
                />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  YouTube Channel
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Connect your channel to automatically
                  upload generated videos.
                </p>
              </div>
            </div>

            <button
              onClick={handleConnect}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700"
            >
              <PlaySquare size={18} />

              Connect YouTube Channel
            </button>
          </>
        )}
      </div>
    </div>
  );
}