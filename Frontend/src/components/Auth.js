import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [isRegister, setIsRegister] = useState(true); // Toggle between login and register
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // 🚀 For redirection

  const handleRegister = async () => {
    const userData = { username, email, password };
    console.log('Request Payload:', userData); // Debugging

    try {
      const response = await axios.post('http://localhost:5000/auth/register', userData);
      console.log('Registration successful:', response.data);
      alert('Registration successful! Please log in.');
      setIsRegister(false); // ✅ Switch to login instead of navigating
    } catch (error) {
      console.error('Registration failed:', error.response?.data);
      alert('Registration failed: ' + (error.response?.data?.error || 'Unknown error'));
    }
  };

  const handleLogin = async () => {
    const userData = { username, password };
    console.log("Request Payload:", userData); // Debugging
  
    try {
      const response = await axios.post("http://localhost:5000/auth/login", userData);
      console.log("Login Response:", response.data);
  
      const { token, userId, portfolioIds = [] } = response.data; // Expecting userId & portfolioIds array
  
      if (!token || !userId) {
        throw new Error("Invalid server response: Missing token or userId.");
      }
  
      // Store authentication details
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
  
      if (portfolioIds.length > 0) {
        // If user has portfolios, store the first one and navigate
        localStorage.setItem("portfolioId", portfolioIds[0]);
        alert("Login successful! Redirecting to your profile...");
        navigate(`/profile`);
      } else {
        // No portfolio found, redirect to create one
        alert("Login successful, but no portfolio found. Redirecting to create one...");
        navigate("/create-portfolio");
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      alert("Login failed: " + (error.response?.data?.error || "Something went wrong"));
    }
  };
  
  

  return (
    <div style={styles.container}>
      <h2>{isRegister ? 'Register' : 'Login'}</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={styles.input}
        required
      />
      {isRegister && (
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
          required
        />
      )}
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
        required
      />
      <button onClick={isRegister ? handleRegister : handleLogin} style={styles.button}>
        {isRegister ? 'Register' : 'Login'}
      </button>
      <p onClick={() => setIsRegister(!isRegister)} style={styles.toggleText}>
        {isRegister ? 'Already have an account? Login' : 'Need an account? Register'}
      </p>
    </div>
  );
};

// Styles remain the same
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f5f5f5',
  },
  input: {
    margin: '10px 0',
    padding: '10px',
    width: '300px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    margin: '10px 0',
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  toggleText: {
    color: '#007bff',
    cursor: 'pointer',
  },
};

export default Auth;
