import { test, expect } from '@jest/globals';
import { createTestDatabase, closeDatabase } from '../test-utils';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from '../../lib/db/schema';
import Database from 'better-sqlite3';

test('should connect to the database', () => {
  console.log('Starting test: should connect to the database');
  
  // Cria uma conexão com o banco de dados em memória
  const db = createTestDatabase();
  console.log('Database connection created');
  
  try {
    // Tenta executar uma consulta simples
    const result = db.prepare('SELECT 1 as test').get();
    console.log('Query result:', result);
    
    // Verifica se a consulta retornou o resultado esperado
    expect(result).toEqual({ test: 1 });
    
    console.log('Test passed');
  } finally {
    // Fecha a conexão com o banco de dados
    closeDatabase(db);
    console.log('Database connection closed');
  }
});
