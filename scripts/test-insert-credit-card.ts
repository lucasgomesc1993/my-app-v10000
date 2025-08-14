import { db } from "@/lib/db";
import { creditCards } from "@/lib/db/schema";

async function testInsertCreditCard() {
  try {
    console.log("🚀 Iniciando teste de inserção de cartão de crédito...");
    
    // Dados de exemplo para um cartão de crédito
    const sampleCreditCard = {
      userId: 1, // Supondo que o usuário com ID 1 existe
      name: "Cartão de Teste",
      brand: "visa" as const,
      type: "credito" as const,
      lastFourDigits: "1234",
      creditLimit: 1000.00,
      currentBalance: 500.00,
      availableLimit: 500.00,
      closingDay: 10,
      dueDay: 20,
      color: "#FF0000",
      isFavorite: true,
      isActive: true,
      notes: "Cartão de teste",
    };

    console.log("🔧 Inserindo cartão de crédito...");
    
    const result = await db
      .insert(creditCards)
      .values(sampleCreditCard)
      .returning();
    
    console.log("✅ Cartão de crédito inserido com sucesso!");
    console.log("📝 Resultado:", JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error("❌ Erro ao inserir cartão de crédito:", error);
  } finally {
    process.exit(0);
  }
}

testInsertCreditCard();
