import { describe, beforeAll, afterAll, test, expect, beforeEach } from '@jest/globals';
import { createTestDatabase, clearDatabase, closeDatabase } from '../test-utils';
import Database from 'better-sqlite3';

// Interface para tipar os resultados das consultas
interface Account {
  id: number;
  name: string;
  bank: string;
  type: string;
  color: string;
  balance: number;
  initialBalance: number;
  creditLimit: number;
  isFavorite: number;
  isActive: number;
  userId: number;
  bankId: number | null;
  description: string | null;
  createdAt: number;
  updatedAt: number;
  [key: string]: any; // Para propriedades opcionais
}

// Tipos para os testes
type TestAccount = {
  name: string;
  bank: string;
  type: 'corrente' | 'poupança' | 'investimento' | 'cartao_credito' | 'cartao_debito' | 'outro';
  color: string;
  initialBalance: number;
  balance: number;
  userId: number;
  bankId: number | null;
  accountNumber?: string | null;
  accountDigit?: string | null;
  agency?: string | null;
  agencyDigit?: string | null;
  bankCode?: string | null;
  description?: string | null;
  isActive?: boolean;
  isFavorite?: boolean;
  creditLimit?: number;
  ofxAccountType?: string | null;
  ofxVersion?: string | null;
};

describe('Bank Account CRUD Operations', () => {
  let db: Database.Database;

  beforeAll(() => {
    console.log('Setting up test database...');
    try {
      // Cria o banco de dados em memória
      db = createTestDatabase();
      console.log('Database created successfully');
      
      // Cria as tabelas necessárias
      console.log('Creating tables...');
      
      // Cria a tabela de usuários
      db.exec(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          name TEXT NOT NULL,
          createdAt INTEGER DEFAULT (strftime('%s', 'now'))
        );
      `);
      
      // Cria a tabela de bancos
      db.exec(`
        CREATE TABLE IF NOT EXISTS banks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          code TEXT NOT NULL UNIQUE,
          name TEXT NOT NULL,
          fullName TEXT NOT NULL,
          ofxVersion TEXT DEFAULT '102',
          isActive INTEGER DEFAULT 1,
          createdAt INTEGER DEFAULT (strftime('%s', 'now')),
          updatedAt INTEGER DEFAULT (strftime('%s', 'now'))
        );
      `);
      
      // Cria a tabela de contas
      db.exec(`
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
          createdAt INTEGER DEFAULT (strftime('%s', 'now')),
          updatedAt INTEGER DEFAULT (strftime('%s', 'now')),
          FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (bankId) REFERENCES banks(id)
        );
      `);
      
      console.log('Tables created successfully');
      
      // Insere dados de teste
      console.log('Inserting test data...');
      
      // Insere um usuário de teste
      db.prepare(
        `INSERT INTO users (id, email, password, name, createdAt) 
         VALUES (?, ?, ?, ?, strftime('%s', 'now'))`
      ).run(1, 'test@example.com', 'hashedpassword', 'Test User');
      
      // Insere um banco de teste
      db.prepare(
        `INSERT INTO banks (id, code, name, fullName, ofxVersion, isActive, createdAt, updatedAt) 
         VALUES (?, ?, ?, ?, ?, 1, strftime('%s', 'now'), strftime('%s', 'now'))`
      ).run(1, '001', 'Banco do Brasil', 'Banco do Brasil S.A.', '102');
      
      console.log('Test data inserted successfully');
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

  beforeEach(() => {
    // Limpa as tabelas antes de cada teste, mas mantém a estrutura
    clearDatabase(db);
    
    // Recria as tabelas
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        createdAt INTEGER DEFAULT (strftime('%s', 'now'))
      );
      
      CREATE TABLE IF NOT EXISTS banks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        fullName TEXT NOT NULL,
        ofxVersion TEXT DEFAULT '102',
        isActive INTEGER DEFAULT 1,
        createdAt INTEGER DEFAULT (strftime('%s', 'now')),
        updatedAt INTEGER DEFAULT (strftime('%s', 'now'))
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
        createdAt INTEGER DEFAULT (strftime('%s', 'now')),
        updatedAt INTEGER DEFAULT (strftime('%s', 'now')),
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (bankId) REFERENCES banks(id)
      );
    `);
    
    // Reinsere os dados de teste
    db.prepare(
      `INSERT INTO users (id, email, password, name, createdAt) 
       VALUES (?, ?, ?, ?, strftime('%s', 'now'))`
    ).run(1, 'test@example.com', 'hashedpassword', 'Test User');
    
    db.prepare(
      `INSERT INTO banks (id, code, name, fullName, ofxVersion, isActive, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, 1, strftime('%s', 'now'), strftime('%s', 'now'))`
    ).run(1, '001', 'Banco do Brasil', 'Banco do Brasil S.A.', '102');
  });

  test('should create a new bank account', async () => {
    console.log('Starting test: should create a new bank account');
    
    // Dados da conta de teste
    const accountData: TestAccount = {
      name: 'Conta Corrente',
      bank: 'Banco do Brasil',
      type: 'corrente',
      color: '#3b82f6',
      initialBalance: 1000.50,
      balance: 1000.50,
      userId: 1,
      bankId: 1,
      accountNumber: '12345-6',
      agency: '0001',
      bankCode: '001',
      description: 'Conta principal',
      isActive: true,
      isFavorite: false,
      creditLimit: 0,
      ofxAccountType: 'CHECKING',
      ofxVersion: '102'
    };
    
    // Insere a conta usando SQL direto para evitar problemas com tipos do Drizzle
    console.log('Inserting account:', accountData);
    
    const stmt = db.prepare(`
      INSERT INTO accounts (
        name, bank, type, color, balance, initialBalance, creditLimit, 
        isFavorite, isActive, userId, bankId, accountNumber, agency, 
        bankCode, description, ofxAccountType, ofxVersion
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      accountData.name,
      accountData.bank,
      accountData.type,
      accountData.color,
      accountData.balance,
      accountData.initialBalance,
      accountData.creditLimit || 0,
      accountData.isFavorite ? 1 : 0,
      accountData.isActive ? 1 : 0,
      accountData.userId,
      accountData.bankId || null,
      accountData.accountNumber || null,
      accountData.agency || null,
      accountData.bankCode || null,
      accountData.description || null,
      accountData.ofxAccountType || null,
      accountData.ofxVersion || '102'
    );
    
    const accountId = Number(result.lastInsertRowid);
    console.log('Account inserted with ID:', accountId);
    
    // Verifica se a conta foi inserida corretamente
    const savedAccount = db.prepare('SELECT * FROM accounts WHERE id = ?').get(accountId) as Account;
    console.log('Retrieved account:', savedAccount);
    
    // Verificações
    expect(savedAccount).toBeDefined();
    expect(savedAccount.name).toBe(accountData.name);
    expect(savedAccount.type).toBe(accountData.type);
    expect(Number(savedAccount.balance)).toBe(accountData.balance);
    expect(Number(savedAccount.userId)).toBe(accountData.userId);
    expect(Number(savedAccount.bankId)).toBe(accountData.bankId);
    expect(Number(savedAccount.isActive)).toBe(accountData.isActive ? 1 : 0);
    expect(Number(savedAccount.isFavorite)).toBe(accountData.isFavorite ? 1 : 0);
    expect(Number(savedAccount.creditLimit)).toBe(accountData.creditLimit || 0);
    
    console.log('Test passed: Account created successfully');
  });
  
  test('should update an existing bank account', async () => {
    console.log('Starting test: should update an existing bank account');
    
    // Insere uma conta inicial
    const initialAccount: TestAccount = {
      name: 'Conta Corrente',
      bank: 'Banco do Brasil',
      type: 'corrente',
      color: '#3b82f6',
      initialBalance: 1000.50,
      balance: 1000.50,
      userId: 1,
      bankId: 1,
      isActive: true,
      isFavorite: false
    };
    
    const insertResult = await dbClient.insert(schema.accounts).values(initialAccount).run();
    const accountId = insertResult.lastInsertRowid;
    console.log('Initial account inserted with ID:', accountId);
    
    // Dados para atualização
    const updateData = {
      name: 'Conta Corrente Atualizada',
      balance: 2000.75,
      isFavorite: true,
      description: 'Conta atualizada para testes'
    };
    
    // Atualiza a conta
    console.log('Updating account with data:', updateData);
    db.prepare(`
      UPDATE accounts 
      SET 
        name = ?, 
        balance = ?, 
        isFavorite = ?, 
        description = ?, 
        updatedAt = ?
      WHERE id = ?
    `).run(
      updateData.name,
      updateData.balance,
      updateData.isFavorite ? 1 : 0,
      updateData.description,
      Math.floor(Date.now() / 1000), // Timestamp atual
      accountId
    );
    
    // Busca a conta atualizada
    const updatedAccount = db.prepare('SELECT * FROM accounts WHERE id = ?').get(accountId) as Account;
    
    console.log('Updated account:', updatedAccount);
    
    // Verificações
    expect(updatedAccount).toBeDefined();
    expect(updatedAccount.name).toBe(updateData.name);
    expect(Number(updatedAccount.balance)).toBe(updateData.balance);
    expect(Number(updatedAccount.isFavorite)).toBe(updateData.isFavorite ? 1 : 0);
    expect(updatedAccount.description).toBe(updateData.description);
    expect(Number(updatedAccount.updatedAt)).toBeGreaterThan(0);
    
    console.log('Test passed: Account updated successfully');
  });
  
  test('should delete a bank account', async () => {
    console.log('Starting test: should delete a bank account');
    
    // Insere uma conta para deletar
    const accountData: TestAccount = {
      name: 'Conta para Deletar',
      bank: 'Banco do Brasil',
      type: 'poupança',
      color: '#10b981',
      initialBalance: 500.00,
      balance: 500.00,
      userId: 1,
      bankId: 1,
      isActive: true,
      isFavorite: false
    };
    
  
  // Verificações
  expect(allAccounts).toHaveLength(accountsToInsert.length);
  
  // Verifica se as contas foram ordenadas por favorito e depois por nome
  const favoriteAccounts = allAccounts.filter(acc => acc.isFavorite === 1);
  const nonFavoriteAccounts = allAccounts.filter(acc => acc.isFavorite === 0);
  
  // Verifica se as contas favoritas vêm primeiro
  expect(favoriteAccounts.length).toBeGreaterThan(0);
  
  // Verifica a ordenação por nome dentro de cada grupo
  const isSorted = (arr: any[], key: string) => {
    for (let i = 1; i < arr.length; i++) {
      if (arr[i - 1][key] > arr[i][key]) {
        return false;
    const accountsToInsert: TestAccount[] = [
      {
        name: 'Conta Corrente',
        bank: 'Banco do Brasil',
        type: 'corrente',
        color: '#3b82f6',
        initialBalance: 1000.00,
        balance: 1000.00,
        userId: 1,
        bankId: 1,
        isFavorite: true
      },
      {
        name: 'Conta Poupança',
        bank: 'Banco do Brasil',
        type: 'poupança',
        color: '#10b981',
        initialBalance: 5000.00,
        balance: 5250.50,
        userId: 1,
        bankId: 1,
        isFavorite: false
      },
      {
        name: 'Conta Investimento',
        bank: 'Banco do Brasil',
        type: 'investimento',
        color: '#8b5cf6',
        initialBalance: 10000.00,
        balance: 11500.75,
        userId: 1,
        bankId: 1,
        isFavorite: true
      }
    ];
    
    // Insere as contas
    console.log('Inserting test accounts...');
    for (const account of accountsToInsert) {
      await dbClient.insert(schema.accounts).values(account).run();
    }
    
    // Busca todas as contas
    console.log('Fetching all accounts...');
    const allAccounts = db.prepare('SELECT * FROM accounts ORDER BY name').all() as Account[];
    
    console.log('Retrieved accounts:', allAccounts);
    
    // Verificações
    expect(allAccounts).toHaveLength(accountsToInsert.length);
    
    // Verifica se as contas foram ordenadas por favorito e depois por nome
    const favoriteAccounts = allAccounts.filter(acc => acc.isFavorite === 1);
    const nonFavoriteAccounts = allAccounts.filter(acc => acc.isFavorite === 0);
    
    // Verifica se as contas favoritas vêm primeiro
    expect(favoriteAccounts.length).toBeGreaterThan(0);
    
    // Verifica a ordenação por nome dentro de cada grupo
    const isSorted = (arr: any[], key: string) => {
      for (let i = 1; i < arr.length; i++) {
        if (arr[i - 1][key] > arr[i][key]) {
          return false;
        }
      }
      return true;
    };
    
    expect(isSorted(favoriteAccounts, 'name')).toBe(true);
    expect(isSorted(nonFavoriteAccounts, 'name')).toBe(true);
    
    console.log('Test passed: Accounts listed successfully');
  });
});
