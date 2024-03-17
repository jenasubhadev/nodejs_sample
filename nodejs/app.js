// app.js

const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root_password',
  database: process.env.DB_NAME || 'test_db'
};

const db = mysql.createConnection(dbConfig);

db.connect(err => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to database.');
});

app.use(express.json());

// CREATE operation
app.post('/users', (req, res) => {
  const { username, email } = req.body;
  const newUser = { username, email };
  db.query('INSERT INTO users SET ?', newUser, (err, result) => {
    if (err) {
      console.error('Error creating user: ' + err.stack);
      res.status(500).send('Error creating user.');
      return;
    }
    console.log('User created with ID: ', result.insertId);
    res.status(201).send('User created.');
  });
});

// READ operation
app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('Error fetching users: ' + err.stack);
      res.status(500).send('Error fetching users.');
      return;
    }
    res.status(200).json(results);
  });
});

// UPDATE operation
app.put('/users/:id', (req, res) => {
  const userId = req.params.id;
  const { username, email } = req.body;
  db.query('UPDATE users SET username = ?, email = ? WHERE id = ?', [username, email, userId], (err, result) => {
    if (err) {
      console.error('Error updating user: ' + err.stack);
      res.status(500).send('Error updating user.');
      return;
    }
    console.log('User updated.');
    res.status(200).send('User updated.');
  });
});

// DELETE operation
app.delete('/users/:id', (req, res) => {
  const userId = req.params.id;
  db.query('DELETE FROM users WHERE id = ?', userId, (err, result) => {
    if (err) {
      console.error('Error deleting user: ' + err.stack);
      res.status(500).send('Error deleting user.');
      return;
    }
    console.log('User deleted.');
    res.status(200).send('User deleted.');
  });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
