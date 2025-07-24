const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Loads variables from .env

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// ✅ Todo Schema & Model
const todoSchema = new mongoose.Schema({
  task: { type: String, required: true },
  completed: { type: Boolean, default: false },
  userEmail: { type: String, required: true } // 👈 Tied to specific user
});
const Todo = mongoose.model('Todo', todoSchema);

// ✅ User Schema & Model
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }
});
const User = mongoose.model('User', userSchema);

// ✅ Health Route
app.get('/', (req, res) => {
  res.send('✅ Backend Server is Running! Visit /todos?userEmail=email@example.com');
});

// 📥 Get Todos for Specific User
app.get('/todos', async (req, res) => {
  const { userEmail } = req.query;

  if (!userEmail) {
    return res.status(400).json({ message: '⚠️ Missing userEmail in query params' });
  }

  try {
    const todos = await Todo.find({ userEmail });
    res.json(todos);
  } catch (err) {
    console.error('❌ Failed to fetch todos:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// ➕ Create Todo for Specific User
app.post('/todos', async (req, res) => {
  const { task, userEmail } = req.body;

  if (!task || !userEmail) {
    return res.status(400).json({ message: '⚠️ Task and userEmail are required' });
  }

  try {
    const todo = new Todo({ task, completed: false, userEmail });
    await todo.save();
    res.status(201).json(todo);
  } catch (err) {
    console.error('❌ Failed to create todo:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// ✅ Update Todo
app.put('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json(todo);
  } catch (err) {
    console.error('❌ Failed to update todo:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// ❌ Delete Todo
app.delete('/todos/:id', async (req, res) => {
  try {
    const deleted = await Todo.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json({ message: '✅ Todo Deleted Successfully' });
  } catch (err) {
    console.error('❌ Failed to delete todo:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// ✅ Save Logged-in User (Optional for tracking)
app.post('/api/save-user', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: '⚠️ Email is required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      const newUser = new User({ email });
      await newUser.save();
      return res.status(201).json({ message: '✅ New user saved' });
    } else {
      return res.status(200).json({ message: 'ℹ️ User already exists' });
    }
  } catch (err) {
    console.error('❌ Error saving user:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running at: http://localhost:${PORT}/`);
});
