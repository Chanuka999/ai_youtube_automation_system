import { generateVideoContent } from "../services/ai.service.js";

async function testAI() {
  try {
    const result = await generateVideoContent("test topic", "test niche", 30);
    console.log(result);
  } catch (error) {
    console.error("Error generating AI:", error);
  } finally {
    process.exit(0);
  }
}

testAI();
