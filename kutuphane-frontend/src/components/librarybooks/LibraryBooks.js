import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';

const LibraryBooks = () => {
  const [bookId, setBookId] = useState('');
  const [libraryId, setLibraryId] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [isBookInLibrary, setIsBookInLibrary] = useState(null);
  const [librariesAndBooks, setLibrariesAndBooks] = useState([]);
  const [libraryBooks, setLibraryBooks] = useState([]);
  const [books, setBooks] = useState([]);
  const [libraries, setLibraries] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDropdownData = async () => {
    try {
      const [booksRes, librariesRes, authorsRes] = await Promise.all([
        axiosInstance.get('/books/getAllBooks'),
        axiosInstance.get('/kutuphane/getAllLibraries'),
        axiosInstance.get('/authors/getAllAuthor'),
      ]);
      const booksData = booksRes.data.content || booksRes.data;
      const librariesData = librariesRes.data.content || librariesRes.data;
      const authorsData = authorsRes.data.content || authorsRes.data;
      setBooks(booksData);
      setLibraries(librariesData);
      setAuthors(authorsData);
    } catch (error) {
      console.error('Dropdown verileri alınırken hata:', error);
    }
  };

  const fetchAllLibraryBooks = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/Kutuphane-kitap/getAllLibraryBook?page=0&size=50`);
      const page = response.data;
      const contentLayer = page.content || page;
      const data = Array.isArray(contentLayer)
        ? contentLayer
        : contentLayer.content || contentLayer;
      setLibraryBooks(data || []);
    } catch (error) {
      console.error('Kütüphane kitapları alınırken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkIfBookInLibrary = async () => {
    if (!libraryId || !bookId) {
      alert('Kitap ve Kütüphane seçilmelidir.');
      return;
    }

    try {
      const response = await axiosInstance.get(
        `/Kutuphane-kitap/isBookInLibrary/${libraryId}/${bookId}`
      );
      setIsBookInLibrary(response.data);
    } catch (error) {
      alert('Kitap kütüphanede olup olmadığı kontrol edilirken hata oluştu.');
      console.error('Hata:', error);
    }
  };

  const fetchLibrariesAndBooksByAuthor = async () => {
    if (!authorId) {
      alert('Yazar seçilmelidir.');
      return;
    }

    try {
      const response = await axiosInstance.get(
        `/Kutuphane-kitap/getLibrariesAndBooksByAuthor/${authorId}?page=0&size=50`
      );
      const page = response.data;
      const contentLayer = page.content || page;
      const items = Array.isArray(contentLayer)
        ? contentLayer
        : contentLayer.content || contentLayer;

      // DÜZENLENEN KISIM
      const formatted = items.map(item => {
        if (Array.isArray(item) && item.length >= 2) {
          return item; // [libraryName, bookTitle]
        }
        return ['Kütüphane adı yok', 'Kitap adı yok'];
      });
      setLibrariesAndBooks(formatted);
    } catch (error) {
      alert('Yazarın kitapları alınırken hata oluştu.');
      console.error('Hata:', error);
    }
  };

  const handleAddBookToLibrary = async (e) => {
    e.preventDefault();
    if (!bookId || !libraryId) {
      alert('Kitap ve Kütüphane seçilmelidir.');
      return;
    }

    try {
      await axiosInstance.post(
        `/Kutuphane-kitap/addBookToLibrary/${bookId}/${libraryId}`
      );
      alert('Kitap kütüphaneye başarıyla eklendi!');
      fetchAllLibraryBooks();
    } catch (error) {
      alert('Kitap eklenirken hata oluştu.');
      console.error('Hata:', error);
    }
  };

  useEffect(() => {
    fetchDropdownData();
    fetchAllLibraryBooks();
  }, []);

  return (
    <div>
      <h3>Kütüphane Kitapları</h3>

      <form onSubmit={handleAddBookToLibrary} style={{ marginBottom: '20px' }}>
        <h4>Kitap Kütüphaneye Ekle</h4>
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
          {libraries.map((library) => (
            <option key={library.id} value={library.id}>
              {library.name}
            </option>
          ))}
        </select>

        <button type="submit" disabled={loading}>
          {loading ? 'Kitap Ekleniyor...' : 'Kitap Ekle'}
        </button>
      </form>

      <div>
        <h4>Kitap Kütüphanede Mi?</h4>
        <button onClick={checkIfBookInLibrary}>Kontrol Et</button>
        {isBookInLibrary !== null && (
          <p>{isBookInLibrary ? 'Kitap kütüphanede mevcut.' : 'Kitap kütüphanede mevcut değil.'}</p>
        )}
      </div>

      <div>
        <h4>Yazarın Kitapları ve Kütüphaneleri</h4>
        <select value={authorId} onChange={(e) => setAuthorId(e.target.value)} required>
          <option value="">Yazar Seç</option>
          {authors.map((author) => (
            <option key={author.id} value={author.id}>
              {author.name} {author.surname}
            </option>
          ))}
        </select>
        <button onClick={fetchLibrariesAndBooksByAuthor}>Yazarın Kitaplarını Göster</button>
        <ul>
          {librariesAndBooks.length > 0 ? (
            librariesAndBooks.map((item, i) => (
              <li key={i}>
                {item[1] || 'Kitap adı yok'} - {item[0] || 'Kütüphane adı yok'}
              </li>
            ))
          ) : (
            <p>Yazarın kitapları ve kütüphaneleri bulunamadı.</p>
          )}
        </ul>
      </div>

      <h4>Tüm Kütüphane Kitapları</h4>
      {loading ? (
        <p>Yükleniyor...</p>
      ) : (
        <ul>
          {libraryBooks.length > 0 ? (
            libraryBooks.map((libraryBook) => (
              <li key={libraryBook.id}>
                {libraryBook.book?.title || 'Kitap adı yok'} - {libraryBook.library?.name || 'Kütüphane adı yok'}
              </li>
            ))
          ) : (
            <p>Henüz kütüphaneye eklenmiş kitap yok.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default LibraryBooks;
