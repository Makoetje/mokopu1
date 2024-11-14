// server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',        // Change if necessary
    user: 'root', // Add your database username
    password: '12345', // Add your database password
    database: 'wings'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to the database.');
});

// User routes
app.get('/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

app.post('/users', (req, res) => {
    const { username, password } = req.body;
    const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.query(sql, [username, password], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json({ id: results.insertId, username });
    });
});

app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { username, password } = req.body;
    db.query('UPDATE users SET username = ?, password = ? WHERE id = ?', [username, password, id], (err) => {
        if (err) return res.status(500).send(err);
        res.send('User updated successfully.');
    });
});

app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM users WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).send(err);
        res.send('User deleted successfully.');
    });
});

// Product routes
app.get('/products', (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

app.post('/products', (req, res) => {
    const { name, description, category, price, quantity } = req.body;
    db.query('INSERT INTO products (name, description, category, price, quantity) VALUES (?, ?, ?, ?, ?)', [name, description, category, price, quantity], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json({ id: results.insertId, name });
    });
});

app.put('/products/:id', (req, res) => {
    const { id } = req.params;
    const { name, description, category, price, quantity } = req.body;
    const sql = 'UPDATE products SET name = ?, description = ?, category = ?, price = ?, quantity = ? WHERE id = ?';
    db.query(sql, [name, description, category, price, quantity, id], (err) => {
        if (err) return res.status(500).send(err);
        res.send('Product updated successfully.');
    });
});

app.delete('/products/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM products WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).send(err);
        res.send('Product deleted successfully.');
    });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});