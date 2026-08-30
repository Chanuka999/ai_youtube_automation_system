import { db } from "../config/database.js";

async function testQuery() {
  try {
    const [rows] = await db.query("SELECT * FROM video_projects ORDER BY created_at DESC LIMIT 1");
    console.log(JSON.stringify(rows, null, 2));
  } catch (error) {
    console.error(error);
  } finally {
    process.exit(0);
  }
}
testQuery();
