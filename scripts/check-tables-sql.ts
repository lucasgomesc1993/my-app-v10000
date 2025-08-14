import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

async function checkTables() {
  try {
    console.log("🔍 Verificando tabelas no banco de dados...");
    
    // Verificar se a tabela credit_cards existe
    const tableCheck = await db.get<{ name: string }>(
      sql`SELECT name FROM sqlite_master WHERE type='table' AND name='credit_cards'`
    );
    
    if (tableCheck) {
      console.log("✅ Tabela credit_cards encontrada!");
      
      // Verificar a estrutura da tabela
      const tableInfo = await db.all<{ cid: number; name: string; type: string; notnull: number; dflt_value: any; pk: number }>(
        sql`PRAGMA table_info(credit_cards)`
      );
      
      console.log("\n📋 Estrutura da tabela credit_cards:");
      console.table(tableInfo);
      
      // Contar registros
      const countResult = await db.get<{ count: number }>(
        sql`SELECT COUNT(*) as count FROM credit_cards`
      );
      
      console.log(`\n📊 Total de registros em credit_cards: ${countResult?.count || 0}`);
      
      // Mostrar alguns registros se existirem
      if (countResult && countResult.count > 0) {
        const sampleRecords = await db.all(
          sql`SELECT * FROM credit_cards LIMIT 5`
        );
        console.log("\n📝 Amostra de registros:");
        console.log(JSON.stringify(sampleRecords, null, 2));
      }
    } else {
      console.log("❌ Tabela credit_cards NÃO encontrada!");
      
      // Listar todas as tabelas disponíveis
      const allTables = await db.all<{ name: string }>(
        sql`SELECT name FROM sqlite_master WHERE type='table'`
      );
      
      console.log("\n📋 Tabelas disponíveis no banco de dados:");
      console.table(allTables.map(t => t.name));
    }
    
  } catch (error) {
    console.error("❌ Erro ao verificar tabelas:", error);
  } finally {
    process.exit(0);
  }
}

checkTables();
