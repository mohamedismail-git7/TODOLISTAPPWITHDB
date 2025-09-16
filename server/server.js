const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔁 MongoDB connection with serverless-friendly reuse
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("✅ MongoDB connected");
    isConnected = true;
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
};
connectDB();

// ✅ Todo Schema & Model
const todoSchema = new mongoose.Schema({
  task: { type: String, required: true },
  completed: { type: Boolean, default: false },
  userEmail: { type: String, required: true }
});
const Todo = mongoose.models.Todo || mongoose.model('Todo', todoSchema);

// ✅ User Schema & Model
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }
});
const User = mongoose.models.User || mongoose.model('User', userSchema);

// ✅ Health check
app.get('/', (req, res) => {
  res.send('✅ Backend Server Running! Use /todos?userEmail=email@example.com');
});

// 📥 Get todos for specific user
app.get('/todos', async (req, res) => {
  const { userEmail } = req.query;
  if (!userEmail) return res.status(400).json({ message: 'Missing userEmail in query params' });

  try {
    const todos = await Todo.find({ userEmail });
    res.json(todos);
  } catch (err) {
    console.error('❌ GET /todos error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// ➕ Create todo
app.post('/todos', async (req, res) => {
  const { task, userEmail } = req.body;
  if (!task || !userEmail) return res.status(400).json({ message: 'Task and userEmail required' });

  try {
    const todo = await Todo.create({ task, completed: false, userEmail });
    res.status(201).json(todo);
  } catch (err) {
    console.error('❌ POST /todos error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// ✅ Update todo
app.put('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    res.json(todo);
  } catch (err) {
    console.error('❌ PUT /todos/:id error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// ❌ Delete todo
app.delete('/todos/:id', async (req, res) => {
  try {
    const deleted = await Todo.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Todo not found' });
    res.json({ message: 'Todo deleted successfully' });
  } catch (err) {
    console.error('❌ DELETE /todos/:id error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// ✅ Save user (optional)
app.post('/api/save-user', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      await User.create({ email });
      return res.status(201).json({ message: 'New user saved' });
    } else {
      return res.status(200).json({ message: 'User already exists' });
    }
  } catch (err) {
    console.error('❌ POST /api/save-user error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// ✅ Export app for Vercel
module.exports = app;
