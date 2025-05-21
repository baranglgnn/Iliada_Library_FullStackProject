import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../api/axiosInstance';

// Yöntem 1: public klasöründeki resim yolu
// Bu yol, 'public' klasörünüzün kökünden başlar.
// Yani, resminizin tam yolu 'YOUR_PROJECT_ROOT/public/images/Roma-Kolezyum.jpg' olmalıdır.
import returnHomeBgImage from '../../images/Roma-Kolezyum.jpg';
// Alternatif olarak, eğer PUBLIC_URL set edilmemişse veya farklı bir yapılandırma varsa:
// const returnHomeBgImage = '/images/Roma-Kolezyum.jpg';


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
      background-image: url(${returnHomeBgImage}); /* GÜNCELLENDİ */
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
    .fancy-return-button:disabled {
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
      gap: 25px; 
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
        gap: 15px; /* Gap between elements like h4, select, button */
    }


    .form-container h4 {
        margin-top: 0;
        color: #333;
        margin-bottom: 5px;
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

    .form-container .form-button-group {
      display: flex;
      gap: 10px; 
      margin-top: 10px; 
    }
    
    .form-container button { /* Applied to all buttons in form-container unless overridden */
      border: none;
      padding: 12px 18px; 
      border-radius: 5px;
      cursor: pointer;
      font-weight: bold;
      transition: background-color 0.3s ease, opacity 0.3s ease;
      font-size: 0.95em; 
      color: white; 
      width: 100%; /* Make buttons full width by default in their group/container */
    }
    
    .form-container .form-button-group button {
      flex-grow: 1; 
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
      background-color: #4CAF50; 
    }
    .form-container .form-add-button:hover:not(:disabled) {
        background-color: #45a049; 
    }
    
    .form-container .form-clear-button {
      background-color: #660000; 
    }
    .form-container .form-clear-button:hover:not(:disabled) {
        background-color: #4d0000; 
    }

    .form-container .form-check-button {
        background-color: #ff9800; /* Orange */
    }
    .form-container .form-check-button:hover:not(:disabled) {
        background-color: #f57c00; /* Darker Orange */
    }

    .form-container .form-show-button {
        background-color: #2196F3; /* Blue */
    }
    .form-container .form-show-button:hover:not(:disabled) {
        background-color: #1976D2; /* Darker Blue */
    }


    /* Right content section (list and pagination) */
    .slider-and-edit-section {
      flex-grow: 1; 
      display: flex;
      flex-direction: column;
      min-width: 300px; 
      box-sizing: border-box;
      z-index: 1;
      gap: 20px;
    }
    
    .slider-and-edit-section h4 {
        margin-top: 0;
        margin-bottom: 0; /* Removed bottom margin as gap is on parent */
        color: #333;
        font-size: 1.5em;
        padding: 15px;
        background-color: #fdf4e3;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        text-align: center;
    }
    
    /* Responsive adjustments */
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
        .form-container input, .form-container select { font-size: 1em; padding: 10px; }
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
        gap: 12px;
    }
    .library-books-list li {
        background-color: #fff;
        padding: 15px 20px;
        border-radius: 6px;
        box-shadow: 0 1px 4px rgba(0,0,0,0.08);
        font-size: 1.05em;
        color: #333;
    }

    .author-books-list {
        list-style: none;
        padding: 0;
        margin-top: 5px;
        max-height: 250px; 
        overflow-y: auto;
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
     .author-books-list p { /* For no books found message */
        padding: 10px;
        text-align: center;
        color: #777;
    }

    .pagination-controls {
        margin-top: 10px; /* Reduced margin */
        text-align: center; display: flex;
        justify-content: center; align-items: center;
        gap: 15px; flex-wrap: wrap; padding: 12px;
        background-color: rgba(253, 244, 227, 0.85); 
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


    .status-message {
        text-align: center; padding: 30px 20px; font-size: 1.2em;
        color: #555; width: 100%; display: flex;
        justify-content: center; align-items: center; min-height: 150px; 
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    }

    .error-message {
        color: #b30000; font-size: 0.9em; margin-bottom: 10px;
        text-align: center; width: 100%; box-sizing: border-box;
    }
    .form-container .error-message {
        text-align: left;
        margin-top: 5px;
        margin-bottom: 0;
    }
  `;

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
  const [formError, setFormError] = useState(null);


  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const ITEMS_PER_PAGE = 8;

  const fetchDropdownData = useCallback(async () => {
    try {
      const [booksRes, librariesRes, authorsRes] = await Promise.all([
        axiosInstance.get('/books/getAllBooks'),
        axiosInstance.get('/kutuphane/getAllLibraries'),
        axiosInstance.get('/authors/getAllAuthor'),
      ]);
      const booksData = booksRes.data.content || booksRes.data;
      const librariesData = librariesRes.data.content || librariesRes.data;
      const authorsData = authorsRes.data.content || authorsRes.data;
      setBooks(Array.isArray(booksData) ? booksData : []);
      setLibraries(Array.isArray(librariesData) ? librariesData : []);
      setAuthors(Array.isArray(authorsData) ? authorsData : []);
    } catch (error) {
      console.error('Dropdown verileri alınırken hata:', error);
      setFormError('Dropdown verileri yüklenemedi.');
    }
  }, []);

  const fetchAllLibraryBooks = useCallback(async (page = 0) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/Kutuphane-kitap/getAllLibraryBook?page=${page}&size=${ITEMS_PER_PAGE}`
      );
      const pageData = response.data;
      setLibraryBooks(pageData.content || []);
      setTotalPages(pageData.totalPages || 0);
      setCurrentPage(pageData.number || 0);
    } catch (error) {
      console.error('Kütüphane kitapları alınırken hata:', error);
      setLibraryBooks([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [ITEMS_PER_PAGE]);

  const checkIfBookInLibrary = async () => {
    if (!libraryId || !bookId) {
      alert('Kitap ve Kütüphane seçilmelidir.');
      return;
    }
    setIsBookInLibrary(null);
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/Kutuphane-kitap/isBookInLibrary/${libraryId}/${bookId}`
      );
      setIsBookInLibrary(response.data);
    } catch (error) {
      alert('Kitap kütüphanede olup olmadığı kontrol edilirken hata oluştu.');
      console.error('Hata:', error);
      setIsBookInLibrary(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchLibrariesAndBooksByAuthor = async () => {
    if (!authorId) {
      alert('Yazar seçilmelidir.');
      return;
    }
    setLibrariesAndBooks([]); 
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/Kutuphane-kitap/getLibrariesAndBooksByAuthor/${authorId}?page=0&size=50`
      );
      const page = response.data;
      const contentLayer = page.content || page;
      const items = Array.isArray(contentLayer)
        ? contentLayer
        : contentLayer.content || contentLayer;

      const formatted = Array.isArray(items) ? items.map(item => {
        if (Array.isArray(item) && item.length >= 2) {
          return item; 
        }
        return ['Kütüphane adı yok', 'Kitap adı yok'];
      }) : [];
      setLibrariesAndBooks(formatted);
    } catch (error) {
      alert('Yazarın kitapları alınırken hata oluştu.');
      console.error('Hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBookToLibrary = async (e) => {
    e.preventDefault();
    setFormError(null);
    if (!bookId || !libraryId) {
      setFormError('Kitap ve Kütüphane seçilmelidir.');
      return;
    }
    setLoading(true);
    try {
      await axiosInstance.post(
        `/Kutuphane-kitap/addBookToLibrary/${bookId}/${libraryId}`
      );
      alert('Kitap kütüphaneye başarıyla eklendi!');
      await fetchAllLibraryBooks(0); 
      setBookId(''); 
      setLibraryId('');
      setIsBookInLibrary(null);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Kitap eklenirken bir hata oluştu.";
      setFormError(errorMessage);
      alert('Kitap eklenirken hata oluştu: ' + errorMessage);
      console.error('Hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearAddForm = () => {
    if (window.confirm('Formu temizlemek istediğinizden emin misiniz? Girilmiş veriler silinecektir.')) {
      setBookId('');
      setLibraryId('');
      setIsBookInLibrary(null);
      setFormError(null);
    }
  };

  const handleReturnHome = () => {
    if (window.confirm('Anasayfaya dönmek istediğinizden emin misiniz? Mevcut değişiklikler kaybolabilir.')) {
      window.location.href = 'http://localhost:3000/home';
    }
  };

  const handleKeyPressReturnHome = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleReturnHome();
    }
  };

  useEffect(() => {
    fetchDropdownData();
    fetchAllLibraryBooks(0); 
  }, [fetchDropdownData, fetchAllLibraryBooks]);

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      fetchAllLibraryBooks(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      fetchAllLibraryBooks(currentPage - 1);
    }
  };

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
          // style={{ backgroundImage: `url(${returnHomeBgImage})` }} // Zaten CSS içinde tanımlı
          aria-disabled={loading}
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
                disabled={loading}
              >
                <option value="">Kitap Seç</option>
                {books.map((book) => (
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
                disabled={loading}
              >
                <option value="">Kütüphane Seç</option>
                {libraries.map((library) => (
                  <option key={library.id} value={library.id}>
                    {library.name}
                  </option>
                ))}
              </select>
              <div className="form-button-group">
                <button 
                  type="submit" 
                  className="form-add-button" 
                  disabled={loading || !bookId || !libraryId}
                >
                  {loading ? 'Kitap Ekleniyor...' : 'Kitap Ekle'}
                </button>
                 <button 
                    type="button" 
                    className="form-clear-button"
                    onClick={handleClearAddForm}
                    disabled={loading} 
                 >
                   Temizle
                 </button>
              </div>
            </form>
          </div>
          
          <div className="form-section">
            <h4>Kitap Kütüphanede Mi?</h4>
            <select value={bookId} onChange={(e) => { setBookId(e.target.value); setIsBookInLibrary(null);}} required disabled={loading}>
              <option value="">Kitap Seç</option>
              {books.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title}
                </option>
              ))}
            </select>
            <select value={libraryId} onChange={(e) => { setLibraryId(e.target.value); setIsBookInLibrary(null);}} required disabled={loading}>
              <option value="">Kütüphane Seç</option>
              {libraries.map((library) => (
                <option key={library.id} value={library.id}>
                  {library.name}
                </option>
              ))}
            </select>
            <button onClick={checkIfBookInLibrary} className="form-check-button" disabled={!bookId || !libraryId || loading}>Kontrol Et</button>
            {isBookInLibrary !== null && (
              <p style={{marginTop: '10px', fontWeight: 'bold', textAlign: 'center'}}>
                {isBookInLibrary ? 'Kitap kütüphanede mevcut.' : 'Kitap kütüphanede mevcut değil.'}
              </p>
            )}
          </div>

          <div className="form-section">
            <h4>Yazarın Kitapları ve Kütüphaneleri</h4>
            <select value={authorId} onChange={(e) => setAuthorId(e.target.value)} required disabled={loading}>
              <option value="">Yazar Seç</option>
              {authors.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.name} {author.surname}
                </option>
              ))}
            </select>
            <button onClick={fetchLibrariesAndBooksByAuthor} className="form-show-button" disabled={!authorId || loading}>Yazarın Kitaplarını Göster</button>
            {librariesAndBooks.length > 0 ? (
                <ul className="author-books-list">
                    {librariesAndBooks.map((item, i) => (
                    <li key={i}>
                        <strong>{item[1] || 'Kitap adı yok'}</strong> - <em>{item[0] || 'Kütüphane adı yok'}</em>
                    </li>
                    ))}
                </ul>
            ) : (
                authorId && !loading && <p className="author-books-list">Yazarın kitapları ve kütüphaneleri bulunamadı veya henüz arama yapılmadı.</p>
            )}
          </div>
        </div>

        <div className="slider-and-edit-section">
          <h4>Tüm Kütüphane Kitapları</h4>
          {loading && libraryBooks.length === 0 ? (
            <p className="status-message">Yükleniyor...</p>
          ) : !loading && libraryBooks.length === 0 ? ( 
            <p className="status-message">Henüz kütüphaneye eklenmiş kitap yok.</p>
          ) : (
            <>
              <ul className="library-books-list">
                {libraryBooks.map((libraryBook) => (
                  <li key={libraryBook.id}>
                    <strong>{libraryBook.book?.title || 'Kitap adı yok'}</strong> - <em>{libraryBook.library?.name || 'Kütüphane adı yok'}</em>
                  </li>
                ))}
              </ul>
              {totalPages > 1 && (
                <div className="pagination-controls">
                  <button onClick={handlePrevPage} disabled={currentPage === 0 || loading}>
                    Önceki
                  </button>
                  <span>
                    Sayfa {currentPage + 1} / {totalPages}
                  </span>
                  <button onClick={handleNextPage} disabled={currentPage >= totalPages - 1 || loading}>
                    Sonraki
                  </button>
                </div>
              )}
            </>
          )}
           {loading && libraryBooks.length > 0 && <p className="status-message" style={{fontSize: '1em', minHeight: 'auto', padding: '10px'}}>Sayfa yükleniyor...</p>}
        </div>
      </div>
    </>
  );
};

export default LibraryBooks;