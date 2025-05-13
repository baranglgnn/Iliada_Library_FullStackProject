// src/components/Libraries/LibraryForm.js
import React, { useState } from 'react';
import axiosInstance from '../../api/axiosInstance';

const LibraryForm = ({ onLibraryAdded }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [adding, setAdding] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !address.trim()) {
      alert("Kütüphane adı ve adres boş bırakılamaz.");
      return;
    }

    // Backend'e gönderilecek data. Backend Service String name, String address alıyor.
    // Controller muhtemelen @RequestBody Librarys newLibrary alıyor.
    const data = {
      name: name.trim(),
      address: address.trim(),
      // Backend Librarys entity'nde 'status' nullable=false ise ve controller set etmiyorsa ekle:
      // status: true
    };

    console.log("Kütüphane ekleme isteği gönderiliyor:", data);

    try {
      setAdding(true);
      // *** Kütüphane ekleme API isteği (Bu POST, SecurityConfig'de authenticated() gerektiriyor) ***
      const response = await axiosInstance.post("/kutuphane/saveLibrary", data); // Bu istek 403 verebilir eğer kullanıcı authenticated değilse
      console.log("Kütüphane başarıyla eklendi:", response.data);
      alert('Kütüphane başarıyla eklendi!');

      setName('');
      setAddress('');
      if (onLibraryAdded) {
        onLibraryAdded(); // Listeyi yenile
      }
    } catch (err) {
      // *** Ekleme isteği 403 veya 400 gibi hatalar verdiğinde BURADA yakalanır ***
      console.error("Kütüphane ekleme hatası:", err.response?.status, err.message, err.response?.data);
      const errorMessage = err.response?.data?.message || err.message || 'Bilinmeyen bir hata oluştu.';
      alert(`Kütüphane eklenirken bir hata oluştu: ${errorMessage}. Durum: ${err.response?.status || 'Yok'}`);
    } finally {
      setAdding(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '20px', borderTop: '1px solid #ccc', paddingTop: '20px', padding: '20px' }}>
      <h3>Yeni Kütüphane Ekle</h3>
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="libraryName" style={{ marginRight: '10px' }}>Ad:</label>
        <input type="text" id="libraryName" value={name} onChange={e => setName(e.target.value)} required />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="libraryAddress" style={{ marginRight: '10px' }}>Adres:</label>
        <input type="text" id="libraryAddress" value={address} onChange={e => setAddress(e.target.value)} required />
      </div>
      <button type="submit" disabled={adding} style={{ marginTop: '10px' }}>{adding ? 'Ekleniyor...' : 'Ekle'}</button>
    </form>
  );
};

export default LibraryForm;