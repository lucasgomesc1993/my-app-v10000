import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '../lib/db/schema';

type SqliteDatabase = Database.Database;

export function createTestDatabase(): SqliteDatabase {
  // Cria um banco de dados em memória para os testes
  const sqlite = new Database(':memory:');
  
  // Executa as migrações iniciais
  const db = drizzle(sqlite, { schema });
  
  // Aqui você pode adicionar schemas iniciais se necessário
  // Por exemplo, criar tabelas manualmente
  
  return sqlite;
}

export function clearDatabase(db: SqliteDatabase): void {
  // Remove todas as tabelas do banco de dados
  const tables = db.prepare(
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
  ).all() as Array<{ name: string }>;

  db.prepare('PRAGMA foreign_keys = OFF').run();
  
  for (const table of tables) {
    db.prepare(`DROP TABLE IF EXISTS ${table.name}`).run();
  }
  
  db.prepare('PRAGMA foreign_keys = ON').run();
}

export function closeDatabase(db: SqliteDatabase): void {
  db.close();
}
