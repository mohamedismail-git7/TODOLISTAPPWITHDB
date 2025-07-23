import React, { useState } from 'react';
import { Login } from '../components/Login';
import { TodoWrapper } from '../components/TodoWrapper';

export const Main = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      {isLoggedIn ? (
        <TodoWrapper />
      ) : (
        <Login onLogin={() => setIsLoggedIn(true)} />
      )}
    </>
  );
};
