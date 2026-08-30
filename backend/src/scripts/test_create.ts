import { db } from "../config/database.js";
import { createVideoProjectController } from "../controllers/videoProject.controller.js";

async function testCreate() {
  try {
    const req = {
      body: {
        user_id: 1,
        topic: "test AI generation",
        niche: "tech",
        video_type: "short",
        duration: 30
      }
    };
    
    const res = {
      status: (code: number) => ({
        json: (data: any) => {
          console.log(code, data);
        }
      })
    };

    await createVideoProjectController(req as any, res as any);
  } catch (error) {
    console.error("Error creating AI:", error);
  } finally {
    process.exit(0);
  }
}

testCreate();
