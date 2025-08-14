import { db } from "../lib/db";
import { sql } from "drizzle-orm";

interface TableInfo {
  name: string;
  sql: string;
}

async function inspectDatabase() {
  try {
    console.log("🔍 Inspecionando banco de dados...");
    
    // Get all tables
    const tables = await db.all<TableInfo>(
      sql`SELECT name, sql FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'`
    );
    
    console.log("\n📋 Tabelas encontradas:");
    console.log("==================");
    
    for (const table of tables) {
      console.log(`\n📊 Tabela: ${table.name}`);
      console.log("-".repeat(50));
      
      try {
        // Count rows
        const countResult = await db.get<{ count: number }>(
          sql`SELECT COUNT(*) as count FROM ${sql.raw(table.name)}`
        );
        console.log(`📊 Total de registros: ${countResult?.count || 0}`);
        
        // Show first 3 rows if table is not empty
        if (countResult?.count && countResult.count > 0) {
          const sampleData = await db.all(
            sql`SELECT * FROM ${sql.raw(table.name)} LIMIT 3`
          );
          console.log("📝 Amostra de dados:", JSON.stringify(sampleData, null, 2));
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        console.log(`⚠️  Não foi possível ler dados da tabela: ${errorMessage}`);
      }
    }
    
    // Check for expected tables
    const expectedTables = [
      'users', 'accounts', 'banks', 'categories', 'transactions', 
      'credit_cards', 'invoices', 'budgets', 'recurring_transactions'
    ];
    
    const missingTables = expectedTables.filter(
      table => !tables.some(t => t.name === table)
    );
    
    if (missingTables.length > 0) {
      console.log("\n❌ Tabelas ausentes:", missingTables);
    } else {
      console.log("\n✅ Todas as tabelas esperadas estão presentes");
    }
    
  } catch (error) {
    console.error("❌ Erro ao inspecionar o banco de dados:", error);
  } finally {
    process.exit(0);
  }
}

inspectDatabase();
