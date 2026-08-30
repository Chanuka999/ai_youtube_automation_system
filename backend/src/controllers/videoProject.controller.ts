import type { Request, Response } from "express";

import {
  createVideoProject,
  deleteVideoProject,
  getAllVideoProjects,
  getVideoProjectById,
  updateVideoProject,
} from "../services/videoProject.service.js";

export async function getVideoProjects(
  _req: Request,
  res: Response
) {
  try {
    const projects = await getAllVideoProjects();

    res.json({
      success: true,
      data: projects,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch video projects",
    });
  }
}

export async function getVideoProject(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
    }

    const project = await getVideoProjectById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Video project not found",
      });
    }

    return res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch video project",
    });
  }
}

export async function createVideoProjectController(
  req: Request,
  res: Response
) {
  try {
    const {
      user_id,
      title,
      topic,
      niche,
      video_type,
      duration,
      description,
      hashtags,
      video_path,
    } = req.body;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "user_id is required",
      });
    }

    if (!topic) {
      return res.status(400).json({
        success: false,
        message: "topic is required",
      });
    }

    let finalTitle = title;
    let finalDescription = description;
    let finalHashtags = hashtags;
    let initialStatus: "draft" | "ready" = "draft";

    // Auto-generate AI content if title is missing
    if (!finalTitle || !finalDescription) {
      try {
        const { generateVideoContent } = await import("../services/ai.service.js");
        const aiResult = await generateVideoContent(topic, niche || "General", duration ? Number(duration) : 30);
        
        finalTitle = finalTitle || aiResult.title;
        finalDescription = finalDescription || aiResult.description;
        finalHashtags = finalHashtags || aiResult.hashtags.join(", ");
        initialStatus = "ready";
      } catch (aiError) {
        console.error("AI Generation failed during project creation:", aiError);
        // Fallback to draft if AI fails
      }
    }

    const projectId = await createVideoProject({
      user_id,
      title: finalTitle,
      topic,
      niche,
      video_type,
      duration,
      description: finalDescription,
      hashtags: finalHashtags,
      video_path,
    });
    
    // Update status if AI generated
    if (initialStatus === "ready") {
       await import("../services/videoProject.service.js").then(m => m.updateVideoProject(projectId, { status: "ready" }));
    }

    const project = await getVideoProjectById(projectId);

    return res.status(201).json({
      success: true,
      message: "Video project created successfully",
      data: project,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create video project",
    });
  }
}

export async function updateVideoProjectController(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
    }

    const updated = await updateVideoProject(id, req.body);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Video project not found or nothing to update",
      });
    }

    const project = await getVideoProjectById(id);

    return res.json({
      success: true,
      message: "Video project updated successfully",
      data: project,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update video project",
    });
  }
}

export async function deleteVideoProjectController(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
    }

    const deleted = await deleteVideoProject(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Video project not found",
      });
    }

    return res.json({
      success: true,
      message: "Video project deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete video project",
    });
  }
}