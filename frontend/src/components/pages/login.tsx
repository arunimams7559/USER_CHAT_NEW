import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import '../style/login.css'; 

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');


  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5001/auth/login`, {
        email,
        password,
      });

      setErrorMessage('');
      console.log('Login successful:', response.data);

  
      navigate('/chat');
    } catch (error) {
      setErrorMessage('Invalid email or password.');
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="login-container">
      <div className="app-brand">
        <h1>ChatApp</h1>
        <p>Connect with friends and family</p>
      </div>

      <h2>Welcome Back</h2>

      {errorMessage && <p className="error">{errorMessage}</p>}

      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
        />
      </div>

      <button onClick={handleLogin}>Log In</button>

      <p className="switch-link">
        Don't have an account?{' '}
        <span onClick={() => navigate('/signup')} style={{ color: 'blue', cursor: 'pointer' }}>
          Sign up
        </span>
      </p>
    </div>
  );
};

export default LoginPage;
