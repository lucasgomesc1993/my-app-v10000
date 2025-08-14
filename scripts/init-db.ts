import { initializeDatabase } from "../lib/db/index";
import { seedDatabase } from "../lib/db/seed";

async function main() {
  try {
    console.log("🚀 Inicializando banco de dados...");
    
    // Inicializar banco e executar migrações
    initializeDatabase();
    
    // Popular com dados de exemplo
    await seedDatabase();
    
    console.log("✅ Banco de dados inicializado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao inicializar banco de dados:", error);
    process.exit(1);
  }
}

main();
