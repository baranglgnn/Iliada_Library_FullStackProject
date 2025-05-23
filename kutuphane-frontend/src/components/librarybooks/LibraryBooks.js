import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../api/axiosInstance';

// Resim yolunu projenizin public klasörüne göre ayarlayın
import returnHomeBgImage from '../../images/Roma-Kolezyum.jpg';

const layoutCss = `
    /* Ana konteyner */
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

    /* Süslü Anasayfaya Dön Butonu */
    .fancy-return-button {
      position: absolute; 
      top: 25px; 
      right: 30px; 
      width: 220px; 
      height: 70px; 
      background-image: url(${returnHomeBgImage}); /* Resim yolu CSS'e gömüldü */
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
    .fancy-return-button:disabled, 
    .fancy-return-button[aria-disabled="true"] { /* aria-disabled için stil */
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    }

    /* Sol form konteyneri stillendirmesi */
    .form-container { 
      width: 400px; 
      flex-shrink: 0; 
      display: flex;
      flex-direction: column;
      gap: 25px; /* form-section'lar arası boşluk */
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
        margin-bottom: 5px; /* h4 ve sonraki eleman arası boşluk azaltıldı */
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
      margin-bottom: 10px; /* Select ve inputlar arası boşluk eklendi */
    }
     .form-container select:last-of-type {
        margin-bottom: 0; /* Son select'in alt boşluğunu kaldır */
    }


    .form-container .form-button-group {
      display: flex;
      gap: 10px; 
      margin-top: 10px; /* Buton grubu ve üst eleman arası boşluk */
    }
    
    .form-container button { /* Form konteyneri içindeki tüm butonlar için temel stil */
      border: none;
      padding: 12px 18px; 
      border-radius: 5px;
      cursor: pointer;
      font-weight: bold;
      transition: background-color 0.3s ease, opacity 0.3s ease;
      font-size: 0.95em; 
      color: white; 
      width: 100%; /* Butonlar varsayılan olarak grup/konteyner içinde tam genişlikte */
    }
    
    .form-container .form-button-group button {
      flex-grow: 1; /* Grup içindeki butonların esnek büyümesi */
    }
    
    .form-container button:hover:not(:disabled) {
        opacity: 0.85; 
    }

    .form-container button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      background-color: #cccccc !important; 
    }

    .form-container .form-add-button {
      background-color: #4CAF50; /* Yeşil */
    }
    .form-container .form-add-button:hover:not(:disabled) {
        background-color: #45a049; /* Koyu Yeşil */
    }
    
    .form-container .form-clear-button {
      background-color: #660000; /* Koyu Kırmızı */
    }
    .form-container .form-clear-button:hover:not(:disabled) {
        background-color: #4d0000; /* Daha Koyu Kırmızı */
    }

    .form-container .form-check-button {
        background-color: #ff9800; /* Turuncu */
    }
    .form-container .form-check-button:hover:not(:disabled) {
        background-color: #f57c00; /* Koyu Turuncu */
    }

    .form-container .form-show-button {
        background-color: #2196F3; /* Mavi */
    }
    .form-container .form-show-button:hover:not(:disabled) {
        background-color: #1976D2; /* Koyu Mavi */
    }


    /* Sağ içerik bölümü (liste ve sayfalama) */
    .slider-and-edit-section {
      flex-grow: 1; 
      display: flex;
      flex-direction: column;
      min-width: 300px; 
      box-sizing: border-box;
      z-index: 1;
      gap: 20px; /* Başlık ve liste/sayfalama arası boşluk */
    }
    
    .slider-and-edit-section h4 {
        margin-top: 0;
        margin-bottom: 0; /* Alt boşluk kaldırıldı, boşluk ebeveynde */
        color: #333;
        font-size: 1.5em;
        padding: 15px;
        background-color: #fdf4e3;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        text-align: center;
    }
    
    /* Duyarlı ayarlamalar */
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
        .slider-and-edit-section { 
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
        .form-container input, .form-container select { font-size: 1em; padding: 10px; margin-bottom: 8px; }
        .form-container button { font-size: 0.9em; padding: 10px 12px;}
        .form-container .form-button-group button { font-size: 0.9em; padding: 10px 12px;}


        .slider-and-edit-section h4 { font-size: 1.3em; }
        .library-books-list li { font-size: 1em; padding: 12px; }
        .author-books-list { font-size: 0.9em; }
        .pagination-controls button { font-size: 0.9em; padding: 8px 15px; }
        .pagination-controls span { font-size: 0.9em; }
    }
    
    .library-books-list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 12px; /* Liste öğeleri arası boşluk */
    }
    .library-books-list li {
        background-color: #fff;
        padding: 15px 20px;
        border-radius: 6px;
        box-shadow: 0 1px 4px rgba(0,0,0,0.08);
        font-size: 1.05em;
        color: #333;
    }

    /* Yazarın Kitapları Listesi Stili */
    .author-books-list {
        list-style: none;
        padding: 0;
        margin-top: 5px; /* Buton ve liste arası boşluk */
        max-height: 250px; /* Kaydırma için maksimum yükseklik */
        overflow-y: auto;  /* Dikey kaydırma çubuğu */
        background-color: #fff;
        border: 1px solid #e0e0e0;
        border-radius: 5px;
    }
    .author-books-list li {
        padding: 10px 12px;
        border-bottom: 1px solid #f0f0f0;
        font-size: 0.95em;
    }
    .author-books-list li:last-child {
        border-bottom: none;
    }
     .author-books-list p { /* Kitap bulunamadı mesajı için */
        padding: 10px;
        text-align: center;
        color: #777;
    }

    /* Sayfalama Kontrolleri Stili */
    .pagination-controls {
        margin-top: 10px; /* Liste ve sayfalama arası azaltılmış boşluk */
        text-align: center; display: flex;
        justify-content: center; align-items: center;
        gap: 15px; flex-wrap: wrap; padding: 12px;
        background-color: rgba(253, 244, 227, 0.85); /* Hafif şeffaf arka plan */
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .pagination-controls button {
      background-color: #007bff; color: white; border: none;
      padding: 10px 20px; border-radius: 5px; cursor: pointer;
      font-weight: bold; transition: background-color 0.3s ease, opacity 0.3s ease;
      font-size: 1em;
    }
    .pagination-controls button:hover:not(:disabled) { background-color: #0056b3;}
    .pagination-controls button:disabled { opacity: 0.5; cursor: not-allowed;}
    .pagination-controls span { margin: 0 10px; font-weight: bold; color: #333; font-size: 1em;}

    /* Durum Mesajları Stili */
    .status-message {
        text-align: center; padding: 30px 20px; font-size: 1.2em;
        color: #555; width: 100%; display: flex;
        justify-content: center; align-items: center; min-height: 150px; 
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    }

    /* Hata Mesajı Stili */
    .error-message {
        color: #b30000; /* Koyu kırmızı hata rengi */
        font-size: 0.9em; 
        margin-bottom: 10px;
        text-align: center; /* Varsayılan olarak merkezlenmiş */
        width: 100%; 
        box-sizing: border-box;
    }
    /* Form içindeki hata mesajları için özel */
    .form-container .error-message {
        text-align: left; /* Form içinde sola yaslı */
        margin-top: 5px; /* Üst boşluk */
        margin-bottom: 0; /* Alt boşluk kaldırıldı */
    }
  `;

const LibraryBooks = () => {
  // Form alanları için state'ler
  const [bookId, setBookId] = useState('');
  const [libraryId, setLibraryId] = useState('');
  const [authorId, setAuthorId] = useState('');

  // API'den dönen veriler için state'ler
  const [isBookInLibrary, setIsBookInLibrary] = useState(null); // boolean | null
  const [librariesAndBooksByAuthor, setLibrariesAndBooksByAuthor] = useState([]); // Yazarın kitapları ve kütüphaneleri
  const [allLibraryBookEntries, setAllLibraryBookEntries] = useState([]); // Tüm kütüphane-kitap kayıtları

  // Dropdown'lar için veri state'leri
  const [booksForDropdown, setBooksForDropdown] = useState([]);
  const [librariesForDropdown, setLibrariesForDropdown] = useState([]);
  const [authorsForDropdown, setAuthorsForDropdown] = useState([]);

  // Yükleme ve hata state'leri
  const [loading, setLoading] = useState({
    dropdowns: false,
    addBook: false,
    checkBook: false,
    authorBooks: false,
    allEntries: false,
  });
  const [formError, setFormError] = useState(null);

  // Sayfalama state'leri (Tüm Kütüphane Kitapları için)
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const ITEMS_PER_PAGE = 8;

  // Dropdown verilerini çekme fonksiyonu
  const fetchDropdownData = useCallback(async () => {
    setLoading(prev => ({ ...prev, dropdowns: true }));
    try {
      const [booksRes, librariesRes, authorsRes] = await Promise.all([
        axiosInstance.get('/books/getAllBooks?page=0&size=1000'), 
        axiosInstance.get('/kutuphane/getAllLibraries?page=0&size=1000'), 
        axiosInstance.get('/authors/getAllAuthor?page=0&size=1000'), 
      ]);
      
      const extractContent = (response) => response.data?.content || response.data || [];
      
      setBooksForDropdown(extractContent(booksRes));
      setLibrariesForDropdown(extractContent(librariesRes));
      setAuthorsForDropdown(extractContent(authorsRes));

    } catch (error) {
      console.error('Dropdown verileri alınırken hata:', error);
      setFormError('Dropdown verileri yüklenemedi.');
    } finally {
      setLoading(prev => ({ ...prev, dropdowns: false }));
    }
  }, []);

  // Tüm kütüphane-kitap kayıtlarını çekme fonksiyonu (sayfalamalı)
  const fetchAllLibraryBookEntries = useCallback(async (page = 0) => {
    setLoading(prev => ({ ...prev, allEntries: true }));
    try {
      const response = await axiosInstance.get(
        `/kutuphane/getAllLibraryBook?page=${page}&size=${ITEMS_PER_PAGE}`
      );
      const pageData = response.data;
      const rawContent = pageData.content || []; 

      const formattedEntries = rawContent.map((entryArray) => {
        if (Array.isArray(entryArray) && entryArray.length >= 4) {
          const libId = entryArray[0];
          const libName = entryArray[1];
          const bkId = entryArray[2];
          const bkTitle = entryArray[3];

          return {
            book: { id: bkId, title: bkTitle },
            library: { id: libId, name: libName },
          };
        }
        console.warn("getAllLibraryBook'tan beklenmedik kayıt formatı:", entryArray);
        return {
          book: { id: null, title: 'Hatalı Veri (Kitap)' },
          library: { id: null, name: 'Hatalı Veri (Kütüphane)' },
        };
      });
      
      setAllLibraryBookEntries(formattedEntries);
      setTotalPages(pageData.totalPages || 0);
      setCurrentPage(pageData.number || 0);

    } catch (error) {
      console.error('Tüm kütüphane kitapları alınırken hata:', error);
      setAllLibraryBookEntries([]);
      setTotalPages(0);
    } finally {
      setLoading(prev => ({ ...prev, allEntries: false }));
    }
  }, [ITEMS_PER_PAGE]);

  // Bir kitabın kütüphanede olup olmadığını kontrol etme
  const checkIfBookInLibrary = async () => {
    if (!libraryId || !bookId) {
      alert('Lütfen önce Kitap ve Kütüphane seçin.');
      return;
    }
    setIsBookInLibrary(null); 
    setLoading(prev => ({ ...prev, checkBook: true }));
    try {
      const response = await axiosInstance.get(
        `/kutuphane/isBookInLibrary/${libraryId}/${bookId}`
      );
      setIsBookInLibrary(response.data); 
    } catch (error) {
      alert('Kitabın kütüphanede olup olmadığı kontrol edilirken bir hata oluştu.');
      console.error('Kontrol Hatası:', error);
      setIsBookInLibrary(false); 
    } finally {
      setLoading(prev => ({ ...prev, checkBook: false }));
    }
  };

  // Seçilen yazara ait kitapları ve bulundukları kütüphaneleri getirme
  const fetchLibrariesAndBooksByAuthor = async () => {
    if (!authorId) {
      alert('Lütfen bir yazar seçin.');
      return;
    }
    setLibrariesAndBooksByAuthor([]); 
    setLoading(prev => ({ ...prev, authorBooks: true }));
    try {
      const response = await axiosInstance.get(
        `/kutuphane/getLibrariesAndBooksByAuthor/${authorId}`
      );
      const rawData = response.data; // Beklenen yapı: [ ["Kütüphane Adı", "Kitap Adı"], ... ]
      
      // console.log('fetchLibrariesAndBooksByAuthor RAW RESPONSE:', JSON.stringify(rawData, null, 2));

      const formattedData = Array.isArray(rawData) ? rawData.map((itemArray) => {
        // itemArray = [libraryName, bookTitle]
        if (Array.isArray(itemArray) && itemArray.length >= 2) {
            const libName = itemArray[0];
            const bkTitle = itemArray[1];
            return {
                libraryName: libName || 'Kütüphane Adı Yok',
                bookTitle: bkTitle || 'Kitap Adı Yok',
                // ID'ler bu endpoint'ten gelmediği için null/undefined bırakıyoruz,
                // bu nedenle key oluştururken dikkatli olmalıyız.
                libraryId: null, 
                bookId: null,
            };
        }
        console.warn("getLibrariesAndBooksByAuthor'dan beklenmedik kayıt formatı:", itemArray);
        return {
            libraryName: 'Hatalı Veri', libraryId: null,
            bookTitle: 'Hatalı Veri', bookId: null,
        };
      }) : [];
      setLibrariesAndBooksByAuthor(formattedData);
    } catch (error) {
      alert('Yazarın kitapları ve kütüphaneleri alınırken hata oluştu.');
      console.error('Yazar Kitapları Hatası:', error);
    } finally {
      setLoading(prev => ({ ...prev, authorBooks: false }));
    }
  };

  // Kütüphaneye kitap ekleme işlemi
  const handleAddBookToLibrary = async (e) => {
    e.preventDefault();
    setFormError(null); 
    if (!bookId || !libraryId) {
      setFormError('Kitap ve Kütüphane seçimi zorunludur.');
      return;
    }
    setLoading(prev => ({ ...prev, addBook: true }));
    try {
      await axiosInstance.post(
        `/kutuphane/addBookToLibrary/${bookId}/${libraryId}`
      );
      alert('Kitap kütüphaneye başarıyla eklendi!');
      await fetchAllLibraryBookEntries(currentPage); 
      setBookId(''); 
      setLibraryId('');
      setIsBookInLibrary(null); 
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data || "Kitap eklenirken bir hata oluştu. Kitap zaten bu kütüphanede olabilir.";
      setFormError(errorMessage);
      console.error('Ekleme Hatası:', error);
    } finally {
      setLoading(prev => ({ ...prev, addBook: false }));
    }
  };

  const handleClearAddForm = () => {
    if (window.confirm('Formu temizlemek istediğinizden emin misiniz? Seçimleriniz sıfırlanacaktır.')) {
      setBookId('');
      setLibraryId('');
      setIsBookInLibrary(null);
      setFormError(null);
    }
  };
  
  const handleReturnHome = () => {
    if (isAnythingLoading) {
        if (!window.confirm('Bir işlem devam ediyor. Yine de anasayfaya dönmek istediğinizden emin misiniz?')) {
            return;
        }
    } else if (!window.confirm('Anasayfaya dönmek istediğinizden emin misiniz?')) {
        return;
    }
    window.location.href = '/home'; 
  };

  const handleKeyPressReturnHome = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleReturnHome();
    }
  };

  useEffect(() => {
    fetchDropdownData();
    fetchAllLibraryBookEntries(0); 
  }, [fetchDropdownData, fetchAllLibraryBookEntries]);

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      fetchAllLibraryBookEntries(currentPage + 1);
    }
  };
  const handlePrevPage = () => {
    if (currentPage > 0) {
      fetchAllLibraryBookEntries(currentPage - 1);
    }
  };

  const isAnythingLoading = Object.values(loading).some(status => status);

  return (
    <>
      <style>{layoutCss}</style>
      <div className="books-container">
        
        <div 
          className="fancy-return-button"
          onClick={!isAnythingLoading ? handleReturnHome : undefined}
          onKeyPress={!isAnythingLoading ? handleKeyPressReturnHome : undefined}
          role="button"
          tabIndex={isAnythingLoading ? -1 : 0}
          title="Anasayfaya Dön"
          aria-disabled={isAnythingLoading} 
        >
          <div className="button-image-overlay">
            Anasayfaya Dön
          </div>
        </div> 
        
        <div className="form-container">
          <div className="form-section">
            <form onSubmit={handleAddBookToLibrary}>
              <h4>Kitap Kütüphaneye Ekle</h4>
              {formError && <p className="error-message">{formError}</p>}
              <select 
                value={bookId} 
                onChange={(e) => {
                  setBookId(e.target.value); 
                  setIsBookInLibrary(null);
                  setFormError(null); 
                }} 
                required
                disabled={loading.dropdowns || loading.addBook}
              >
                <option value="">Kitap Seç</option>
                {booksForDropdown.map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.title}
                  </option>
                ))}
              </select>

              <select 
                value={libraryId} 
                onChange={(e) => {
                  setLibraryId(e.target.value); 
                  setIsBookInLibrary(null); 
                  setFormError(null);
                }} 
                required
                disabled={loading.dropdowns || loading.addBook}
              >
                <option value="">Kütüphane Seç</option>
                {librariesForDropdown.map((library) => (
                  <option key={library.id} value={library.id}>
                    {library.name}
                  </option>
                ))}
              </select>
              <div className="form-button-group">
                <button 
                  type="submit" 
                  className="form-add-button" 
                  disabled={loading.addBook || !bookId || !libraryId || loading.dropdowns}
                >
                  {loading.addBook ? 'Ekleniyor...' : 'Kitap Ekle'}
                </button>
                 <button 
                    type="button" 
                    className="form-clear-button"
                    onClick={handleClearAddForm}
                    disabled={loading.addBook || loading.dropdowns || (!bookId && !libraryId)} 
                 >
                   Temizle
                 </button>
              </div>
            </form>
          </div>
          
          <div className="form-section">
            <h4>Kitap Kütüphanede Mi?</h4>
            <select 
                value={bookId} 
                onChange={(e) => { setBookId(e.target.value); setIsBookInLibrary(null);}} 
                required 
                disabled={loading.dropdowns || loading.checkBook}
            >
              <option value="">Kitap Seç</option>
              {booksForDropdown.map((book) => (
                <option key={`check-book-${book.id}`} value={book.id}>
                  {book.title}
                </option>
              ))}
            </select>
            <select 
                value={libraryId} 
                onChange={(e) => { setLibraryId(e.target.value); setIsBookInLibrary(null);}} 
                required 
                disabled={loading.dropdowns || loading.checkBook}
            >
              <option value="">Kütüphane Seç</option>
              {librariesForDropdown.map((library) => (
                <option key={`check-lib-${library.id}`} value={library.id}>
                  {library.name}
                </option>
              ))}
            </select>
            <button 
                onClick={checkIfBookInLibrary} 
                className="form-check-button" 
                disabled={!bookId || !libraryId || loading.checkBook || loading.dropdowns}
            >
                {loading.checkBook ? 'Kontrol Ediliyor...' : 'Kontrol Et'}
            </button>
            {isBookInLibrary !== null && !loading.checkBook && (
              <p style={{marginTop: '10px', fontWeight: 'bold', textAlign: 'center'}}>
                {isBookInLibrary ? '✔️ Kitap bu kütüphanede mevcut.' : '❌ Kitap bu kütüphanede mevcut değil.'}
              </p>
            )}
          </div>

          <div className="form-section">
            <h4>Yazarın Kitapları ve Kütüphaneleri</h4>
            <select 
                value={authorId} 
                onChange={(e) => {setAuthorId(e.target.value); setLibrariesAndBooksByAuthor([]); }} 
                required 
                disabled={loading.dropdowns || loading.authorBooks}
            >
              <option value="">Yazar Seç</option>
              {authorsForDropdown.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.name} {author.surname || ''}
                </option>
              ))}
            </select>
            <button 
                onClick={fetchLibrariesAndBooksByAuthor} 
                className="form-show-button" 
                disabled={!authorId || loading.authorBooks || loading.dropdowns}
            >
                {loading.authorBooks ? 'Yükleniyor...' : 'Yazarın Kitaplarını Göster'}
            </button>
            {loading.authorBooks && <p className="status-message" style={{fontSize: '0.9em', minHeight: '50px', padding: '10px'}}>Yükleniyor...</p>}
            {!loading.authorBooks && librariesAndBooksByAuthor.length > 0 && (
                <ul className="author-books-list">
                    {librariesAndBooksByAuthor.map((item, i) => (
                    // ID'ler bu endpoint'ten gelmediği için, key olarak name + index kombinasyonunu kullanıyoruz
                    // Bu key'in %100 eşsiz olmama ihtimali var ama küçük listeler için genellikle yeterlidir.
                    // İdeal olan, backend'in her kayıt için eşsiz bir ID sağlamasıdır.
                    <li key={`${item.bookTitle}-${item.libraryName}-${i}`}> 
                        <strong>{item.bookTitle}</strong> - <em>{item.libraryName}</em>
                    </li>
                    ))}
                </ul>
            )}
            {!loading.authorBooks && authorId && librariesAndBooksByAuthor.length === 0 && (
                <div className="author-books-list">
                    <p>Bu yazar için kütüphane-kitap kaydı bulunamadı.</p>
                </div>
            )}
          </div>
        </div>

        <div className="slider-and-edit-section">
          <h4>Tüm Kütüphane-Kitap Kayıtları</h4>
          {loading.allEntries && allLibraryBookEntries.length === 0 ? (
            <p className="status-message">Yükleniyor...</p>
          ) : !loading.allEntries && allLibraryBookEntries.length === 0 ? ( 
            <p className="status-message">Henüz kütüphanelere eklenmiş kitap kaydı bulunmamaktadır.</p>
          ) : (
            <>
              <ul className="library-books-list">
                {allLibraryBookEntries.map((entry, index) => (
                  <li key={`${entry.book?.id}-${entry.library?.id}-${index}`}> 
                    <strong>{entry.book?.title || 'Kitap Adı Yok'}</strong> 
                    {' - '}
                    <em>{entry.library?.name || 'Kütüphane Adı Yok'}</em>
                  </li>
                ))}
              </ul>
              {totalPages > 1 && (
                <div className="pagination-controls">
                  <button 
                    onClick={handlePrevPage} 
                    disabled={currentPage === 0 || loading.allEntries}
                  >
                    Önceki
                  </button>
                  <span>
                    Sayfa {currentPage + 1} / {totalPages}
                  </span>
                  <button 
                    onClick={handleNextPage} 
                    disabled={currentPage >= totalPages - 1 || loading.allEntries}
                  >
                    Sonraki
                  </button>
                </div>
              )}
            </>
          )}
           {loading.allEntries && allLibraryBookEntries.length > 0 && (
            <p className="status-message" style={{fontSize: '1em', minHeight: 'auto', padding: '10px'}}>
                Yeni sayfa yükleniyor...
            </p>
           )}
        </div>
      </div>
    </>
  );
};

export default LibraryBooks;