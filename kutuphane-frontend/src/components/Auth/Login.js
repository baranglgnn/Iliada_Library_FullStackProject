import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // önceki hatayı temizle

    try {
      const success = await login(email, password);

      if (!success) {
        setErrorMessage('Giriş başarisiz: Lütfen bilgilerinizi kontrol edin.');
      }
    } catch (error) {
      console.error('Giriş hatasi:', error);
      setErrorMessage('Sunucu hatasi veya bağlanti problemi.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Giriş Yap</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="E-posta"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Şifre"
        required
      />
      <button type="submit">Giriş</button>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </form>
  );
};

export default Login;
