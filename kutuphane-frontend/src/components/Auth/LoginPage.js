// src/components/Auth/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

const LoginPage = () => {
  const [email, setEmail] = useState(''); // mail ile giriş varsayıyoruz
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post('/auth/login', {
        email,
        password,
      });

      localStorage.setItem('token', response.data.token);
      navigate("/home");

    } catch (error) {
      alert('Giriş başarisiz: ' + error.response?.data?.message || error.message);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Giriş Yap</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email adresiniz"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br /><br />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br /><br />
        <button type="submit">Giriş Yap</button>
      </form>
    </div>
  );
};

export default LoginPage;
