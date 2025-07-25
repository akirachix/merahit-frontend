import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';  
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { Typography } from '@mui/material';
import './style.css';

function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const { login } = useAuth(); 

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form.username, form.password);
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <div className="login-bg">
      <div className="triangle triangle-left"></div>
      <div className="triangle triangle-right"></div>
      <div className="login-form-wrapper">
        <img
          src="/Images/sokoconnectlogo-removebg-preview.png"
          alt="Soko Connect Logo"
          className="login-logo"
        />
        <form className="login-form" onSubmit={handleSubmit}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>
            Admin Login
          </h2>
          {error && (
            <Typography color="error" sx={{ fontSize: '1.2rem', mb: 2 }} role="alert">
              {error}
            </Typography>
          )}
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
            style={{ fontSize: '1.2rem', padding: '12px', marginBottom: '1rem' }}
            aria-label="Username"
            required
          />
          <div className="password-container">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              style={{ fontSize: '1.2rem', padding: '12px' }}
              aria-label="Password"
              required
            />
            <span
              className={`password-toggle-icon ${showPassword ? 'open' : 'closed'}`}
              onClick={togglePasswordVisibility}
              role="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && togglePasswordVisibility()}
            >
              <FontAwesomeIcon icon={faEye} />
            </span>
          </div>
          <button
            type="submit"
            style={{ fontSize: '1.2rem', padding: '12px', marginTop: '1.5rem' }}
            aria-label="Log In"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
