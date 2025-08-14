import { db } from "../lib/db";
import * as fs from "fs";
import * as path from "path";
import { sql } from "drizzle-orm";

async function applyMigrations() {
  try {
    console.log("🚀 Aplicando migrações SQL diretamente...");
    
    // Ler o arquivo de migração
    const migrationPath = path.join(process.cwd(), 'drizzle', '0000_dazzling_tomorrow_man.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');
    
    // Executar o SQL diretamente
    console.log("🔧 Executando migração SQL...");
    await db.run(sql.raw(migrationSQL));
    
    console.log("✅ Migração aplicada com sucesso!");
    
    // Verificar se as tabelas foram criadas
    console.log("🔍 Verificando tabelas criadas...");
    const tables = await db.all(sql`SELECT name FROM sqlite_master WHERE type='table'`);
    console.log("📋 Tabelas no banco de dados:", tables);
    
  } catch (error) {
    console.error("❌ Erro ao aplicar migrações:", error);
    process.exit(1);
  }
}

applyMigrations();
