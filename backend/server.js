require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3001;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// Routes

// Get all todos with their categories
app.get('/api/todos', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        t.*,
        ARRAY_AGG(tc.category_id) as category_ids
      FROM todos t
      LEFT JOIN todo_categories tc ON t.id = tc.todo_id
      GROUP BY t.id
      ORDER BY t.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all categories
app.get('/api/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new todo
app.post('/api/todos', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { title, content, categoryIds, reminder, imageUrl } = req.body;
    
    // Insert todo
    const todoResult = await client.query(
      'INSERT INTO todos (title, content, reminder, image_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, content, reminder, imageUrl]
    );
    
    // Insert category associations
    if (categoryIds && categoryIds.length > 0) {
      const values = categoryIds.map(categoryId => 
        `('${todoResult.rows[0].id}', '${categoryId}')`
      ).join(',');
      await client.query(`
        INSERT INTO todo_categories (todo_id, category_id)
        VALUES ${values}
      `);
    }
    
    await client.query('COMMIT');
    res.status(201).json(todoResult.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// Create a new category
app.post('/api/categories', async (req, res) => {
  try {
    const { name, color } = req.body;
    const result = await pool.query(
      'INSERT INTO categories (name, color) VALUES ($1, $2) RETURNING *',
      [name, color]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a todo
app.put('/api/todos/:id', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { id } = req.params;
    const { title, content, completed, categoryIds, reminder, imageUrl } = req.body;
    
    // Update todo
    const todoResult = await client.query(
      'UPDATE todos SET title = $1, content = $2, completed = $3, reminder = $4, image_url = $5 WHERE id = $6 RETURNING *',
      [title, content, completed, reminder, imageUrl, id]
    );
    
    // Update categories
    await client.query('DELETE FROM todo_categories WHERE todo_id = $1', [id]);
    if (categoryIds && categoryIds.length > 0) {
      const values = categoryIds.map(categoryId => 
        `('${id}', '${categoryId}')`
      ).join(',');
      await client.query(`
        INSERT INTO todo_categories (todo_id, category_id)
        VALUES ${values}
      `);
    }
    
    await client.query('COMMIT');
    res.json(todoResult.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// Delete a todo
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM todos WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 