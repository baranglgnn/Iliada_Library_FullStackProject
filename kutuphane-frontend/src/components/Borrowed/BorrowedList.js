import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';

const BorrowedBooks = () => {
  const [citizenTc, setCitizenTc] = useState('');
  const [citizenId, setCitizenId] = useState(null);
  const [bookId, setBookId] = useState('');
  const [libraryId, setLibraryId] = useState('');
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [isBookBorrowed, setIsBookBorrowed] = useState(null);
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState([]);
  const [libraries, setLibraries] = useState([]);

  // Kitap ve kütüphaneleri al
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookRes, libRes] = await Promise.all([
          axiosInstance.get('/books/getAllBooks'),
          axiosInstance.get('/kutuphane/getAllLibraries'),
        ]);
        setBooks(Array.isArray(bookRes.data.content) ? bookRes.data.content : []);
        setLibraries(Array.isArray(libRes.data.content) ? libRes.data.content : []);
      } catch (err) {
        console.error('Veriler alınamadı:', err);
      }
    };
    fetchData();
  }, []);

  // TC girildiğinde vatandaşı bul
  const handleFetchCitizenId = async () => {
    try {
      const res = await axiosInstance.get(`/citizens/getIdByTc/${citizenTc}`);
      setCitizenId(res.data);
      fetchActiveBorrowedBooks(res.data);
    } catch (error) {
      alert('TC numarasına ait vatandaş bulunamadı.');
      console.error('Hata:', error);
    }
  };

  const fetchActiveBorrowedBooks = async (id) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/borrowed/activeBorrowedBooks/${id}`);
      setBorrowedBooks(response.data);
    } catch (error) {
      console.error('Ödünç alınan kitaplar alınırken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBorrowBook = async (e) => {
    e.preventDefault();
    if (!citizenId || !bookId || !libraryId) {
      alert('Tüm alanlar doldurulmalı.');
      return;
    }

    try {
      await axiosInstance.post(`/borrowed/borrow/${citizenId}/${bookId}/${libraryId}`);
      alert('Kitap başarıyla ödünç alındı!');
      fetchActiveBorrowedBooks(citizenId);
    } catch (error) {
      alert('Kitap ödünç alınırken hata oluştu.');
      console.error('Hata:', error);
    }
  };

  const handleReturnBook = async (e, bookId) => {
    e.preventDefault();
    try {
      await axiosInstance.post(`/borrowed/return/${citizenId}/${bookId}`);
      alert('Kitap başarıyla iade edildi!');
      fetchActiveBorrowedBooks(citizenId);
    } catch (error) {
      alert('Kitap iade edilirken hata oluştu.');
      console.error('Hata:', error);
    }
  };

  const checkIfBookIsBorrowed = async () => {
    if (!citizenId || !bookId) {
      alert('Lütfen TC girip kitap seçiniz.');
      return;
    }

    try {
      const response = await axiosInstance.get(`/borrowed/isBookBorrowed/${citizenId}/${bookId}`);
      setIsBookBorrowed(response.data);
    } catch (error) {
      alert('Kontrol sırasında hata oluştu.');
      console.error('Hata:', error);
    }
  };

  return (
    <div>
      <h3>Ödünç Kitaplar</h3>

      <div>
        <input
          type="text"
          placeholder="TC Kimlik No"
          value={citizenTc}
          onChange={(e) => setCitizenTc(e.target.value)}
        />
        <button onClick={handleFetchCitizenId}>TC'yi Onayla</button>
      </div>

      {citizenId && (
        <>
          <form onSubmit={handleBorrowBook} style={{ marginTop: '20px' }}>
            <h4>Kitap Ödünç Al</h4>

            <select value={bookId} onChange={(e) => setBookId(e.target.value)} required>
              <option value="">Kitap Seç</option>
              {books.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title}
                </option>
              ))}
            </select>

            <select value={libraryId} onChange={(e) => setLibraryId(e.target.value)} required>
              <option value="">Kütüphane Seç</option>
              {libraries.map((lib) => (
                <option key={lib.id} value={lib.id}>
                  {lib.name}
                </option>
              ))}
            </select>

            <button type="submit" disabled={loading}>
              {loading ? 'İşlem yapılıyor...' : 'Ödünç Al'}
            </button>
          </form>

          <div style={{ marginTop: '20px' }}>
            <h4>Kitap Ödünç Alındı mı?</h4>
            <button onClick={checkIfBookIsBorrowed}>Kontrol Et</button>
            {isBookBorrowed !== null && (
              <p>{isBookBorrowed ? 'Kitap ödünç alınmış.' : 'Kitap ödünç alınmamış.'}</p>
            )}
          </div>

          <div style={{ marginTop: '20px' }}>
            <h4>Aktif Ödünç Alınan Kitaplar</h4>
            {loading ? (
              <p>Yükleniyor...</p>
            ) : (
              <ul>
                {borrowedBooks.length > 0 ? (
                  borrowedBooks.map((book) => (
                    <li key={book.id}>
                      {book.title}{' '}
                      <button onClick={(e) => handleReturnBook(e, book.id)}>İade Et</button>
                    </li>
                  ))
                ) : (
                  <p>Ödünç alınmış kitap bulunmamaktadır.</p>
                )}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default BorrowedBooks;
