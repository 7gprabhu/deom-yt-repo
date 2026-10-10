const express = require('express');
const Todo = require('../models/Todo');

const router = express.Router();

// GET /api/todos - list all, newest first
router.get('/', async (req, res) => {
  const todos = await Todo.find().sort({ createdAt: -1 });
  res.json(todos);
});

// POST /api/todos - create one
router.post('/', async (req, res) => {
  try {
    const todo = await Todo.create({ title: req.body.title });
    res.status(201).json(todo);
  } catch {
    res.status(400).json({ error: 'Title is required' });
  }
});

// PATCH /api/todos/:id - toggle done or rename
router.patch('/:id', async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  if (!todo) return res.status(404).json({ error: 'Todo not found' });

  if (typeof req.body.completed === 'boolean') todo.completed = req.body.completed;
  if (typeof req.body.title === 'string' && req.body.title.trim()) {
    todo.title = req.body.title.trim();
  }
  await todo.save();
  res.json(todo);
});

// DELETE /api/todos/:id
router.delete('/:id', async (req, res) => {
  const todo = await Todo.findByIdAndDelete(req.params.id);
  if (!todo) return res.status(404).json({ error: 'Todo not found' });
  res.status(204).end();
});

module.exports = router;
