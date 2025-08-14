import { db } from "../lib/db";
import { sql } from "drizzle-orm";

interface TableInfo {
  name: string;
  sql: string;
}

async function inspectTable(tableName: string) {
  try {
    console.log(`🔍 Inspecionando tabela: ${tableName}`);
    
    // Get table structure
    const tableInfo = await db.get<TableInfo>(
      sql`SELECT name, sql FROM sqlite_master WHERE type='table' AND name = ${tableName}`
    );
    
    if (!tableInfo) {
      console.log(`❌ Tabela '${tableName}' não encontrada`);
      return;
    }
    
    console.log("\n📋 Estrutura da tabela:");
    console.log(tableInfo.sql);
    
    // Count rows
    const countResult = await db.get<{ count: number }>(
      sql`SELECT COUNT(*) as count FROM ${sql.raw(tableName)}`
    );
    
    const rowCount = countResult?.count || 0;
    console.log(`\n📊 Total de registros: ${rowCount}`);
    
    if (rowCount > 0) {
      // Show first 5 rows
      console.log("\n📝 Primeiros registros:");
      const rows = await db.all(
        sql`SELECT * FROM ${sql.raw(tableName)} LIMIT 5`
      );
      console.log(JSON.stringify(rows, null, 2));
      
      // Show column names
      if (rows.length > 0) {
        console.log("\n🔍 Colunas:", Object.keys(rows[0]));
      }
    }
    
  } catch (error) {
    console.error(`❌ Erro ao inspecionar a tabela '${tableName}':`, error);
  } finally {
    process.exit(0);
  }
}

// Get table name from command line argument or default to 'credit_cards'
const tableName = process.argv[2] || 'credit_cards';
inspectTable(tableName);
