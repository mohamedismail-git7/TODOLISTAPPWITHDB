const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();


const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Schema and Model
const todoSchema = new mongoose.Schema({
  task: String,
  completed: Boolean
});
const Todo = mongoose.model('Todo', todoSchema);

// Routes
app.get('/', (req, res) => {
  res.send('✅ Backend Server is Running! Visit /todos for data.');
});

app.get('/todos', async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

app.post('/todos', async (req, res) => {
  const todo = new Todo({ task: req.body.task, completed: false });
  await todo.save();
  res.json(todo);
});

app.put('/todos/:id', async (req, res) => {
  const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(todo);
});

app.delete('/todos/:id', async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: 'Todo Deleted Successfully' });
});

// ✅ Export the app instead of listening (for Vercel)
if (require.main === module) {
  // Only run this when executing locally
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server is running at: http://localhost:${PORT}/`);
  });
} else {
  module.exports = app; // Used by Vercel
}

