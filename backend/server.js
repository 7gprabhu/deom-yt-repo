const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const todoRoutes = require('./routes/todos');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB once per server instance (works for both
// local `node server.js` and Vercel serverless functions).
let isConnected = false;
async function connectDB() {
  if (isConnected || !process.env.MONGODB_URI) return;
  await mongoose.connect(process.env.MONGODB_URI);
  isConnected = true;
}

// Health check - handy for verifying the deploy worked
app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use('/api/todos', async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
}, todoRoutes);

// Global error handler so bad requests return JSON, not an HTML stack trace
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong' });
});

// Only start a real server when run directly.
// On Vercel the app is imported as a serverless function instead.
if (require.main === module) {
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
}

module.exports = app;
