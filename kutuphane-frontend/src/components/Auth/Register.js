// src/components/Auth/Register.js
import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const Register = () => {
  const { register } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register(email, password, role);
    if (success) {
      // Redirect to dashboard or home
    } else {
      alert('Kayıt başarısız!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Kayıt Ol</h2>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-posta" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Şifre" required />
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="USER">Kullanıcı</option>
        <option value="ADMIN">Yönetici</option>
      </select>
      <button type="submit">Kayıt Ol</button>
    </form>
  );
};

export default Register;
