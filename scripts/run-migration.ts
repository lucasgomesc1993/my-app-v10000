import { db } from "../lib/db";
import { sql } from "drizzle-orm";
import fs from 'fs';
import path from 'path';

async function runMigration() {
  try {
    console.log("🔍 Running migration...");
    
    // Read the SQL file
    const migrationPath = path.join(__dirname, '..', 'drizzle', '0001_add_credit_cards_table.sql');
    const sqlContent = fs.readFileSync(migrationPath, 'utf8');
    
    // Split into individual statements
    const statements = sqlContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    // Execute each statement
    for (const statement of statements) {
      try {
        console.log(`\n🔧 Executing: ${statement.substring(0, 100)}...`);
        await db.run(sql.raw(statement));
        console.log("✅ Statement executed successfully");
      } catch (error) {
        console.error("❌ Error executing statement:", error);
        // Continue with next statement
      }
    }
    
    console.log("\n🏁 Migration completed!");
    
  } catch (error) {
    console.error("❌ Error running migration:", error);
  } finally {
    process.exit(0);
  }
}

runMigration();
