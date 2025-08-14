import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import * as schema from "./schema";

const sqlite = new Database("sqlite.db");
export const db = drizzle(sqlite, { schema });

// Função para inicializar o banco de dados
export function initializeDatabase() {
  try {
    // Executar migrações se necessário
    migrate(db, { migrationsFolder: "drizzle" });
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}
