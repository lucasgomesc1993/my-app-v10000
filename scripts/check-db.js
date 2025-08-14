const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Caminho para o banco de dados SQLite
const dbPath = path.join(__dirname, '..', 'sqlite.db');

// Conectar ao banco de dados
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
    return;
  }
  console.log('Conectado ao banco de dados SQLite.');
});

// Verificar se existe um usuário com ID 1
db.get('SELECT id, email, name FROM users WHERE id = 1', [], (err, row) => {
  if (err) {
    console.error('Erro ao buscar usuário:', err.message);
    return;
  }
  
  if (row) {
    console.log('Usuário encontrado:', row);
  } else {
    console.log('Nenhum usuário encontrado com ID 1. Criando um usuário de teste...');
    
    // Criar um usuário de teste se não existir
    db.run(
      'INSERT INTO users (id, email, name, password, isActive) VALUES (1, \'teste@example.com\', \'Usuário Teste\', \'$2b$10$examplehash\', 1)',
      function(err) {
        if (err) {
          console.error('Erro ao criar usuário de teste:', err.message);
          return;
        }
        console.log(`Usuário de teste criado com ID: ${this.lastID}`);
      }
    );
  }
});

// Fechar a conexão com o banco de dados
db.close((err) => {
  if (err) {
    console.error('Erro ao fechar a conexão com o banco de dados:', err.message);
  } else {
    console.log('Conexão com o banco de dados fechada.');
  }
});
