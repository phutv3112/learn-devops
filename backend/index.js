try {
    const express = require('express');
    const cors = require('cors');

    const app = express();
    const PORT = 3000;

// Middleware
    app.use(cors());
    app.use(express.json());

// In-memory database (tạm thời)
    let todos = [
        { id: 1, title: 'Learn Docker Ver5 2026' },
        { id: 2, title: 'Learn Kubernetes 2026' },
        { id: 3, title: 'Learn CI/CD 2026' }
    ];
    let nextId = 4;

// ============================================
// ROUTES
// ============================================

// Health check
    app.get('/health', (req, res) => {
        res.json({ status: 'ok' });
    });

// Version
    app.get('/api/version', (req, res) => {
        res.json({ version: 'v1.0' });
    });

// Get all todos
    app.get('/api/todos', (req, res) => {
        console.log('GET /api/todos');
        res.json(todos);
    });

// Get single todo
    app.get('/api/todos/:id', (req, res) => {
        const todo = todos.find(t => t.id === parseInt(req.params.id));
        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.json(todo);
    });

// Create todo
    app.post('/api/todos', (req, res) => {
        const { title } = req.body;
        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        const newTodo = {
            id: nextId++,
            title
        };

        todos.push(newTodo);
        console.log('POST /api/todos -', title);
        res.status(201).json(newTodo);
    });

// Update todo
    app.put('/api/todos/:id', (req, res) => {
        const { title } = req.body;
        const todo = todos.find(t => t.id === parseInt(req.params.id));

        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        todo.title = title || todo.title;
        console.log('PUT /api/todos/:id -', todo.title);
        res.json(todo);
    });

// Delete todo
    app.delete('/api/todos/:id', (req, res) => {
        const index = todos.findIndex(t => t.id === parseInt(req.params.id));
        if (index === -1) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        const deleted = todos.splice(index, 1);
        console.log('DELETE /api/todos/:id -', deleted[0].title);
        res.json(deleted[0]);
    });

// ============================================
// START SERVER
// ============================================

    app.listen(PORT, '0.0.0.0', () => {
        console.log(`✅ Backend server running on port ${PORT}`);
        console.log(`📝 Open http://localhost:${PORT}/api/todos to see todos`);
    });
} catch (err) {
    console.error('❌ ERROR:', err);
}
