import React, { useState } from 'react';
import { supabase } from './supabaseClient';

export const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false); // toggle sign-up/login

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSignUp) {
      // 🔐 Sign-Up
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        alert('❌ Sign up failed: ' + error.message);
      } else {
        alert('✅ Sign up successful! Please log in.');
        setIsSignUp(false); // switch to login
      }
    } else {
      // 🔓 Login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert('❌ Login failed: ' + error.message);
      } else {
        onLogin(); // only after login
      }
    }
  };

  return (
    <div className="login-wrapper">
      <h2>{isSignUp ? 'Sign Up' : 'Login'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">{isSignUp ? 'Create Account' : 'Login'}</button>
      </form>

      <p style={{ marginTop: '10px' }}>
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}
        >
          {isSignUp ? 'Login here' : 'Sign up here'}
        </button>
      </p>
    </div>
  );
};
