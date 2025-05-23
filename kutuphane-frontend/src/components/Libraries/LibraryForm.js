// LibraryForm.js
import React, { useState } from 'react';
import axiosInstance from '../../api/axiosInstance';

const addButtonClassName = 'form-add-button';
const clearButtonClassName = 'form-clear-button';

const LibraryForm = ({ onLibraryAdded, disabled, setExternalError }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClearForm = () => {
    if (window.confirm('Formu temizlemek istediğinizden emin misiniz? Girilmiş veriler silinecektir.')) {
      setName('');
      setAddress('');
      if (setExternalError) {
        setExternalError(null); // LibraryList'teki formError'u temizler
      }
      // Bu fonksiyon, LibraryList'teki slider'ı YENİDEN YÜKLEMEZ.
      // Sadece form alanlarını ve potansiyel bir hata mesajını temizler.
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (setExternalError) setExternalError(null);

    if (!name.trim() || !address.trim()) {
      if (setExternalError) setExternalError('Kütüphane adı ve adresi boş olamaz.');
      return;
    }

    setIsSubmitting(true);
    try {
      await axiosInstance.post('/kutuphane/saveLibrary', {
        name: name.trim(),
        address: address.trim(),
      });
      setName(''); 
      setAddress(''); 
      if (onLibraryAdded) {
        onLibraryAdded(); 
      }
    } catch (error) {
      console.error('Kütüphane eklenirken hata:', error.response?.data || error);
      const errorMessage = error.response?.data?.message || error.message || "Kütüphane eklenirken bir hata oluştu.";
      if (setExternalError) setExternalError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'inherit' }}>
      <input
        type="text"
        placeholder="Kütüphane Adı"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          if (setExternalError) setExternalError(null);
        }}
        disabled={disabled || isSubmitting}
        required
      />
      <textarea
        placeholder="Adres"
        value={address}
        onChange={(e) => {
          setAddress(e.target.value);
          if (setExternalError) setExternalError(null);
        }}
        disabled={disabled || isSubmitting}
        required
        rows={3} 
        style={{ resize: 'vertical' }}
      />
      <div className="form-button-group">
        <button 
          type="submit" 
          className={addButtonClassName}
          disabled={disabled || isSubmitting || !name.trim() || !address.trim()}
        >
          {isSubmitting ? 'Ekleniyor...' : 'Ekle'}
        </button>
        <button 
          type="button" 
          className={clearButtonClassName}
          onClick={handleClearForm}
          disabled={disabled || isSubmitting}
        >
          Temizle
        </button>
      </div>
    </form>
  );
};

export default LibraryForm;