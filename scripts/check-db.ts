import { db } from "../lib/db";
import { sql } from "drizzle-orm";

async function checkDatabase() {
  try {
    // Test the database connection
    const result = await db.select().from(sql`sqlite_master`).limit(1);
    console.log("✅ Database connection successful");
    console.log("Tables in database:", result);
  } catch (error) {
    console.error("❌ Error connecting to database:", error);
  }
}

checkDatabase();
