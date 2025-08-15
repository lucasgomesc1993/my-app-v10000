import { describe, beforeAll, afterAll, beforeEach, test, expect } from '@jest/globals';
import { createTestDatabase, clearDatabase, closeDatabase } from '../test-utils';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from '../../lib/db/schema';
import { eq } from 'drizzle-orm';

// Tipos inferidos do schema
type Account = typeof schema.accounts.$inferSelect;
type NewAccount = typeof schema.accounts.$inferInsert;

describe('Bank Account CRUD Operations', () => {
  let db: any; // Usando any temporariamente para evitar erros de tipo
  let dbClient: ReturnType<typeof drizzle<typeof schema>>;

  beforeAll(async () => {
    // Configura o banco de dados de teste
    db = createTestDatabase();
    dbClient = drizzle(db, { schema });
    
    // Cria as tabelas necessárias
    await db.exec(`
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
      
      CREATE TABLE IF NOT EXISTS accounts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        bank TEXT NOT NULL,
        type TEXT NOT NULL,
        color TEXT,
        initialBalance REAL NOT NULL,
        balance REAL NOT NULL,
        userId INTEGER NOT NULL,
        bankId INTEGER NOT NULL,
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
        ofxVersion TEXT,
        description TEXT,
        notes TEXT,
        lastSyncAt INTEGER,
        syncEnabled INTEGER DEFAULT 0,
        isActive INTEGER DEFAULT 1,
        isFavorite INTEGER DEFAULT 0,
        subtype TEXT,
        creditLimit REAL DEFAULT 0,
        createdAt INTEGER DEFAULT (unixepoch()),
        updatedAt INTEGER DEFAULT (unixepoch()),
        FOREIGN KEY (userId) REFERENCES users(id),
        FOREIGN KEY (bankId) REFERENCES banks(id)
      );
    `);
    
    // Insere dados de teste
    await db.exec(`
      INSERT INTO users (email, password, name) VALUES ('test@example.com', 'hashedpassword', 'Test User');
      INSERT INTO banks (code, name, full_name) VALUES ('001', 'Banco do Brasil', 'Banco do Brasil S.A.');
    `);
  });

  afterAll(() => {
    // Fecha a conexão com o banco de dados
    closeDatabase(db);
  });

  beforeEach(async () => {
    // Limpa os dados antes de cada teste
    await clearDatabase(db);
  });

  test('should create a new account', async () => {
    // Dados da conta de teste
    const accountData: Omit<NewAccount, 'createdAt' | 'updatedAt'> = {
      name: 'Conta Corrente',
      bank: 'Banco do Brasil',
      type: 'corrente',
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

    // Insere a conta no banco de dados
    const insertResult = await dbClient.insert(schema.accounts).values(accountData).run();
    const accountId = insertResult.lastInsertRowid;
    
    // Busca a conta inserida para verificação
    const [savedAccount] = await dbClient
      .select()
      .from(schema.accounts)
      .where(eq(schema.accounts.id, accountId));
      
    // Verifica se a conta foi criada corretamente
    expect(savedAccount).toBeDefined();
    expect(savedAccount.name).toBe(accountData.name);
    expect(savedAccount.type).toBe(accountData.type);
    expect(savedAccount.balance).toBe(accountData.balance);
    expect(savedAccount.userId).toBe(accountData.userId);
    expect(savedAccount.bankId).toBe(accountData.bankId);
  });
});
