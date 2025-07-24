import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';

export const Todo = ({ task, togglecomplete, deleteTodo, editTodo }) => {
  return (
    <div className="Todo">
      <p
        onClick={() => togglecomplete(task._id)}
        className={`${task.completed ? 'complete' : ''}`}
      >
        {task.task}
      </p>
      <div>
        <FontAwesomeIcon icon={faPenToSquare} onClick={() => editTodo(task._id)} />
        <FontAwesomeIcon icon={faTrash} onClick={() => deleteTodo(task._id)} />
      </div>
    </div>
  );
};
