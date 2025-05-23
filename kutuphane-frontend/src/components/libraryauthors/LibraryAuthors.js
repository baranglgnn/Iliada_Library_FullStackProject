import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../api/axiosInstance';

// Resim yolunu projenizin public klasörüne göre ayarlayın
import returnHomeBgImage from '../../images/Roma-Kolezyum.jpg'; // VEYA '/images/Roma-Kolezyum.jpg'

const layoutCss = `
    /* Main container */
    .books-container {
      padding: 20px 30px 30px 30px;
      border-radius: 10px;
      display: flex; 
      gap: 40px; 
      align-items: flex-start;
      flex-wrap: wrap; 
      min-height: calc(100vh - 40px);
      position: relative; 
      box-sizing: border-box;
      width: 100%;
      max-width: 1400px; 
      margin: 0 auto; 
    }

    /* Fancy Anasayfaya Dön Butonu */
    .fancy-return-button {
      position: absolute; 
      top: 25px; 
      right: 30px; 
      width: 220px; 
      height: 70px; 
      background-image: url(${returnHomeBgImage});
      background-size: cover;
      background-position: center;
      border-radius: 10px; 
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
      cursor: pointer;
      overflow: hidden; 
      display: flex; 
      align-items: center;
      justify-content: center;
      transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
      z-index: 10; 
    }

    .fancy-return-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
    }

    .button-image-overlay {
      width: 100%;
      height: 100%;
      background-color: rgba(253, 244, 227, 0.60); /* %60 saydamlık */
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      color: #502D0F; /* Daha koyu metin rengi */
      font-size: 1.1em; 
      font-weight: bold;
      font-family: 'Georgia', serif; 
      padding: 5px;
      box-sizing: border-box;
      border-radius: inherit; 
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2); /* Hafif metin gölgesi */
    }
    .fancy-return-button[aria-disabled="true"], .fancy-return-button:disabled { /* aria-disabled için stil */
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    }

    /* Left form container styling */
    .form-container { 
      width: 400px; 
      flex-shrink: 0; 
      display: flex;
      flex-direction: column;
      gap: 25px;  /* form-section'lar arası boşluk */
      background-color: #fdf4e3;
      padding: 25px;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      box-sizing: border-box;
      z-index: 1; 
    }
    
    .form-section {
        display: flex;
        flex-direction: column;
        gap: 15px; /* h4, select, button arası boşluk */
    }


    .form-container h4 {
        margin-top: 0;
        color: #333;
        margin-bottom: 10px;
        font-size: 1.3em;
    }

    .form-container input, 
    .form-container select {
      padding: 12px;
      border-radius: 5px;
      border: 1px solid #ccc;
      width: 100%;
      box-sizing: border-box;
      font-size: 1.1em;
    }
    
    .form-container .form-button-group { /* Butonları yan yana getirmek için */
      display: flex;
      gap: 10px; 
      margin-top: 5px; 
    }

    .form-container .form-button-group button { /* Grup içindeki butonların genişliği */
        flex-grow: 1;
    }
    
    .form-container button { /* Form container içindeki tüm butonlar için temel stil */
      border: none;
      padding: 12px 15px; /* Biraz daha az padding */
      border-radius: 5px;
      cursor: pointer;
      font-weight: bold;
      transition: background-color 0.3s ease, opacity 0.3s ease;
      font-size: 0.95em; 
      color: white; 
      width: 100%; /* Varsayılan olarak tam genişlik */
    }


    .form-container button:hover:not(:disabled) {
        opacity: 0.85; 
    }

    .form-container button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      background-color: #cccccc !important; 
    }

    .form-container .fetch-button { 
      background-color: #007bff; 
    }
    .form-container .fetch-button:hover:not(:disabled) {
        background-color: #0056b3; 
    }
    .form-container .clear-button { /* Temizle butonu için özel stil */
        background-color: #dc3545; /* Kırmızı tonu */
    }
    .form-container .clear-button:hover:not(:disabled) {
        background-color: #c82333; /* Daha koyu kırmızı */
    }
    
    .results-section { 
      flex-grow: 1; 
      display: flex;
      flex-direction: column;
      min-width: 300px; 
      box-sizing: border-box;
      z-index: 1;
      gap: 30px; 
    }
    
    .result-display {
        background-color: #fdf4e3;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.08);
    }

    .result-display h4 {
        margin-top: 0;
        color: #333;
        margin-bottom: 15px;
        font-size: 1.4em;
        border-bottom: 1px solid #eee;
        padding-bottom: 10px;
    }

    .result-display ul {
        list-style-type: none;
        padding-left: 0;
        margin-top: 0;
    }
    .result-display li {
        padding: 8px 0;
        border-bottom: 1px dashed #ddd;
        font-size: 1.05em;
    }
    .result-display li:last-child {
        border-bottom: none;
    }
    .result-display p { 
        color: #777;
        font-style: italic;
    }
    
    @media (max-width: 992px) { 
        .books-container { 
            flex-direction: column; 
            align-items: center; 
            gap: 20px; 
        }
        .form-container { 
            width: 100%; 
            max-width: 500px; 
        }
        .results-section { 
            width: 100%; 
            max-width: 700px; 
            min-width: unset;
        }
        .fancy-return-button { 
            top: 15px;
            right: 15px;
            width: 180px;
            height: 60px;
        }
        .button-image-overlay {
            font-size: 1em;
        }
    }
    @media (max-width: 576px) {
        .fancy-return-button {
            width: 150px;
            height: 50px;
            top: 10px;
            right: 10px;
        }
        .button-image-overlay {
            font-size: 0.9em;
        }
        .form-container { padding: 20px; gap: 20px; }
        .form-container select { font-size: 1em; padding: 10px;}
        .form-container button { font-size: 0.9em; padding: 10px 12px;}
        .form-container .form-button-group button { font-size: 0.9em; padding: 10px 12px;}
        .results-section h4 { font-size: 1.2em; }
        .result-display li { font-size: 1em; }
    }
    
    .pagination-controls { 
        margin-top: 20px; text-align: center; display: flex;
        justify-content: center; align-items: center;
        gap: 10px; flex-wrap: wrap; padding: 10px 0;
    }
    .pagination-controls button {
      background-color: #007bff; color: white; border: none;
      padding: 8px 15px; border-radius: 5px; cursor: pointer;
      font-weight: bold; transition: background-color 0.3s ease, opacity 0.3s ease;
      font-size: 0.9em;
    }
    .pagination-controls button:hover:not(:disabled) { background-color: #0056b3;}
    .pagination-controls button:disabled { opacity: 0.5; cursor: not-allowed;}
    .pagination-controls span { margin: 0 8px; font-weight: bold; color: #333; font-size: 0.95em;}

    .status-message { 
        text-align: center; padding: 20px; font-size: 1.1em;
        color: #555; width: 100%;
    }
  `;

const LibraryAuthors = () => {
  const [selectedLibraryId, setSelectedLibraryId] = useState('');
  const [selectedAuthorId, setSelectedAuthorId] = useState('');

  const [authorsForDropdown, setAuthorsForDropdown] = useState([]);
  const [librariesForDropdown, setLibrariesForDropdown] = useState([]);

  const [authorsByLibrary, setAuthorsByLibrary] = useState([]);
  const [librariesByAuthor, setLibrariesByAuthor] = useState([]);
  
  const [allAuthorsListPaginated, setAllAuthorsListPaginated] = useState([]); // State adı güncellendi

  const [loadingDropdown, setLoadingDropdown] = useState(false);
  const [loadingAuthorsByLib, setLoadingAuthorsByLib] = useState(false);
  const [loadingLibrariesByAuth, setLoadingLibrariesByAuth] = useState(false);
  const [loadingAllAuthorsPaginated, setLoadingAllAuthorsPaginated] = useState(false); // State adı güncellendi

  const [currentPageAllAuthors, setCurrentPageAllAuthors] = useState(0); // State adı güncellendi
  const [totalPagesAllAuthors, setTotalPagesAllAuthors] = useState(0);   // State adı güncellendi
  const ITEMS_PER_PAGE_ALL_AUTHORS = 10; // Sabit adı güncellendi

  const fetchDropdownData = useCallback(async () => {
    setLoadingDropdown(true);
    try {
      const [authorsRes, librariesRes] = await Promise.all([
        axiosInstance.get('/authors/getAllAuthor?page=0&size=1000'), // Dropdown için tüm yazarlar
        axiosInstance.get('/kutuphane/getAllLibraries?page=0&size=1000'), // Dropdown için tüm kütüphaneler
      ]);
      setAuthorsForDropdown(authorsRes.data?.content || authorsRes.data || []);
      setLibrariesForDropdown(librariesRes.data?.content || librariesRes.data || []);
    } catch (error) {
      console.error('Dropdown verileri alınırken hata:', error);
      alert('Yazar veya kütüphane listesi yüklenemedi.');
    } finally {
      setLoadingDropdown(false);
    }
  }, []);

  const fetchAuthorsByLibrary = async () => {
    if (!selectedLibraryId) {
      alert('Lütfen bir kütüphane seçin.');
      return;
    }
    setLoadingAuthorsByLib(true);
    setAuthorsByLibrary([]);
    try {
      const response = await axiosInstance.get(`/kutuphane/getAuthorsByLibrary/${selectedLibraryId}`);
      if (Array.isArray(response.data)) {
        setAuthorsByLibrary(response.data);
      } else {
        console.error('[KÜTÜPHANEYE GÖRE YAZARLAR] API yanıtı dizi değil:', response.data);
        setAuthorsByLibrary([]);
      }
    } catch (error) {
      console.error(`Kütüphane ID ${selectedLibraryId} için yazarlar alınırken hata:`, error.response || error);
      alert('Seçilen kütüphaneye ait yazarlar yüklenirken bir hata oluştu.');
      setAuthorsByLibrary([]);
    } finally {
      setLoadingAuthorsByLib(false);
    }
  };

  const handleClearAuthorsByLibrary = () => {
    setSelectedLibraryId('');
    setAuthorsByLibrary([]);
  };

  const fetchLibrariesByAuthor = async () => {
    if (!selectedAuthorId) {
      alert('Lütfen bir yazar seçin.');
      return;
    }
    setLoadingLibrariesByAuth(true);
    setLibrariesByAuthor([]);
    try {
      const response = await axiosInstance.get(`/kutuphane/getLibrariesAndBooksByAuthor/${selectedAuthorId}`);
      if (Array.isArray(response.data)) {
        const formattedData = response.data.map(itemArray => {
          if (Array.isArray(itemArray) && itemArray.length >= 2) {
            return {
              libraryName: itemArray[0] || 'Kütüphane Adı Yok',
              bookTitle: itemArray[1] || 'Kitap Adı Yok',
            };
          }
          console.warn('[YAZARA GÖRE KÜTÜPHANELER/KİTAPLAR] API yanıtında beklenmedik öğe yapısı:', itemArray);
          return { libraryName: 'Hatalı Veri', bookTitle: 'Hatalı Veri' };
        });
        setLibrariesByAuthor(formattedData);
      } else {
        console.error('[YAZARA GÖRE KÜTÜPHANELER/KİTAPLAR] API yanıtı dizi değil:', response.data);
        setLibrariesByAuthor([]);
      }
    } catch (error) {
      console.error(`Yazar ID ${selectedAuthorId} için kütüphaneler/kitaplar alınırken hata:`, error.response || error);
      alert('Seçilen yazara ait kütüphaneler ve kitaplar yüklenirken bir hata oluştu.');
      setLibrariesByAuthor([]);
    } finally {
      setLoadingLibrariesByAuth(false);
    }
  };
  
  const handleClearLibrariesByAuthor = () => {
    setSelectedAuthorId('');
    setLibrariesByAuthor([]);
  };

  // "Sistemdeki Tüm Yazarlar (Sayfalı)" için fonksiyon
  // /authors/getAllAuthor endpoint'ini kullandığını varsayıyoruz.
  const fetchAllAuthorsPaginated = useCallback(async (page = 0) => {
    setLoadingAllAuthorsPaginated(true);
    try {
      // Bu endpoint'in sayfalama desteklediğini varsayıyoruz.
      // Eğer desteklemiyorsa ve tüm yazarları tek seferde döndürüyorsa,
      // frontend'de manuel sayfalama yapılabilir veya backend'e sayfalama eklenebilir.
      const response = await axiosInstance.get(`/authors/getAllAuthor?page=${page}&size=${ITEMS_PER_PAGE_ALL_AUTHORS}`);
      const pageData = response.data;

      if (!pageData || typeof pageData.content === 'undefined') {
        console.error('[TÜM YAZARLAR SAYFALI] API yanıtında "content" alanı bulunamadı veya pageData tanımsız.');
        setAllAuthorsListPaginated([]);
        setTotalPagesAllAuthors(0);
        setCurrentPageAllAuthors(0);
        return; 
      }
      
      // Gelen yanıtın yazar nesneleri dizisi olduğunu varsayıyoruz:
      // { content: [ {id, name, surname, status}, ... ], totalPages, number, ... }
      setAllAuthorsListPaginated(pageData.content || []);
      setCurrentPageAllAuthors(pageData.number !== undefined ? pageData.number : 0);
      setTotalPagesAllAuthors(pageData.totalPages !== undefined ? pageData.totalPages : 0);

    } catch (error) {
      console.error('[TÜM YAZARLAR SAYFALI] Yazarlar alınırken hata:', error.response?.data || error.message || error);
      alert('Tüm yazarlar listelenirken bir hata oluştu.');
      setAllAuthorsListPaginated([]); 
      setTotalPagesAllAuthors(0); 
      setCurrentPageAllAuthors(0);
    } finally {
      setLoadingAllAuthorsPaginated(false);
    }
  }, [ITEMS_PER_PAGE_ALL_AUTHORS]);

  useEffect(() => {
    fetchDropdownData();
    fetchAllAuthorsPaginated(0); // Sistemdeki tüm yazarları ilk yüklemede çek
  }, [fetchDropdownData, fetchAllAuthorsPaginated]);

  const handleReturnHome = () => {
    if (window.confirm('Anasayfaya dönmek istediğinizden emin misiniz?')) {
      window.location.href = 'http://localhost:3000/home'; 
    }
  };
   const handleKeyPressReturnHome = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleReturnHome();
    }
  };

  const isLoading = loadingDropdown || loadingAuthorsByLib || loadingLibrariesByAuth || loadingAllAuthorsPaginated;

  return (
    <>
      <style>{layoutCss}</style>
      <div className="books-container">
        <div 
          className="fancy-return-button"
          onClick={!isLoading ? handleReturnHome : undefined}
          onKeyPress={!isLoading ? handleKeyPressReturnHome : undefined}
          role="button"
          tabIndex={isLoading ? -1 : 0}
          title="Anasayfaya Dön"
          aria-disabled={isLoading}
        >
          <div className="button-image-overlay">
            Anasayfaya Dön
          </div>
        </div>

        <div className="form-container">
          <div className="form-section">
            <h4>Yazarlar (Kütüphaneye Göre)</h4>
            <select
              value={selectedLibraryId}
              onChange={(e) => setSelectedLibraryId(e.target.value)}
              disabled={isLoading || librariesForDropdown.length === 0}
            >
              <option value="">Kütüphane Seçin</option>
              {librariesForDropdown.map((library) => (
                <option key={library.id} value={library.id}>
                  {library.name}
                </option>
              ))}
            </select>
            <div className="form-button-group">
                <button onClick={fetchAuthorsByLibrary} className="fetch-button" disabled={isLoading || !selectedLibraryId}>
                {loadingAuthorsByLib ? 'Yükleniyor...' : 'Yazarları Göster'}
                </button>
                <button onClick={handleClearAuthorsByLibrary} className="clear-button" disabled={isLoading || (!selectedLibraryId && authorsByLibrary.length === 0)}>
                    Temizle
                </button>
            </div>
          </div>

          <div className="form-section">
            <h4>Kütüphaneler ve Kitapları (Yazara Göre)</h4>
            <select
              value={selectedAuthorId}
              onChange={(e) => setSelectedAuthorId(e.target.value)}
              disabled={isLoading || authorsForDropdown.length === 0}
            >
              <option value="">Yazar Seçin</option>
              {authorsForDropdown.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.name} {author.surname || ''}
                </option>
              ))}
            </select>
            <div className="form-button-group">
                <button onClick={fetchLibrariesByAuthor} className="fetch-button" disabled={isLoading || !selectedAuthorId}>
                {loadingLibrariesByAuth ? 'Yükleniyor...' : 'Göster'}
                </button>
                <button onClick={handleClearLibrariesByAuthor} className="clear-button" disabled={isLoading || (!selectedAuthorId && librariesByAuthor.length === 0)}>
                    Temizle
                </button>
            </div>
          </div>
        </div>

        <div className="results-section">
          <div className="result-display">
            <h4>Seçilen Kütüphanedeki Yazarlar</h4>
            {loadingAuthorsByLib ? (
              <p className="status-message">Yazarlar yükleniyor...</p>
            ) : authorsByLibrary.length > 0 ? (
              <ul>
                {authorsByLibrary.map((author) => (
                  <li key={`byLib-${author.id}`}>{author.name} {author.surname || ''}</li>
                ))}
              </ul>
            ) : (
              <p>{selectedLibraryId ? 'Bu kütüphanede yazar bulunamadı.' : 'Lütfen bir kütüphane seçin.'}</p>
            )}
          </div>

          <div className="result-display">
            <h4>Seçilen Yazarın Kitapları ve Bulunduğu Kütüphaneler</h4>
            {loadingLibrariesByAuth ? (
              <p className="status-message">Yükleniyor...</p>
            ) : librariesByAuthor.length > 0 ? (
              <ul>
                {librariesByAuthor.map((item, index) => (
                  <li key={`${item.libraryName}-${item.bookTitle}-${index}`}>
                    <strong>{item.bookTitle}</strong> - <em>{item.libraryName}</em>
                  </li>
                ))}
              </ul>
            ) : (
              <p>{selectedAuthorId ? 'Bu yazar için kayıt bulunamadı.' : 'Lütfen bir yazar seçin.'}</p>
            )}
          </div>
          
          <div className="result-display">
            <h4>Sistemdeki Tüm Yazarlar (Sayfalı)</h4>
            {loadingAllAuthorsPaginated && allAuthorsListPaginated.length === 0 ? (
              <p className="status-message">Yazarlar yükleniyor...</p>
            ) : !loadingAllAuthorsPaginated && allAuthorsListPaginated.length === 0 && currentPageAllAuthors === 0 ? (
              <p>Sistemde yazar bulunamadı.</p>
            ) : allAuthorsListPaginated.length > 0 ? (
              <>
                <ul>
                  {allAuthorsListPaginated.map((author) => (
                    <li key={`allAuth-${author.id}`}>{author.name} {author.surname || ''}</li>
                  ))}
                </ul>
                {totalPagesAllAuthors > 1 && (
                  <div className="pagination-controls">
                    <button 
                        onClick={() => fetchAllAuthorsPaginated(currentPageAllAuthors - 1)} 
                        disabled={currentPageAllAuthors === 0 || loadingAllAuthorsPaginated}>
                      Önceki
                    </button>
                    <span>Sayfa {currentPageAllAuthors + 1} / {totalPagesAllAuthors}</span>
                    <button 
                        onClick={() => fetchAllAuthorsPaginated(currentPageAllAuthors + 1)} 
                        disabled={currentPageAllAuthors >= totalPagesAllAuthors - 1 || loadingAllAuthorsPaginated}>
                      Sonraki
                    </button>
                  </div>
                )}
              </>
            ) : null }
            {loadingAllAuthorsPaginated && allAuthorsListPaginated.length > 0 && <p className="status-message" style={{fontSize: '0.9em'}}>Sonraki sayfa yükleniyor...</p>}
          </div>
        </div>
      </div>
    </>
  );
};

export default LibraryAuthors;