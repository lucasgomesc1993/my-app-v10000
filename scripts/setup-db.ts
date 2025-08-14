import { db } from "../lib/db";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import * as path from "path";

async function setupDatabase() {
  try {
    console.log("🚀 Configurando banco de dados...");
    
    // 1. Executar migrações
    console.log("🔄 Executando migrações...");
    const migrationsFolder = path.join(process.cwd(), 'drizzle');
    await migrate(db, { migrationsFolder });
    console.log("✅ Migrações executadas com sucesso!");
    
    // 2. Executar seed
    console.log("🌱 Executando seed do banco de dados...");
    const { seedDatabase } = await import("../lib/db/seed");
    await seedDatabase();
    
    console.log("✅ Banco de dados configurado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao configurar o banco de dados:", error);
    process.exit(1);
  }
}

setupDatabase();
