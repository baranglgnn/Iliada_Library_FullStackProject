import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';

const Authors = () => {
  const [authors, setAuthors] = useState([]);
  const [newAuthor, setNewAuthor] = useState({ name: '' });
  const [editingAuthor, setEditingAuthor] = useState(null);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchAuthors(currentPage);
  }, [currentPage]);

  const fetchAuthors = async (page) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/authors/getAllAuthor?page=${page}&size=10`);
      setAuthors(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Yazarlar alınırken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAuthor = async (e) => {
    e.preventDefault();
    if (!newAuthor.name) {
      alert('Yazar adı boş olamaz.');
      return;
    }

    try {
      await axiosInstance.post('/authors/saveAuthor', newAuthor);
      alert('Yeni yazar eklendi!');
      setNewAuthor({ name: '' });
      fetchAuthors(currentPage);
    } catch (error) {
      alert('Yazar eklenirken hata oluştu.');
      console.error('Hata:', error);
    }
  };

  const handleDeleteAuthor = async (id) => {
    try {
      await axiosInstance.post(`/authors/deleteAuthor/${id}`);
      alert('Yazar silindi!');
      fetchAuthors(currentPage);
    } catch (error) {
      alert('Yazar silinirken hata oluştu.');
      console.error('Hata:', error);
    }
  };

  const handleUpdateAuthor = async (e) => {
    e.preventDefault();
    if (!editingAuthor.name) {
      alert('Yazar adı boş olamaz.');
      return;
    }

    try {
      await axiosInstance.put(`/authors/updateAuthor/${editingAuthor.id}`, editingAuthor);
      alert('Yazar güncellendi!');
      setEditingAuthor(null);
      fetchAuthors(currentPage);
    } catch (error) {
      alert('Yazar güncellenirken hata oluştu.');
      console.error('Hata:', error);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };

  return (
    <div>
      <h3>Yazarlar</h3>

      <form onSubmit={handleAddAuthor} style={{ marginBottom: '20px' }}>
        <h4>Yeni Yazar Ekle</h4>
        <input
          type="text"
          placeholder="Yazar Adı"
          value={newAuthor.name}
          onChange={(e) => setNewAuthor({ name: e.target.value })}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Ekleniyor...' : 'Ekle'}
        </button>
      </form>

      {loading ? (
        <p>Yükleniyor...</p>
      ) : (
        <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', listStyle: 'none', padding: 0 }}>
          {authors.map((author) => (
            <li
              key={author.id}
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
              <span>{author.name}</span>
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
                    setEditingAuthor({
                      id: author.id,
                      name: author.name
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
                  onClick={() => handleDeleteAuthor(author.id)}
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

      {editingAuthor && (
        <form onSubmit={handleUpdateAuthor} style={{ marginTop: '20px' }}>
          <h4>Yazar Bilgilerini Güncelle</h4>
          <input
            type="text"
            placeholder="Yazar Adı"
            value={editingAuthor.name}
            onChange={(e) => setEditingAuthor({ ...editingAuthor, name: e.target.value })}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Güncelleniyor...' : 'Güncelle'}
          </button>
          <button type="button" onClick={() => setEditingAuthor(null)}>
            İptal
          </button>
        </form>
      )}
    </div>
  );
};

export default Authors;
