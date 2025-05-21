// LibraryForm.js
import React, { useState } from 'react';
import axiosInstance from '../../api/axiosInstance';

// CSS sınıf isimlerini dışarıdan alabiliriz veya sabit tanımlayabiliriz.
// Şimdilik sabit kullanalım.
const addButtonClassName = 'form-add-button';
const clearButtonClassName = 'form-clear-button';


const LibraryForm = ({ onLibraryAdded, disabled, setExternalError }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // GÜNCELLENMİŞ TEMİZLE FONKSİYONU
  const handleClearForm = () => {
    // Kullanıcıdan onay al
    if (window.confirm('Formu temizlemek istediğinizden emin misiniz? Girilmiş veriler silinecektir.')) {
      setName('');
      setAddress('');
      if (setExternalError) {
        setExternalError(null);
      }
      // Sayfa yenileme yerine state'leri sıfırlıyoruz.
      // Eğer formu temizledikten sonra ana bileşenin bir aksiyon alması gerekiyorsa
      // (örneğin listeyi yeniden yüklemek gibi), bunu prop aracılığıyla tetikleyebilirsiniz.
      // Ancak şimdilik sadece form alanlarını temizliyoruz.
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
      await axiosInstance.post('/kutuphane/addLibrary', {
        name: name.trim(),
        address: address.trim(),
      });
      setName(''); // Başarılı ekleme sonrası formu temizle
      setAddress(''); // Başarılı ekleme sonrası formu temizle
      if (onLibraryAdded) {
        onLibraryAdded(); // Ana bileşene kütüphane eklendiğini bildir
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
      {/* Butonlar için bir sarmalayıcı div */}
      <div className="form-button-group">
        <button 
          type="submit" 
          className={addButtonClassName} // CSS sınıfı eklendi
          disabled={disabled || isSubmitting || !name.trim() || !address.trim()}
        >
          {isSubmitting ? 'Ekleniyor...' : 'Ekle'}
        </button>
        <button 
          type="button" 
          className={clearButtonClassName} // CSS sınıfı eklendi
          onClick={handleClearForm} // Bu fonksiyon güncellendi
          disabled={disabled || isSubmitting} // Ekleme sırasında temizleme de disable olabilir
        >
          Temizle
        </button>
      </div>
    </form>
  );
};

export default LibraryForm;