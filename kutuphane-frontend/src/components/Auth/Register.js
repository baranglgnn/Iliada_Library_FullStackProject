// src/components/Auth/Register.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '2rem',
    // backgroundColor: '#f0f2f5', // Bu satır kaldırıldı veya transparent yapıldı
    // veya
    backgroundColor: 'transparent', // Arka planı şeffaf yap
  };

  const formContainerStyle = {
    padding: '2rem',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    backgroundColor: '#fff', // Formun kendisi beyaz kalacak
    width: '100%',
    maxWidth: '400px',
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    marginBottom: '1rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxSizing: 'border-box',
  };

  const selectStyle = {
    ...inputStyle,
  };

  const buttonStyle = {
    width: '100%',
    padding: '0.75rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    color: 'white',
    backgroundColor: '#28a745',
    marginTop: '1rem',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    try {
      const success = await register(email, password, role);
      if (success) {
        setSuccessMessage('Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...');
        setTimeout(() => {
          navigate('/login');
        }, 2500);
      } else {
        setError('Kayıt başarısız oldu. Lütfen bilgilerinizi kontrol edin.');
      }
    } catch (err) {
      setError(err.message || 'Kayıt işlemi sırasında bir hata oluştu.');
    }
  };

  return (
    <div style={containerStyle}> {/* Bu div'in arka planı artık şeffaf */}
      <div style={formContainerStyle}> {/* Formun kendi arka planı beyaz kalacak */}
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#333' }}>
          Kayıt Ol
        </h2>

        {error && (
          <p style={{
            marginBottom: '1rem',
            textAlign: 'center',
            color: 'red',
            backgroundColor: '#ffebee',
            padding: '0.5rem',
            borderRadius: '4px',
            border: '1px solid #ffcdd2'
          }}>
            {error}
          </p>
        )}
        {successMessage && (
          <p style={{
            marginBottom: '1rem',
            textAlign: 'center',
            color: 'green',
            backgroundColor: '#e8f5e9',
            padding: '0.5rem',
            borderRadius: '4px',
            border: '1px solid #c8e6c9'
          }}>
            {successMessage}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-posta"
            required
            style={inputStyle}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Şifre"
            required
            style={inputStyle}
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={selectStyle}
          >
            <option value="USER">Kullanıcı</option>
            <option value="ADMIN">Yönetici</option>
          </select>
          <button type="submit" style={buttonStyle}>
            Kayıt Ol
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button
            type="button"
            onClick={() => navigate('/login')}
            style={{
              background: 'none',
              border: 'none',
              color: '#007bff',
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: '0.5rem'
            }}
          >
            Zaten bir hesabın var mı? Giriş Yap
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;