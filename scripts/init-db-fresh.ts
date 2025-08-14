import { db } from "../lib/db";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import Database from "better-sqlite3";
import * as path from "path";
import * as fs from "fs";

async function initDatabase() {
  try {
    console.log("🚀 Inicializando banco de dados...");
    
    // 1. Garantir que o banco de dados existe
    const dbPath = path.join(process.cwd(), 'sqlite.db');
    const sqlite = new Database(dbPath);
    
    // 2. Executar migrações
    console.log("🔄 Executando migrações...");
    const migrationsFolder = path.join(process.cwd(), 'drizzle');
    
    // Criar pasta de migrações se não existir
    if (!fs.existsSync(migrationsFolder)) {
      fs.mkdirSync(migrationsFolder, { recursive: true });
    }
    
    // Executar migrações
    await migrate(db, { migrationsFolder });
    console.log("✅ Migrações executadas com sucesso!");
    
    // 3. Executar seed
    console.log("🌱 Executando seed do banco de dados...");
    const { seedDatabase } = await import("../lib/db/seed");
    await seedDatabase();
    
    console.log("✅ Banco de dados inicializado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao inicializar o banco de dados:", error);
    process.exit(1);
  }
}

initDatabase();
