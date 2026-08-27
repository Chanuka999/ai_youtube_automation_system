import { useEffect, useState } from "react";
import {
  Edit3,
  Plus,
  Trash2,
} from "lucide-react";

import VideoProjectModal from "../../components/video/VideoProjectModel";

import {
  createVideoProject,
  deleteVideoProject,
  getVideoProjects,
  updateVideoProject,
} from "../../services/videoProject.service";

import type {
  CreateVideoProjectPayload,
  VideoProject,
} from "../../types/videoProject";

export default function VideoProjects() {
  const [projects, setProjects] = useState<
    VideoProject[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);

  const [editingProject, setEditingProject] =
    useState<VideoProject | null>(null);

  async function loadProjects() {
    try {
      setLoading(true);

      const data = await getVideoProjects();

      setProjects(data);
    } catch (error) {
      console.error("Failed to load projects:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  function openCreateModal() {
    setEditingProject(null);
    setModalOpen(true);
  }

  function openEditModal(project: VideoProject) {
    setEditingProject(project);
    setModalOpen(true);
  }

  async function handleSubmit(
    data: CreateVideoProjectPayload
  ) {
    if (editingProject) {
      const updated = await updateVideoProject(
        editingProject.id,
        data
      );

      setProjects((current) =>
        current.map((item) =>
          item.id === updated.id ? updated : item
        )
      );

      return;
    }

    const created = await createVideoProject(data);

    setProjects((current) => [
      created,
      ...current,
    ]);
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteVideoProject(id);

      setProjects((current) =>
        current.filter((item) => item.id !== id)
      );
    } catch (error) {
      console.error(
        "Failed to delete project:",
        error
      );
    }
  }

  function getStatusClass(status: string) {
    switch (status) {
      case "ready":
        return "bg-green-100 text-green-700";

      case "uploaded":
        return "bg-blue-100 text-blue-700";

      case "processing":
      case "generating":
        return "bg-yellow-100 text-yellow-700";

      case "failed":
        return "bg-red-100 text-red-700";

      case "scheduled":
        return "bg-purple-100 text-purple-700";

      default:
        return "bg-slate-100 text-slate-600";
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Video Projects
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your AI generated video projects.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
        >
          <Plus size={18} />

          Create Project
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-10 text-center text-sm text-slate-500">
            Loading projects...
          </div>
        ) : projects.length === 0 ? (
          <div className="p-14 text-center">
            <p className="text-sm font-medium text-slate-700">
              No video projects yet
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Create your first project to get started.
            </p>

            <button
              onClick={openCreateModal}
              className="mt-5 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white"
            >
              Create Project
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Project
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Niche
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Type
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Duration
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {projects.map((project) => (
                  <tr
                    key={project.id}
                    className="border-b border-slate-100 last:border-0"
                  >
                    <td className="px-6 py-5">
                      <div>
                        <p className="font-medium text-slate-900">
                          {project.title ||
                            "Untitled Project"}
                        </p>

                        <p className="mt-1 max-w-md truncate text-xs text-slate-500">
                          {project.topic}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-600">
                      {project.niche}
                    </td>

                    <td className="px-6 py-5">
                      <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-600">
                        {project.video_type}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-600">
                      {project.duration
                        ? `${project.duration}s`
                        : "-"}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`rounded-lg px-3 py-1 text-xs font-semibold capitalize ${getStatusClass(
                          project.status
                        )}`}
                      >
                        {project.status}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() =>
                            openEditModal(project)
                          }
                          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                        >
                          <Edit3 size={17} />
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(project.id)
                          }
                          className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <VideoProjectModal
        open={modalOpen}
        project={editingProject}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}