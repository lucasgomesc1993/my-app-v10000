import { db } from "@/lib/db";
import { users, banks, categories, accounts, creditCards, invoices } from "@/lib/db/schema";
import bcrypt from "bcryptjs";

async function clearTable(table: any, name: string) {
  try {
    console.log(`🧹 Clearing ${name} table...`);
    await db.delete(table);
    console.log(`✅ ${name} table cleared`);
  } catch (error) {
    console.error(`❌ Error clearing ${name} table:`, error instanceof Error ? error.message : 'Unknown error');
  }
}

async function main() {
  console.log("🚀 Starting database seeding...");
  
  try {
    // Clear tables in the correct order to respect foreign key constraints
    await clearTable(invoices, 'invoices');
    await clearTable(creditCards, 'credit cards');
    await clearTable(accounts, 'accounts');
    await clearTable(categories, 'categories');
    await clearTable(banks, 'banks');
    await clearTable(users, 'users');

    // Insert test user
    console.log("👤 Inserting test user...");
    const hashedPassword = await bcrypt.hash("test123", 10);
    const [user] = await db.insert(users).values({
      email: "test@example.com",
      password: hashedPassword,
      name: "Test User",
      cpf: "123.456.789-00",
      phone: "(11) 99999-9999",
      address: "Test Address",
      city: "Test City",
      state: "TS",
      zipCode: "00000-000",
      country: "BR",
      timezone: "America/Sao_Paulo",
      currency: "BRL",
      dateFormat: "DD/MM/YYYY",
      language: "pt-BR",
      isActive: true,
    }).returning();

    console.log(`✅ User created with ID: ${user.id}`);

    // Insert test bank
    console.log("🏦 Inserting test bank...");
    const [bank] = await db.insert(banks).values({
      name: "Test Bank",
      code: "001",
      color: "#000000"
    }).returning();

    console.log(`✅ Bank created with ID: ${bank.id}`);

    // Insert test account
    console.log("💳 Inserting test account...");
    const [account] = await db.insert(accounts).values({
      userId: user.id,
      bankId: bank.id,
      name: "Test Account",
      type: "checking",
      balance: 1000.00,
      color: "#3b82f6",
      isDefault: true,
    }).returning();

    console.log(`✅ Account created with ID: ${account.id}`);

    // Insert test credit card
    console.log("💳 Inserting test credit card...");
    const [creditCard] = await db.insert(creditCards).values({
      userId: user.id,
      name: "Test Credit Card",
      brand: "visa",
      type: "credito",
      lastFourDigits: "1234",
      creditLimit: 5000.00,
      currentBalance: 1000.00,
      availableLimit: 4000.00,
      closingDay: 10,
      dueDay: 20,
      color: "#8b5cf6",
      isFavorite: true,
      isActive: true,
      notes: "Test credit card"
    }).returning();

    console.log(`✅ Credit card created with ID: ${creditCard.id}`);

    // Insert test invoice
    console.log("🧾 Inserting test invoice...");
    const [invoice] = await db.insert(invoices).values({
      creditCardId: creditCard.id,
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      amount: 1000.00,
      dueDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 20),
      isPaid: false
    }).returning();

    console.log(`✅ Invoice created with ID: ${invoice.id}`);

    console.log("\n✨ Database seeding completed successfully! ✨");
    console.log("\n🔑 Login credentials:");
    console.log(`📧 Email: test@example.com`);
    console.log(`🔒 Password: test123`);
    
  } catch (error) {
    console.error("❌ Error during database seeding:", error instanceof Error ? error.message : 'Unknown error');
    if (error instanceof Error && error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

main();
