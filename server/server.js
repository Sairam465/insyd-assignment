const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// --- ROUTES ---

// 1. Get All Items
// Supports optional query params for filtering in the future
app.get('/api/items', (req, res) => {
    const sql = "SELECT * FROM items ORDER BY last_updated DESC";
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        });
    });
});

// 2. Get Single Item
app.get('/api/items/:id', (req, res) => {
    const sql = "SELECT * FROM items WHERE id = ?";
    db.get(sql, [req.params.id], (err, row) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": row
        });
    });
});

// 3. Create New Item
app.post('/api/items', (req, res) => {
    const { sku, name, category, quantity, min_quantity, unit_price } = req.body;
    const sql = 'INSERT INTO items (sku, name, category, quantity, min_quantity, unit_price) VALUES (?,?,?,?,?,?)';
    const params = [sku, name, category, quantity, min_quantity, unit_price];

    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": { id: this.lastID, ...req.body },
            "id": this.lastID
        });
    });
});

// 4. Update Item (Stock adjustment or details edit)
app.put('/api/items/:id', (req, res) => {
    const { name, category, quantity, min_quantity, unit_price } = req.body;
    // Note: timestamps update automatically in sophisticated DBs, here we might want to manually touch it or let SQLite handle it if defined
    // Simple update:
    const sql = `UPDATE items set 
               name = COALESCE(?,name), 
               category = COALESCE(?,category), 
               quantity = COALESCE(?,quantity), 
               min_quantity = COALESCE(?,min_quantity), 
               unit_price = COALESCE(?,unit_price),
               last_updated = CURRENT_TIMESTAMP
               WHERE id = ?`;

    const params = [name, category, quantity, min_quantity, unit_price, req.params.id];

    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "changes": this.changes
        });
    });
});

// 5. Delete Item
app.delete('/api/items/:id', (req, res) => {
    const sql = 'DELETE FROM items WHERE id = ?';
    db.run(sql, req.params.id, function (err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "message": "deleted", changes: this.changes });
    });
});

// 6. Dashboard Stats
// Aggregates data for the dashboard view
app.get('/api/dashboard', (req, res) => {
    const sqlTotal = "SELECT COUNT(*) as count, SUM(quantity * unit_price) as total_value FROM items";
    const sqlLowStock = "SELECT COUNT(*) as count FROM items WHERE quantity < min_quantity";

    db.get(sqlTotal, [], (err, totalRow) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }

        db.get(sqlLowStock, [], (err, lowStockRow) => {
            if (err) {
                res.status(400).json({ error: err.message });
                return;
            }

            res.json({
                message: "success",
                data: {
                    totalItems: totalRow.count,
                    totalValue: totalRow.total_value,
                    lowStockCount: lowStockRow.count
                }
            });
        });
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
