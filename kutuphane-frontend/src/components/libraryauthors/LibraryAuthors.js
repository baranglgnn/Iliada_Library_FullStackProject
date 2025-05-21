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
  
  const [allLibraryAuthorsList, setAllLibraryAuthorsList] = useState([]);

  const [loadingDropdown, setLoadingDropdown] = useState(false);
  const [loadingAuthorsByLib, setLoadingAuthorsByLib] = useState(false);
  const [loadingLibrariesByAuth, setLoadingLibrariesByAuth] = useState(false);
  const [loadingAllLibraryAuthors, setLoadingAllLibraryAuthors] = useState(false);

  const [currentPageAll, setCurrentPageAll] = useState(0);
  const [totalPagesAll, setTotalPagesAll] = useState(0);
  const ITEMS_PER_PAGE_ALL = 10;

  const fetchDropdownData = useCallback(async () => {
    setLoadingDropdown(true);
    try {
      const [authorsRes, librariesRes] = await Promise.all([
        axiosInstance.get('/authors/getAllAuthor'),
        axiosInstance.get('/kutuphane/getAllLibraries'),
      ]);
      setAuthorsForDropdown(authorsRes.data.content || authorsRes.data || []);
      setLibrariesForDropdown(librariesRes.data.content || librariesRes.data || []);
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
      const response = await axiosInstance.get(`/kutuphane-yazar/getAuthorsByLibrary/${selectedLibraryId}`);
      if (Array.isArray(response.data)) {
        const extractedAuthors = response.data
          .map(item => item.author) 
          .filter(author => author && author.id); 
        setAuthorsByLibrary(extractedAuthors);
        if (response.data.length > 0 && !response.data[0].author) {
            console.warn("[KÜTÜPHANEYE GÖRE YAZARLAR] Beklenen 'author' alanı `Library_author` objesinde bulunamadı.", response.data[0]);
        }
      } else {
        console.error('[KÜTÜPHANEYE GÖRE YAZARLAR] API yanıtı dizi değil:', response.data);
        setAuthorsByLibrary([]);
      }
    } catch (error) {
      console.error(`Kütüphane ID ${selectedLibraryId} için yazarlar alınırken hata:`, error.response || error);
      alert('Seçilen kütüphaneye ait yazarlar yüklenirken bir hata oluştu.');
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
      const response = await axiosInstance.get(`/kutuphane-yazar/getLibrariesByAuthor/${selectedAuthorId}`);
      setLibrariesByAuthor(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error(`Yazar ID ${selectedAuthorId} için kütüphaneler alınırken hata:`, error.response || error);
      alert('Seçilen yazara ait kütüphaneler yüklenirken bir hata oluştu.');
    } finally {
      setLoadingLibrariesByAuth(false);
    }
  };
  
  const handleClearLibrariesByAuthor = () => {
    setSelectedAuthorId('');
    setLibrariesByAuthor([]);
  };

  const fetchAllLibraryAuthorsFromEntries = useCallback(async (page = 0) => {
    setLoadingAllLibraryAuthors(true);
    // Sadece yeni sayfa verisi yüklenirken eski listeyi temizlemeyelim,
    // kullanıcı önceki sayfadaki veriyi görebilsin.
    // setAllLibraryAuthorsList([]); 
    try {
      const response = await axiosInstance.get(`/kutuphane-yazar/getAllLibraryBook?page=${page}&size=${ITEMS_PER_PAGE_ALL}`);
      const pageData = response.data;

      if (!pageData || typeof pageData.content === 'undefined') {
        console.error('[TÜM KÜTÜPHANE YAZARLARI] API yanıtında "content" alanı bulunamadı veya pageData tanımsız.');
        setAllLibraryAuthorsList([]); // Hata durumunda listeyi temizle
        setTotalPagesAll(0);
        setCurrentPageAll(0);
        return; 
      }

      const libraryAuthorEntries = pageData.content; 
      
      if (libraryAuthorEntries.length > 0 && !libraryAuthorEntries[0].author) {
          console.warn("[TÜM KÜTÜPHANE YAZARLARI] İlk Library_author öğesinde 'author' alanı bulunamadı.", libraryAuthorEntries[0]);
      }

      const authorsFromEntries = libraryAuthorEntries
        .map(entry => entry?.author)
        .filter(author => author && author.id && author.name); 

      const uniqueAuthorsMap = new Map();
      authorsFromEntries.forEach(author => {
        if (!uniqueAuthorsMap.has(author.id)) {
          uniqueAuthorsMap.set(author.id, author);
        }
      });
      
      const finalUniqueAuthors = Array.from(uniqueAuthorsMap.values());
      setAllLibraryAuthorsList(finalUniqueAuthors); // Sadece yeni sayfanın verisini göster
      
      setCurrentPageAll(pageData.number !== undefined ? pageData.number : 0);
      setTotalPagesAll(pageData.totalPages !== undefined ? pageData.totalPages : 0);

    } catch (error) {
      console.error('[TÜM KÜTÜPHANE YAZARLARI] Yazarlar alınırken hata:', error.response?.data || error.message || error);
      alert('Tüm kütüphane yazarları listelenirken bir hata oluştu.');
      setAllLibraryAuthorsList([]); 
      setTotalPagesAll(0); 
      setCurrentPageAll(0);
    } finally {
      setLoadingAllLibraryAuthors(false);
    }
  }, [ITEMS_PER_PAGE_ALL]);

  useEffect(() => {
    fetchDropdownData();
    fetchAllLibraryAuthorsFromEntries(0);
  }, [fetchDropdownData, fetchAllLibraryAuthorsFromEntries]);

  const handleReturnHome = () => {
    if (window.confirm('Anasayfaya dönmek istediğinizden emin misiniz?')) {
      window.location.href = 'http://localhost:3000/home'; // Ya da React Router navigate kullanın
    }
  };
   const handleKeyPressReturnHome = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleReturnHome();
    }
  };

  const isLoading = loadingDropdown || loadingAuthorsByLib || loadingLibrariesByAuth || loadingAllLibraryAuthors;

  return (
    <>
      <style>{layoutCss}</style>
      <div className="books-container">
        <div 
          className="fancy-return-button"
          onClick={handleReturnHome}
          onKeyPress={handleKeyPressReturnHome}
          role="button"
          tabIndex="0" 
          title="Anasayfaya Dön"
          aria-disabled={isLoading} // Buton olmayan elementler için aria-disabled
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
                <button onClick={handleClearAuthorsByLibrary} className="clear-button" disabled={isLoading || !selectedLibraryId}>
                    Temizle
                </button>
            </div>
          </div>

          <div className="form-section">
            <h4>Kütüphaneler (Yazara Göre)</h4>
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
                {loadingLibrariesByAuth ? 'Yükleniyor...' : 'Kütüphaneleri Göster'}
                </button>
                <button onClick={handleClearLibrariesByAuthor} className="clear-button" disabled={isLoading || !selectedAuthorId}>
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
              <p>Bu kütüphanede yazar bulunamadı veya henüz kütüphane seçilmedi.</p>
            )}
          </div>

          <div className="result-display">
            <h4>Seçilen Yazarın Bulunduğu Kütüphaneler</h4>
            {loadingLibrariesByAuth ? (
              <p className="status-message">Kütüphaneler yükleniyor...</p>
            ) : librariesByAuthor.length > 0 ? (
              <ul>
                {librariesByAuthor.map((library) => (
                  <li key={`byAuth-${library.id}`}>{library.name}</li>
                ))}
              </ul>
            ) : (
              <p>Bu yazar herhangi bir kütüphanede bulunamadı veya henüz yazar seçilmedi.</p>
            )}
          </div>
          
          <div className="result-display">
            <h4>Tüm Kütüphane-Yazar Kayıtlarındaki Yazarlar</h4>
            {loadingAllLibraryAuthors && allLibraryAuthorsList.length === 0 ? (
              <p className="status-message">Yazarlar yükleniyor...</p>
            ) : !loadingAllLibraryAuthors && allLibraryAuthorsList.length === 0 ? (
              <p>Kütüphane-Yazar kayıtlarında yazar bulunamadı.</p>
            ) : allLibraryAuthorsList.length > 0 ? (
              <>
                <ul>
                  {allLibraryAuthorsList.map((author) => (
                    <li key={`allAuth-${author.id}`}>{author.name} {author.surname || ''}</li>
                  ))}
                </ul>
                {totalPagesAll > 1 && (
                  <div className="pagination-controls">
                    <button 
                        onClick={() => fetchAllLibraryAuthorsFromEntries(currentPageAll - 1)} 
                        disabled={currentPageAll === 0 || loadingAllLibraryAuthors}>
                      Önceki
                    </button>
                    <span>Sayfa {currentPageAll + 1} / {totalPagesAll}</span>
                    <button 
                        onClick={() => fetchAllLibraryAuthorsFromEntries(currentPageAll + 1)} 
                        disabled={currentPageAll >= totalPagesAll - 1 || loadingAllLibraryAuthors}>
                      Sonraki
                    </button>
                  </div>
                )}
              </>
            ) : null }
            {loadingAllLibraryAuthors && allLibraryAuthorsList.length > 0 && <p className="status-message" style={{fontSize: '0.9em'}}>Sonraki sayfa yükleniyor...</p>}
          </div>
        </div>
      </div>
    </>
  );
};

export default LibraryAuthors;