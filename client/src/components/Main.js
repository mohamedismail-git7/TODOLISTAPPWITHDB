import React, { useState } from 'react';
import { Login } from '../components/Login';
import { TodoWrapper } from '../components/TodoWrapper';

export const Main = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null); // ✅ new

  // when login succeeds
  const handleLogin = (id) => {
    setUserId(id); // store user ID
    setIsLoggedIn(true);
  };

  return (
    <>
      {isLoggedIn ? (
        <TodoWrapper userId={userId} /> // ✅ pass userId as prop
      ) : (
        <Login onLogin={handleLogin} /> // ✅ pass the updated login handler
      )}
    </>
  );
};
