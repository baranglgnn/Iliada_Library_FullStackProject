import React, { useEffect, useState, useCallback } from 'react';
import axiosInstance from '../../api/axiosInstance';
import LibraryForm from './LibraryForm';

const LibraryList = () => {
  const [libraries, setLibraries] = useState([]);
  const [page, setPage] = useState(0); // 0 tabanlı sayfa
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLibraries = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await axiosInstance.get(`/kutuphane/getAllLibraries?page=${page}&size=5`);
      console.log("Sayfalı veri:", res.data);
      setLibraries(res.data.content || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Kütüphaneler çekilemedi:", err);
      setError("Kütüphaneler yüklenemedi.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchLibraries();
  }, [fetchLibraries]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Kütüphane Listesi</h2>

      {loading ? (
        <p>Yükleniyor...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <>
          <ul>
            {libraries.map((library) => (
              <li key={library.id}>
                <strong>{library.name}</strong> - {library.address}
              </li>
            ))}
          </ul>

          {/* Sayfalama butonları */}
          <div style={{ marginTop: '20px' }}>
            <button disabled={page === 0} onClick={() => handlePageChange(page - 1)}>
              Önceki
            </button>
            <span style={{ margin: '0 10px' }}>Sayfa {page + 1} / {totalPages}</span>
            <button disabled={page + 1 >= totalPages} onClick={() => handlePageChange(page + 1)}>
              Sonraki
            </button>
          </div>
        </>
      )}

      <hr style={{ margin: '30px 0' }} />

      <LibraryForm onLibraryAdded={() => {
        setPage(0); // yeni kütüphane eklenince baştan başlat
        fetchLibraries();
      }} />
    </div>
  );
};

export default LibraryList;
