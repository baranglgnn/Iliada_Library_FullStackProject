// src/components/Auth/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

const LoginPage = () => {
  const [email, setEmail] = useState('');
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
      alert('Giriş başarısız: ' + (error.response?.data?.message || error.message));
    }
  };

  const goToRegisterPage = () => {
    navigate('/register'); // Kayıt sayfasına yönlendir
  };

  // Temel stiller
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '80vh',
    padding: '2rem',
  };

  const formContainerStyle = {
    padding: '2rem',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
    width: '100%',
    maxWidth: '400px',
  };

  const inputStyle = {
    width: 'calc(100% - 1.5rem)', // padding'i hesaba katarak
    padding: '0.75rem',
    marginBottom: '1rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxSizing: 'border-box',
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '1rem', // Butonlar arası boşluk
    marginTop: '1rem',
  };

  const buttonStyle = {
    flex: 1, // Butonların eşit genişlikte olması için
    padding: '0.75rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    color: 'white',
  };

  const loginButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#007bff', // Mavi tonu
  };

  const registerButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#6c757d', // Gri tonu (veya #28a745 yeşil)
  };


  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Giriş Yap</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email adresiniz"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />
          <div style={buttonContainerStyle}>
            <button type="submit" style={loginButtonStyle}>
              Giriş Yap
            </button>
            <button type="button" onClick={goToRegisterPage} style={registerButtonStyle}>
              Kayıt Ol
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;