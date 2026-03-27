import React, { useState } from 'react';
import API_BASE_URL from '../config/api';
import '../styles/auth.css';

const LoginPage = ({ onLogin }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [userType, setUserType] = useState('employer');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: userType === 'employee' ? null : formData.email,
          employeeId: userType === 'employee' ? formData.email : null,
          password: formData.password,
          userType: userType
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Login failed');
        return;
      }

      // Store token
      localStorage.setItem('token', data.token);
      localStorage.setItem('userType', userType);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Call parent handler
      onLogin(userType);
    } catch (err) {
      setError('Network error. Please check your connection');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: userType === 'employee' ? null : formData.email,
          employeeId: userType === 'employee' ? formData.email : null,
          password: formData.password,
          userType: userType
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Signup failed');
        return;
      }

      // Auto login after signup
      localStorage.setItem('userType', userType);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Reset form and show success
      setFormData({ name: '', email: '', password: '', confirmPassword: '' });
      alert('Signup successful! Logging you in...');
      onLogin(userType);
    } catch (err) {
      setError('Network error. Please check your connection');
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = isSignup ? handleSignup : handleLogin;

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Employee Task Manager</h1>
        <p className="subtitle">AI-Powered Task Management System</p>
        
        <div className="user-type-selector">
          <button 
            className={`type-btn ${userType === 'employer' ? 'active' : ''}`}
            onClick={() => setUserType('employer')}
            type="button"
          >
            Employer
          </button>
          <button 
            className={`type-btn ${userType === 'employee' ? 'active' : ''}`}
            onClick={() => setUserType('employee')}
            type="button"
          >
            Employee
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">
              {userType === 'employee' ? 'Employee ID' : 'Email'}
            </label>
            <input
              type={userType === 'employee' ? 'text' : 'email'}
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={userType === 'employee' ? 'Enter your employee ID' : 'Enter your email'}
              required
            />
            {userType === 'employee' && !isSignup && (
              <small style={{color: '#666', marginTop: '5px', display: 'block'}}>
                Don't have a password yet? <a href="#" onClick={(e) => {e.preventDefault(); setIsSignup(true);}} style={{color: '#9AB17A', textDecoration: 'none'}}>Sign up first</a>
              </small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              required
            />
          </div>

          {isSignup && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                required
              />
            </div>
          )}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Loading...' : (isSignup ? 'Sign Up' : `Login as ${userType === 'employer' ? 'Employer' : 'Employee'}`)}
          </button>
        </form>

        <p className="signup-link">
          {isSignup ? (
            <>
              Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); setIsSignup(false); }}>Login</a>
            </>
          ) : (
            <>
              Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); setIsSignup(true); }}>Sign up</a>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
