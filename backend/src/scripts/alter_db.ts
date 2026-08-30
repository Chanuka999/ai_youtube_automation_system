import { db } from "../config/database.js";

async function alterTable() {
  try {
    console.log("Altering table video_projects...");
    await db.execute(`
      ALTER TABLE video_projects
      ADD COLUMN description TEXT NULL,
      ADD COLUMN hashtags TEXT NULL,
      ADD COLUMN video_path VARCHAR(255) NULL
    `);
    console.log("Table altered successfully.");
  } catch (error: any) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log("Columns already exist, skipping.");
    } else {
      console.error("Error altering table:", error);
    }
  } finally {
    process.exit(0);
  }
}

alterTable();
