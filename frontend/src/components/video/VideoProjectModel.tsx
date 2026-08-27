import { useEffect, useState, type FormEvent } from "react";
import { X } from "lucide-react";

import type {
  CreateVideoProjectPayload,
  VideoProject,
} from "../../types/videoProject";

interface Props {
  open: boolean;
  project?: VideoProject | null;
  onClose: () => void;
  onSubmit: (data: CreateVideoProjectPayload) => Promise<void>;
}

export default function VideoProjectModal({
  open,
  project,
  onClose,
  onSubmit,
}: Props) {
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [niche, setNiche] = useState("Football");
  const [videoType, setVideoType] = useState<
    "short" | "long"
  >("short");
  const [duration, setDuration] = useState("30");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (project) {
      setTitle(project.title || "");
      setTopic(project.topic);
      setNiche(project.niche);
      setVideoType(project.video_type);
      setDuration(
        project.duration ? String(project.duration) : ""
      );
    } else {
      setTitle("");
      setTopic("");
      setNiche("Football");
      setVideoType("short");
      setDuration("30");
    }
  }, [project, open]);

  if (!open) {
    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!topic.trim()) {
      return;
    }

    setLoading(true);

    try {
      await onSubmit({
        user_id: 1,
        title: title.trim() || undefined,
        topic: topic.trim(),
        niche,
        video_type: videoType,
        duration: duration
          ? Number(duration)
          : undefined,
      });

      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {project
                ? "Edit Video Project"
                : "Create Video Project"}
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Create a new project for your AI video.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6"
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Title
            </label>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="5 Football Skills..."
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Topic *
            </label>

            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter your video topic..."
              rows={3}
              className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Niche
              </label>

              <input
                value={niche}
                onChange={(e) =>
                  setNiche(e.target.value)
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Video Type
              </label>

              <select
                value={videoType}
                onChange={(e) =>
                  setVideoType(
                    e.target.value as "short" | "long"
                  )
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
              >
                <option value="short">Short</option>
                <option value="long">Long</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Duration (seconds)
            </label>

            <input
              type="number"
              min="1"
              value={duration}
              onChange={(e) =>
                setDuration(e.target.value)
              }
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-500"
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : project
                ? "Update Project"
                : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}