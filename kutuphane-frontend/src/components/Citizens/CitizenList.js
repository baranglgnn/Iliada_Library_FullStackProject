import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';

const Citizens = () => {
  const [citizens, setCitizens] = useState([]);
  const [newCitizen, setNewCitizen] = useState({ tcNo: '', fullName: '' });
  const [editingCitizen, setEditingCitizen] = useState(null);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchCitizens();
  }, [page]);

  const fetchCitizens = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/citizens/getAllCitizens?page=${page}`);
      setCitizens(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Vatandaşları alırken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCitizen = async (e) => {
    e.preventDefault();
    if (!newCitizen.tcNo || !newCitizen.fullName) {
      alert('TC No ve Ad boş olamaz.');
      return;
    }

    try {
      await axiosInstance.post('/citizens/saveCitizen', newCitizen);
      alert('Yeni vatandaş eklendi!');
      setNewCitizen({ tcNo: '', fullName: '' });
      fetchCitizens();
    } catch (error) {
      alert('Vatandaş eklenirken bir hata oluştu.');
      console.error('Hata:', error);
    }
  };

  const handleDeleteCitizen = async (id) => {
    try {
      await axiosInstance.post(`/citizens/deleteCitizen/${id}`);
      alert('Vatandaş silindi!');
      fetchCitizens();
    } catch (error) {
      alert('Vatandaş silinirken bir hata oluştu.');
      console.error('Hata:', error);
    }
  };

  const handleUpdateCitizen = async (e) => {
    e.preventDefault();
    if (!editingCitizen.fullName || !editingCitizen.tcNo) {
      alert('TC No ve Ad boş olamaz.');
      return;
    }

    try {
      await axiosInstance.put(`/citizens/updateCitizen/${editingCitizen.id}`, editingCitizen);
      alert('Vatandaş başarıyla güncellendi!');
      setEditingCitizen(null);
      fetchCitizens();
    } catch (error) {
      alert('Vatandaş güncellenirken bir hata oluştu.');
      console.error('Hata:', error);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h3>Vatandaşlar</h3>

      <form onSubmit={handleAddCitizen} style={{ marginBottom: '20px' }}>
        <h4>Yeni Vatandaş Ekle</h4>
        <input
          type="text"
          placeholder="TC No"
          value={newCitizen.tcNo}
          onChange={(e) => setNewCitizen({ ...newCitizen, tcNo: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Ad"
          value={newCitizen.fullName}
          onChange={(e) => setNewCitizen({ ...newCitizen, fullName: e.target.value })}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Ekleniyor...' : 'Ekle'}
        </button>
      </form>

      {loading ? (
        <p>Yükleniyor...</p>
      ) : (
        <>
          <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', listStyle: 'none', padding: 0 }}>
            {citizens.map((citizen) => (
              <li
                key={citizen.id}
                style={{
                  backgroundColor: '#f0f0f0',
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
                  {citizen.tcNo} - {citizen.fullName}
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
                    onClick={() => setEditingCitizen(citizen)}
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
                    onClick={() => handleDeleteCitizen(citizen.id)}
                  >
                    Sil
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div style={{ marginTop: '10px' }}>
            <button disabled={page === 0} onClick={() => handlePageChange(page - 1)}>← Önceki</button>
            <span style={{ margin: '0 10px' }}>Sayfa {page + 1} / {totalPages}</span>
            <button disabled={page === totalPages - 1} onClick={() => handlePageChange(page + 1)}>Sonraki →</button>
          </div>
        </>
      )}

      {editingCitizen && (
        <form onSubmit={handleUpdateCitizen} style={{ marginTop: '30px' }}>
          <h4>Vatandaş Bilgilerini Güncelle</h4>
          <input
            type="text"
            placeholder="TC No"
            value={editingCitizen.tcNo}
            onChange={(e) => setEditingCitizen({ ...editingCitizen, tcNo: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Ad"
            value={editingCitizen.fullName}
            onChange={(e) => setEditingCitizen({ ...editingCitizen, fullName: e.target.value })}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Güncelleniyor...' : 'Güncelle'}
          </button>
          <button type="button" onClick={() => setEditingCitizen(null)}>İptal</button>
        </form>
      )}
    </div>
  );
};

export default Citizens;
