import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';

const LibraryAuthors = () => {
  const [libraryId, setLibraryId] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [authorsByLibrary, setAuthorsByLibrary] = useState([]);
  const [librariesByAuthor, setLibrariesByAuthor] = useState([]);
  const [allLibraryAuthors, setAllLibraryAuthors] = useState([]);
  const [loading, setLoading] = useState(false);

  // Yazarları kütüphaneye göre al
  const fetchAuthorsByLibrary = async () => {
    if (!libraryId) {
      alert('Kütüphane ID boş olamaz.');
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.get(`/kutuphane-yazar/getAuthorsByLibrary/${libraryId}`);
      setAuthorsByLibrary(response.data);
    } catch (error) {
      console.error('Yazarlar alınırken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  // Kütüphaneleri yazara göre al
  const fetchLibrariesByAuthor = async () => {
    if (!authorId) {
      alert('Yazar ID boş olamaz.');
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.get(`/kutuphane-yazar/getLibrariesByAuthor/${authorId}`);
      setLibrariesByAuthor(response.data);
    } catch (error) {
      console.error('Kütüphaneler alınırken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  // Tüm kütüphane yazarlarını al
  const fetchAllLibraryAuthors = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/kutuphane-yazar/getAllLibraryBook');
      setAllLibraryAuthors(response.data);
    } catch (error) {
      console.error('Tüm kütüphane yazarları alınırken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  // İlk renderda tüm kütüphane yazarlarını al
  useEffect(() => {
    fetchAllLibraryAuthors();
  }, []);

  return (
    <div>
      <h3>Kütüphane Yazarları</h3>

      {/* Yazarları kütüphaneye göre listeleme */}
      <div>
        <h4>Yazarlar Kütüphaneye Göre</h4>
        <input
          type="number"
          placeholder="Kütüphane ID"
          value={libraryId}
          onChange={(e) => setLibraryId(e.target.value)}
        />
        <button onClick={fetchAuthorsByLibrary} disabled={loading}>
          {loading ? 'Yükleniyor...' : 'Yazarları Göster'}
        </button>
        {authorsByLibrary.length > 0 ? (
          <ul>
            {authorsByLibrary.map((author) => (
              <li key={author.id}>{author.name}</li>
            ))}
          </ul>
        ) : (
          <p>Yazar bulunamadı.</p>
        )}
      </div>

      {/* Kütüphaneleri yazara göre listeleme */}
      <div>
        <h4>Kütüphaneler Yazara Göre</h4>
        <input
          type="number"
          placeholder="Yazar ID"
          value={authorId}
          onChange={(e) => setAuthorId(e.target.value)}
        />
        <button onClick={fetchLibrariesByAuthor} disabled={loading}>
          {loading ? 'Yükleniyor...' : 'Kütüphaneleri Göster'}
        </button>
        {librariesByAuthor.length > 0 ? (
          <ul>
            {librariesByAuthor.map((library) => (
              <li key={library.id}>{library.name}</li>
            ))}
          </ul>
        ) : (
          <p>Kütüphane bulunamadı.</p>
        )}
      </div>

      {/* Tüm kütüphane yazarlarını listeleme */}
      <div>
        <h4>Tüm Kütüphane Yazarları</h4>
        {loading ? (
          <p>Yükleniyor...</p>
        ) : (
          <ul>
            {allLibraryAuthors.length > 0 ? (
              allLibraryAuthors.map((author) => (
                <li key={author.id}>{author.name}</li>
              ))
            ) : (
              <p>Henüz yazar bulunamadı.</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default LibraryAuthors;
