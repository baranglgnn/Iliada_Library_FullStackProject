import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ title: '', authorId: '' });
  const [editingBook, setEditingBook] = useState(null);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchBooks(currentPage);
    fetchAuthors();
  }, [currentPage]);

  const fetchBooks = async (page) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/books/getAllBooks?page=${page}&size=10`);
      setBooks(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Kitaplar alınırken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuthors = async () => {
    try {
      const response = await axiosInstance.get('/authors/getAllAuthor');
      const data = response.data;
      setAuthors(Array.isArray(data) ? data : data.content);
    } catch (error) {
      console.error('Yazarlar alınırken hata:', error);
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    if (!newBook.title || !newBook.authorId) {
      alert('Kitap adı ve yazar seçimi boş olamaz.');
      return;
    }

    try {
      const requestBody = {
        title: newBook.title,
        author: { id: Number(newBook.authorId) }
      };

      await axiosInstance.post('/books/addBook', requestBody);
      alert('Yeni kitap eklendi!');
      setNewBook({ title: '', authorId: '' });
      fetchBooks(currentPage);
    } catch (error) {
      alert('Kitap eklenirken hata oluştu.');
      console.error('Hata:', error);
    }
  };

  const handleDeleteBook = async (id) => {
    try {
      await axiosInstance.post(`/books/deleteBook/${id}`);
      alert('Kitap silindi!');
      fetchBooks(currentPage);
    } catch (error) {
      alert('Kitap silinirken hata oluştu.');
      console.error('Hata:', error);
    }
  };

  const handleUpdateBook = async (e) => {
    e.preventDefault();
    if (!editingBook.title || !editingBook.authorId) {
      alert('Kitap adı ve yazar seçimi boş olamaz.');
      return;
    }

    try {
      const requestBody = {
        title: editingBook.title,
        author: { id: Number(editingBook.authorId) }
      };

      await axiosInstance.put(`/books/updateBook/${editingBook.id}`, requestBody);
      alert('Kitap güncellendi!');
      setEditingBook(null);
      fetchBooks(currentPage);
    } catch (error) {
      alert('Kitap güncellenirken hata oluştu.');
      console.error('Hata:', error);
    }
  };

  const getAuthorNameById = (authorId) => {
    const author = authors.find((a) => a.id === authorId);
    return author ? author.name : 'Bilinmiyor';
  };

  const handlePrevPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };

  return (
    <div>
      <h3>Kitaplar</h3>

      <form onSubmit={handleAddBook} style={{ marginBottom: '20px' }}>
        <h4>Yeni Kitap Ekle</h4>
        <input
          type="text"
          placeholder="Kitap Adı"
          value={newBook.title}
          onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
          required
        />
        <select
          value={newBook.authorId}
          onChange={(e) => setNewBook({ ...newBook, authorId: e.target.value })}
          required
        >
          <option value="">Yazar Seçin</option>
          {authors.map((author) => (
            <option key={author.id} value={author.id}>
              {author.name}
            </option>
          ))}
        </select>
        <button type="submit" disabled={loading}>
          {loading ? 'Ekleniyor...' : 'Ekle'}
        </button>
      </form>

      {loading ? (
        <p>Yükleniyor...</p>
      ) : (
        <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', listStyle: 'none', padding: 0 }}>
          {books.map((book) => (
            <li
              key={book.id}
              style={{
                backgroundColor: '#fdf4e3',
                borderRadius: '10px',
                padding: '10px 15px',
                width: '500px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <span>
                {book.title} - Yazar: {getAuthorNameById(book.author?.id)}
              </span>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  style={{
                    backgroundColor: '#b30000',
                    color: 'white',
                    border: 'none',
                    padding: '5px 10px',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                  onClick={() =>
                    setEditingBook({
                      id: book.id,
                      title: book.title,
                      authorId: book.author?.id
                    })
                  }
                >
                  Düzenle
                </button>
                <button
                  style={{
                    backgroundColor: '#660000',
                    color: 'white',
                    border: 'none',
                    padding: '5px 10px',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleDeleteBook(book.id)}
                >
                  Sil
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div style={{ marginTop: '10px' }}>
        <button onClick={handlePrevPage} disabled={currentPage === 0}>← Önceki</button>
        <span style={{ margin: '0 10px' }}>Sayfa {currentPage + 1} / {totalPages}</span>
        <button onClick={handleNextPage} disabled={currentPage + 1 >= totalPages}>Sonraki →</button>
      </div>

      {editingBook && (
        <form onSubmit={handleUpdateBook} style={{ marginTop: '20px' }}>
          <h4>Kitap Bilgilerini Güncelle</h4>
          <input
            type="text"
            placeholder="Kitap Adı"
            value={editingBook.title}
            onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
            required
          />
          <select
            value={editingBook.authorId}
            onChange={(e) => setEditingBook({ ...editingBook, authorId: e.target.value })}
            required
          >
            <option value="">Yazar Seçin</option>
            {authors.map((author) => (
              <option key={author.id} value={author.id}>
                {author.name}
              </option>
            ))}
          </select>
          <button type="submit" disabled={loading}>
            {loading ? 'Güncelleniyor...' : 'Güncelle'}
          </button>
          <button type="button" onClick={() => setEditingBook(null)}>
            İptal
          </button>
        </form>
      )}
    </div>
  );
};

export default Books;
