import { db } from "@/lib/db";
import { creditCards } from "@/lib/db/schema";

async function checkCreditCards() {
  try {
    console.log("🔍 Verificando cartões de crédito no banco de dados...");
    
    const result = await db.select().from(creditCards);
    
    console.log(`✅ ${result.length} cartões de crédito encontrados:`);
    console.log(JSON.stringify(result, null, 2));
    
    if (result.length > 0) {
      console.log("\n📋 Detalhes do primeiro cartão:");
      console.log(JSON.stringify(result[0], null, 2));
    }
    
    console.log("\n✅ Verificação concluída!");
  } catch (error) {
    console.error("❌ Erro ao verificar cartões de crédito:", error);
  } finally {
    process.exit(0);
  }
}

checkCreditCards();
