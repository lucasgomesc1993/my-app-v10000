// Simple script to test database connection and basic operations

console.log("🚀 Starting database connection test...");

// Import the database connection and schema
import { db } from "@/lib/db";
import { users, creditCards } from "@/lib/db/schema";

console.log("✅ Imports completed successfully!");

async function testConnection() {
  try {
    console.log("🔍 Testing database connection...");
    
    // Test a simple query
    const userResult = await db.select().from(users).limit(1);
    console.log("✅ Database connection successful!");
    console.log("📊 User query result:", userResult);
    
    // Check if credit_cards table exists and has data
    console.log("\n🔍 Checking credit_cards table...");
    try {
      const creditCardsResult = await db.select().from(creditCards).limit(5);
      console.log(`📊 Found ${creditCardsResult.length} credit cards in the database`);
      
      if (creditCardsResult.length === 0) {
        console.log("ℹ️  No credit cards found. Attempting to insert a test credit card...");
        
        const testCard = {
          userId: userResult[0].id,
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
          notes: "Cartão de teste inserido pelo script"
        };
        
        const insertResult = await db.insert(creditCards).values(testCard).returning();
        console.log("✅ Test credit card inserted successfully!");
        console.log("📝 Insert result:", insertResult);
        
        // Verify the insertion
        const verifyResult = await db.select().from(creditCards);
        console.log(`✅ Verification: Now there are ${verifyResult.length} credit cards in the database`);
      }
      
    } catch (error) {
      console.error("❌ Error accessing credit_cards table:", error);
    }
    
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  } finally {
    process.exit(0);
  }
}

testConnection();
