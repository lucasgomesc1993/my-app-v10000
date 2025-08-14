import { db } from "../lib/db";
import { sql } from "drizzle-orm";

async function resetDatabase() {
  try {
    console.log("🚀 Inicializando banco de dados...");
    
    // Drop all tables if they exist
    console.log("🧹 Limpando tabelas existentes...");
    await db.run(sql`PRAGMA foreign_keys = OFF`);
    
    // Get all table names
    const tables = await db.all(
      sql`SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'`
    );
    
    // Drop all tables
    for (const table of tables) {
      const tableName = (table as { name: string }).name;
      await db.run(sql`DROP TABLE IF EXISTS ${sql.raw(tableName)}`);
    }
    
    await db.run(sql`PRAGMA foreign_keys = ON`);
    
    // Import and run the seed
    console.log("🌱 Executando seed do banco de dados...");
    const { seedDatabase } = await import("../lib/db/seed");
    await seedDatabase();
    
    console.log("✅ Banco de dados reinicializado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao reinicializar o banco de dados:", error);
    process.exit(1);
  }
}

resetDatabase();
