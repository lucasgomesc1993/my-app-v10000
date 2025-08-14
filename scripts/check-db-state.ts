import { db } from "../lib/db";
import { sql } from "drizzle-orm";

interface TableInfo {
  name: string;
  sql: string;
}

interface CountResult {
  count: number;
  [key: string]: any;
}

async function checkDbState() {
  try {
    console.log("🔍 Verificando estado do banco de dados...");
    
    // List all tables
    const tables = await db.all<TableInfo>(
      sql`SELECT name, sql FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'`
    );
    
    console.log("\n📋 Estrutura do banco de dados:");
    console.log("==========================");
    
    // Check each table
    for (const table of tables) {
      console.log(`\n📊 Tabela: ${table.name}`);
      console.log("-".repeat(50));
      
      // Show table structure
      console.log("Estrutura:", table.sql);
      
      try {
        // Count records
        const countResult = await db.all<CountResult>(
          sql`SELECT COUNT(*) as count FROM ${sql.raw(table.name)}`
        );
        const count = countResult[0]?.count || 0;
        console.log(`📊 Total de registros: ${count}`);
        
        // Show sample data (first 3 records)
        if (count > 0) {
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
    
    // Check for missing tables
    const expectedTables = [
      'users', 'accounts', 'banks', 'categories', 'transactions', 
      'credit_cards', 'invoices', 'budgets', 'recurring_transactions'
    ];
    
    const missingTables = expectedTables.filter(
      table => !tables.some((t: TableInfo) => t.name === table)
    );
    
    if (missingTables.length > 0) {
      console.log("\n❌ Tabelas ausentes:", missingTables);
    } else {
      console.log("\n✅ Todas as tabelas esperadas estão presentes");
    }
    
  } catch (error) {
    console.error("❌ Erro ao verificar o banco de dados:", error);
  } finally {
    process.exit(0);
  }
}

checkDbState();
