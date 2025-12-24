const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create a new database file in the server directory
const dbPath = path.resolve(__dirname, 'inventory.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Could not connect to database', err);
    } else {
        console.log('Connected to SQLite database');
    }
});

db.serialize(() => {
    // Create Items table
    db.run(`CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sku TEXT UNIQUE,
    name TEXT,
    category TEXT,
    quantity INTEGER DEFAULT 0,
    min_quantity INTEGER DEFAULT 10,
    unit_price REAL DEFAULT 0.0,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

    // Seed data if empty
    db.get("SELECT count(*) as count FROM items", (err, row) => {
        if (row.count === 0) {
            console.log("Seeding database...");
            const stmt = db.prepare("INSERT INTO items (sku, name, category, quantity, min_quantity, unit_price) VALUES (?, ?, ?, ?, ?, ?)");

            const seedData = [
                ['CER-001', 'Ceramic Tile 60x60 White', 'Tiles', 150, 50, 12.50],
                ['CEM-002', 'Cement Bag 50kg', 'Construction', 40, 100, 8.00],
                ['PNT-003', 'Interior Paint White 20L', 'Paint', 25, 10, 45.00],
                ['PLY-004', 'Plywood Sheet 18mm', 'Wood', 200, 30, 25.00],
                ['STL-005', 'Steel Rod 12mm', 'Steel', 500, 200, 5.50]
            ];

            seedData.forEach(item => {
                stmt.run(item);
            });
            stmt.finalize();
        }
    });
});

module.exports = db;
