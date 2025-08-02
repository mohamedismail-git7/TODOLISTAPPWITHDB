import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) {
          alert('❌ Sign up failed: ' + error.message);
          return;
        }

        alert('✅ Sign up successful! Please log in.');
        setIsSignUp(false);
      } else {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) {
          alert('❌ Login failed: ' + signInError.message);
          return;
        }

        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
          alert('⚠️ Failed to retrieve user info');
          return;
        }

        try {
          await fetch('/api/save-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email })
          });
        } catch (err) {
          console.error('❌ Error saving user:', err.message);
        }

        onLogin(user.email);
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      alert('❌ Unexpected error: ' + err.message);
    }
  };

  return (
    <div className="login-wrapper" id="login-box">
      <h2 className="login-title">{isSignUp ? 'Sign Up' : 'Login'}</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          className="login-input"
          id="email-input"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          className="login-input"
          id="password-input"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="login-button" id="login-submit">
          {isSignUp ? 'Create Account' : 'Login'}
        </button>
      </form>

      <p className="auth-toggle-text">
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}
      </p>
      <button
        onClick={() => setIsSignUp(!isSignUp)}
        id="toggle-auth-btn"
      >
        {isSignUp ? 'Login here' : 'Sign up here'}
      </button>
    </div>
  );
};