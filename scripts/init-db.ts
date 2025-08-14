import { db } from "../lib/db/index";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { seedDatabase } from "../lib/db/seed";
import Database from "better-sqlite3";
import * as path from "path";
import * as fs from "fs";

async function main() {
  let sqlite: Database.Database | null = null;
  
  try {
    console.log("🚀 Inicializando banco de dados...");
    
    // Garantir que o diretório de migrações existe
    const migrationsFolder = path.join(process.cwd(), 'drizzle');
    if (!fs.existsSync(migrationsFolder)) {
      fs.mkdirSync(migrationsFolder, { recursive: true });
      console.log("📁 Pasta de migrações criada");
    }
    
    // Criar o banco de dados se não existir
    const dbPath = path.join(process.cwd(), 'sqlite.db');
    sqlite = new Database(dbPath);
    
    // Executar migrações
    console.log("🔄 Executando migrações...");
    migrate(db, { migrationsFolder: migrationsFolder });
    console.log("✅ Migrações executadas com sucesso!");
    
    // Popular com dados de exemplo
    console.log("🌱 Executando seed do banco de dados...");
    await seedDatabase();
    
    console.log("✅ Banco de dados inicializado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao inicializar banco de dados:", error);
    process.exit(1);
  } finally {
    // Fechar a conexão com o banco de dados
    if (sqlite) {
      sqlite.close();
    }
  }
}

main();
