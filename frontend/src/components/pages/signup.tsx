import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../style/signup.css';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async () => {
   
    if (!username || !email || !password || !confirm) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    try {
      
      const response = await axios.post('http://localhost:8000/auth/register', {
        username,
        email,
        password,
      });

      console.log('Signup successful:', response.data);

      navigate('/login');
    } catch (err) {
      console.error('Signup error:', err);
      setError('Signup failed. Try again.');
    }
  };

  return (
    <div className="signup-container">
      <h1>ChatApp</h1>
      <h2>Sign Up</h2>

      {error && <p className="error">{error}</p>}

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="Confirm Password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
      />

      <button onClick={handleSignup}>Sign Up</button>

      <p>
        Already have an account?{' '}
        <span onClick={() => navigate('/login')} >
          Log in
        </span>
      </p>
    </div>
  );
};

export default SignupPage;
