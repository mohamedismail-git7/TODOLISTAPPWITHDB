import React, { useState, useEffect } from 'react';
import { TodoForm } from './TodoForm';
import { Todo } from './Todo';
import { EditTodoForm } from './EditTodoForm';

const BASE_URL = "https://0ygb0enhte.execute-api.ap-south-1.amazonaws.com/default/todos";

export const TodoWrapper = ({ userEmail }) => {
  const [todos, setTodos] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);

  // Fetch todos on load
  useEffect(() => {
    if (userEmail) {
      fetch(`${BASE_URL}?userEmail=${userEmail}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setTodos(data);
          }
        })
        .catch(err => console.error("Error fetching todos:", err));
    }
  }, [userEmail]);

  // Add new todo
  const addTodo = task => {
    fetch(BASE_URL, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task, userEmail })
    })
      .then(res => res.json())
      .then(newTodo => setTodos([...todos, newTodo]))
      .catch(err => console.error("Error adding todo:", err));
  };

  // Delete a todo
  const deleteTodo = id => {
    fetch(`${BASE_URL}/${id}`, {
      method: "DELETE"
    })
      .then(res => res.json())
      .then(() => setTodos(todos.filter(todo => todo._id !== id)))
      .catch(err => console.error("Error deleting todo:", err));
  };

  // Toggle complete
  const toggleComplete = id => {
    const todo = todos.find(t => t._id === id);
    if (!todo) return;

    fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !todo.completed })
    })
      .then(res => res.json())
      .then(updated => {
        setTodos(todos.map(t => (t._id === id ? { ...t, completed: updated.completed } : t)));
      })
      .catch(err => console.error("Error updating todo:", err));
  };

  // Update todo
  const editTask = (id, newTask) => {
    fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: newTask })
    })
      .then(res => res.json())
      .then(updated => {
        setTodos(todos.map(todo => (todo._id === id ? updated : todo)));
        setEditingTodo(null);
      })
      .catch(err => console.error("Error editing todo:", err));
  };

  return (
    <div className="TodoWrapper">
      <h1>My Todo List</h1>
      <TodoForm addTodo={addTodo} />

      {todos.map(todo =>
        editingTodo === todo._id ? (
          <EditTodoForm
            key={todo._id}
            editTodo={editTask}
            task={todo}
            cancelEdit={() => setEditingTodo(null)}
          />
        ) : (
          <Todo
            key={todo._id}
            task={todo}
            toggleComplete={toggleComplete}
            deleteTodo={deleteTodo}
            editTodo={() => setEditingTodo(todo._id)}
          />
        )
      )}
    </div>
  );
};
