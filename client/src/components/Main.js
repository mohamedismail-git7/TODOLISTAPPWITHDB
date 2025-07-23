import React, { useState } from 'react';
import { Login } from './Login';
import { TodoWrapper } from './TodoWrapper';

export const Main = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      {isLoggedIn ? <TodoWrapper /> : <Login onLogin={() => setIsLoggedIn(true)} />}
    </>
  );
};
