import { db } from "../lib/db";
import { sql } from "drizzle-orm";

interface Category {
  id: number;
  name: string;
  type: string;
  transaction_count: number;
}

async function listCategories() {
  try {
    console.log("📋 Listando categorias e contagem de transações...");
    
    // Busca categorias com contagem de transações
    const categories = await db.all<Category>(
      sql`
        SELECT 
          c.id, 
          c.name, 
          c.type,
          COUNT(t.id) as transaction_count
        FROM categories c
        LEFT JOIN transactions t ON c.id = t.category_id
        GROUP BY c.id, c.name, c.type
        ORDER BY c.name
      `
    );

    console.log("\n📊 Categorias encontradas:");
    console.log("=".repeat(50));
    
    if (categories.length === 0) {
      console.log("Nenhuma categoria encontrada.");
      return;
    }

    for (const category of categories) {
      console.log(`\n🔹 ${category.name} (${category.type})`);
      console.log(`   ID: ${category.id}`);
      console.log(`   Transações associadas: ${category.transaction_count}`);
      
      // Se houver transações, mostrar algumas delas
      if (category.transaction_count > 0) {
        const transactions = await db.all(
          sql`
            SELECT id, description, amount, date 
            FROM transactions 
            WHERE category_id = ${category.id}
            LIMIT 3
          `
        );
        
        console.log("   Últimas transações:");
        transactions.forEach(tx => {
          console.log(`   - ${tx.description}: R$ ${tx.amount} (${new Date(tx.date * 1000).toLocaleDateString()})`);
        });
        
        if (category.transaction_count > 3) {
          console.log(`   ...e mais ${category.transaction_count - 3} transações`);
        }
      }
    }
    
  } catch (error) {
    console.error("❌ Erro ao listar categorias:", error);
  } finally {
    process.exit(0);
  }
}

listCategories();
