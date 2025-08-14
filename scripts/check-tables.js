const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'sqlite.db');
const db = new sqlite3.Database(dbPath);

console.log('Checking database at:', dbPath);

// List all tables
db.all("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'", [], (err, tables) => {
  if (err) {
    console.error('Error listing tables:', err);
    return;
  }

  console.log('\nFound tables:');
  console.log('=============');
  
  if (tables.length === 0) {
    console.log('No tables found in the database');
    db.close();
    return;
  }

  tables.forEach((table, index) => {
    console.log(`${index + 1}. ${table.name}`);
    
    // Count rows in each table
    db.get(`SELECT COUNT(*) as count FROM ${table.name}`, [], (err, row) => {
      if (err) {
        console.log(`  - Error counting rows: ${err.message}`);
      } else {
        console.log(`  - Rows: ${row.count}`);
      }
      
      // If this is the last table, close the database
      if (index === tables.length - 1) {
        db.close();
      }
    });
  });
});
