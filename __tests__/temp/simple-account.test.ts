import { describe, beforeAll, afterAll, test, expect } from '@jest/globals';
import { createTestDatabase, closeDatabase } from '../test-utils';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { eq } from 'drizzle-orm';
import * as schema from '../../lib/db/schema';
import Database from 'better-sqlite3';

describe('Simple Account Operations', () => {
  let db: Database.Database;
  let dbClient: ReturnType<typeof drizzle<typeof schema>>;

  beforeAll(() => {
    console.log('Setting up test database...');
    try {
      db = createTestDatabase();
      console.log('Database created successfully');
      
      dbClient = drizzle(db, { schema });
      console.log('Drizzle client initialized');
      
      // Cria as tabelas necessárias
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        created_at INTEGER DEFAULT (unixepoch())
      );
      
      CREATE TABLE IF NOT EXISTS banks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        full_name TEXT NOT NULL,
        created_at INTEGER DEFAULT (unixepoch())
      );
      
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        createdAt INTEGER DEFAULT (unixepoch())
      );
      
      CREATE TABLE IF NOT EXISTS banks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        fullName TEXT NOT NULL,
        ofxVersion TEXT DEFAULT '102',
        isActive INTEGER DEFAULT 1,
        createdAt INTEGER DEFAULT (unixepoch()),
        updatedAt INTEGER DEFAULT (unixepoch())
      );
      
      CREATE TABLE IF NOT EXISTS accounts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        bank TEXT NOT NULL,
        type TEXT NOT NULL,
        color TEXT NOT NULL,
        balance REAL NOT NULL DEFAULT 0,
        initialBalance REAL NOT NULL DEFAULT 0,
        creditLimit REAL DEFAULT 0,
        isFavorite INTEGER DEFAULT 0,
        isActive INTEGER DEFAULT 1,
        userId INTEGER NOT NULL,
        bankId INTEGER,
        accountNumber TEXT,
        accountDigit TEXT,
        agency TEXT,
        agencyDigit TEXT,
        bankCode TEXT,
        branchId TEXT,
        accountId TEXT,
        ofxAccountType TEXT,
        ofxBankId TEXT,
        ofxBranchId TEXT,
        ofxAccountId TEXT,
        ofxKey TEXT,
        ofxUrl TEXT,
        ofxVersion TEXT DEFAULT '102',
        description TEXT,
        notes TEXT,
        lastSyncAt INTEGER,
        syncEnabled INTEGER DEFAULT 0,
        subtype TEXT,
        createdAt INTEGER DEFAULT (unixepoch()),
        updatedAt INTEGER DEFAULT (unixepoch()),
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (bankId) REFERENCES banks(id)
      );
    `);
    
    // Insere dados de teste
    console.log('Inserting test data...');
    db.exec(`
      INSERT INTO users (id, email, password, name) VALUES 
        (1, 'test@example.com', 'hashedpassword', 'Test User');
        
      INSERT INTO banks (id, code, name, fullName, ofxVersion, isActive) VALUES 
        (1, '001', 'Banco do Brasil', 'Banco do Brasil S.A.', '102', 1);
    `);
    
    // Verifica se os dados foram inseridos corretamente
    const userCheck = db.prepare('SELECT * FROM users').get();
    const bankCheck = db.prepare('SELECT * FROM banks').get();
    
    console.log('User check:', userCheck);
    console.log('Bank check:', bankCheck);
    
    console.log('Test database setup complete');
    } catch (error) {
      console.error('Error setting up test database:', error);
      throw error;
    }
  });

  afterAll(() => {
    console.log('Closing database connection...');
    closeDatabase(db);
    console.log('Database connection closed');
  });

  test('should insert and retrieve an account', async () => {
    console.log('Starting test: should insert and retrieve an account');
    
    // Dados da conta de teste
    const accountData = {
      name: 'Conta Corrente',
      bank: 'Banco do Brasil',
      type: 'corrente' as const, // Usando const assertion para garantir o tipo literal
      color: '#3b82f6',
      initialBalance: 1000.50,
      balance: 1000.50,
      userId: 1,
      bankId: 1,
      accountNumber: '12345-6',
      accountDigit: null,
      agency: '0001',
      agencyDigit: null,
      bankCode: '001',
      branchId: null,
      accountId: null,
      ofxAccountType: 'CHECKING',
      ofxBankId: null,
      ofxBranchId: null,
      ofxAccountId: null,
      ofxKey: null,
      ofxUrl: null,
      ofxVersion: '102',
      description: 'Conta principal',
      notes: null,
      lastSyncAt: null,
      syncEnabled: false,
      isActive: true,
      isFavorite: false,
      subtype: null,
      creditLimit: 0
    };
    
    console.log('Inserting account:', accountData);
    
    // Insere a conta no banco de dados
    const insertResult = await dbClient.insert(schema.accounts).values(accountData).run();
    const accountId = insertResult.lastInsertRowid;
    console.log('Account inserted with ID:', accountId);
    
    // Busca a conta inserida
    console.log('Fetching account with ID:', accountId);
    const result = await dbClient
      .select()
      .from(schema.accounts)
      .where(eq(schema.accounts.id, accountId as number));
    
    console.log('Query result:', result);
    
    // Verifica se a conta foi encontrada
    expect(result.length).toBe(1);
    
    const savedAccount = result[0];
    console.log('Retrieved account:', savedAccount);
    
    // Verifica os dados da conta
    expect(savedAccount.name).toBe(accountData.name);
    expect(savedAccount.type).toBe(accountData.type);
    expect(savedAccount.balance).toBe(accountData.balance);
    expect(savedAccount.userId).toBe(accountData.userId);
    expect(savedAccount.bankId).toBe(accountData.bankId);
    
    console.log('Test completed successfully');
  });
});
