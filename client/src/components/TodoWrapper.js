import React, { useState, useEffect } from 'react';
import { TodoForm } from './TodoForm';
import { Todo } from './Todo';
import { EditTodoForm } from './EditTodoForm';
import axios from 'axios';

const BASE_URL = 'https://todolistbackend-ten.vercel.app/todos';

export const TodoWrapper = ({ userId }) => {
  const [todos, setTodos] = useState([]);

  // 🔁 Fetch todos for this user
  useEffect(() => {
    const fetchTodos = async () => {
      if (!userId) return;
      try {
        const res = await axios.post(`${BASE_URL}/todos/fetch`, { userEmail: userId });
        setTodos(res.data);
      } catch (err) {
        console.error('❌ Fetch Error:', err.response?.data?.message || err.message);
      }
    };

    fetchTodos();
  }, [userId]);

  // ➕ Add todo
  const addTodo = async (task) => {
    try {
      const res = await axios.post(`${BASE_URL}/todos`, {
        task,
        userEmail: userId
      });
      setTodos([...todos, res.data]);
    } catch (err) {
      console.error('❌ Add Error:', err.response?.data?.message || err.message);
    }
  };

  // ❌ Delete todo
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/todos/${id}`, {
        data: { userEmail: userId } // ✅ Include userEmail here
      });
      setTodos(todos.filter(t => t._id !== id));
    } catch (err) {
      console.error('❌ Delete Error:', err.response?.data?.message || err.message);
    }
  };

  // ✅ Toggle complete
  const togglecomplete = async (id) => {
    try {
      const todo = todos.find(t => t._id === id);
      const res = await axios.put(`${BASE_URL}/todos/${id}`, {
        completed: !todo.completed,
        userEmail: userId // ✅ Include userEmail here
      });
      setTodos(todos.map(t => t._id === id ? res.data : t));
    } catch (err) {
      console.error('❌ Toggle Complete Error:', err.response?.data?.message || err.message);
    }
  };

  // ✏️ Toggle edit mode
  const editTodo = (id) => {
    setTodos(todos.map(t => t._id === id ? { ...t, isEditing: !t.isEditing } : t));
  };

  // 💾 Save edited task
  const editTask = async (task, id) => {
    try {
      const res = await axios.put(`${BASE_URL}/todos/${id}`, {
        task,
        userEmail: userId // ✅ Include userEmail here
      });
      setTodos(todos.map(t => t._id === id ? { ...res.data, isEditing: false } : t));
    } catch (err) {
      console.error('❌ Edit Task Error:', err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="TodoWrapper">
      <h1>GET THINGS DONE!</h1>
      <TodoForm addTodo={addTodo} />
      {todos.map((todo) =>
        todo.isEditing ? (
          <EditTodoForm editTodo={editTask} task={todo} key={todo._id} />
        ) : (
          <Todo
            task={todo}
            key={todo._id}
            togglecomplete={togglecomplete}
            deleteTodo={deleteTodo}
            editTodo={editTodo}
          />
        )
      )}
    </div>
  );
};
