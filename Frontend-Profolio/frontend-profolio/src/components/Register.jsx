// src/components/Register.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const navigate              = useNavigate();
  
  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if(res.ok){
        localStorage.setItem('token', data.token);
        navigate('/');
      } else {
        alert(data.msg || 'Registration failed');
      }
    } catch(err) {
      console.error(err);
      alert('Error during registration');
    }
  };
  
  return (
    <div style={{ maxWidth: '400px', margin: '50px auto' }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label><br/>
          <input type="text" value={name} onChange={(e)=> setName(e.target.value)} required />
        </div>
        <div>
          <label>Email:</label><br/>
          <input type="email" value={email} onChange={(e)=> setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label><br/>
          <input type="password" value={password} onChange={(e)=> setPassword(e.target.value)} required />
        </div>
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login Here</Link>
      </p>
    </div>
  );
};

export default Register;
