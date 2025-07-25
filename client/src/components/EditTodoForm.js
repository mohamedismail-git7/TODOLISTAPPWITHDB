import React, { useState } from 'react';

export const EditTodoForm = ({ editTodo, task }) => {
  const [value, setValue] = useState(task.task);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    editTodo(value, task._id);
    setValue('');
  };

  return (
    <form className='TodoForm' onSubmit={handleSubmit}>
      <input
        type='text'
        className='todo-input'
        value={value}
        placeholder='Update Your Task'
        onChange={(e) => setValue(e.target.value)}
      />
      <button type='submit' className='todo-btn'>Update Task</button>
    </form>
  );
};
