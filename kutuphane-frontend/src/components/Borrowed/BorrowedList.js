import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import returnHomeBgImage from '../../images/Roma-Kolezyum.jpg';

const BorrowedBooks = () => {
  const [citizenTc, setCitizenTc] = useState('');
  const [citizenId, setCitizenId] = useState(null);
  const [citizenDisplayInfo, setCitizenDisplayInfo] = useState('');
  const [bookId, setBookId] = useState(''); // Ödünç alma formu için
  const [libraryId, setLibraryId] = useState(''); // Ödünç alma formu için
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [isBookBorrowed, setIsBookBorrowed] = useState(null);
  const [bookForStatusCheck, setBookForStatusCheck] = useState('');
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState([]); // Tüm kitapların listesi
  const [libraries, setLibraries] = useState([]);
  const [errorTc, setErrorTc] = useState('');

  // CSS Stilleri (Değişiklik yok, aynı kalacak)
  const pageStyles = `
    .borrow-page-container {
      padding: 20px;
      font-family: Arial, sans-serif;
      position: relative; /* Fancy buton için */
      min-height: 100vh;
    }

    /* Fancy Anasayfaya Dön Butonu */
    .fancy-return-button {
      position: absolute;
      top: 25px;
      right: 30px;
      width: 220px;
      height: 70px;
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
      background-color: rgba(253, 244, 227, 0.60); 
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      color: #502D0F; 
      font-size: 1.1em; 
      font-weight: bold;
      font-family: 'Georgia', serif; 
      padding: 5px;
      box-sizing: border-box;
      border-radius: inherit; 
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2); 
    }
    /* .fancy-return-button:disabled CSS'i,
       div'ler için stil ile yönetiliyor.
    */

    .borrow-page-container > h3 {
      font-size: 1.8em;
      color: #333;
      margin-bottom: 20px;
      text-align: center;
    }

    .tc-input-platform {
      background-color: #fdf4e3; 
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      display: flex;
      flex-direction: column;
      gap: 15px;
      margin-bottom: 30px; 
      max-width: 450px; 
      margin-left: auto;
      margin-right: auto;
    }
    
    .tc-input-row {
        display: flex;
        gap: 10px;
        align-items: center;
        width: 100%;
    }

    .tc-input-platform input[type="text"] {
      flex-grow: 1; 
      padding: 12px;
      border-radius: 5px;
      border: 1px solid #ccc; 
      font-size: 1em;
      background-color: #fff; 
      color: #333;
    }
    .tc-input-platform input[type="text"]::placeholder {
      color: #777; 
    }

    .tc-input-platform .tc-button-group {
        display: flex;
        gap: 10px;
        width: 100%;
    }

    .tc-input-platform .tc-button-group button {
      flex-grow: 1;
      color: white;
      border: none;
      padding: 12px 15px; 
      border-radius: 5px;
      cursor: pointer;
      font-weight: bold;
      font-size: 1em;
      transition: background-color 0.3s ease;
      white-space: nowrap; 
    }
    
    .tc-input-platform .tc-confirm-button {
      background-color: #660000; 
    }
    .tc-input-platform .tc-confirm-button:hover:not(:disabled) {
      background-color: #4d0000; 
    }
    
    .tc-input-platform .tc-clear-button { /* TC Temizle butonu */
      background-color: #800000; /* Koyu Kırmızı */
    }
    .tc-input-platform .tc-clear-button:hover:not(:disabled) {
      background-color: #660000; 
    }

    .tc-input-platform .tc-button-group button:disabled {
      background-color: #A9A9A9 !important; 
      cursor: not-allowed;
      opacity: 0.7;
    }
    .error-tc-message-borrow {
        color: #D32F2F; 
        margin-bottom: 0px; 
        font-size: 0.9em;
        text-align: center; 
        width: 100%; 
    }

    .content-section-borrow {
      margin-bottom: 30px;
      padding: 20px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      background-color: #f9f9f9;
      max-width: 600px; 
      margin-left: auto; 
      margin-right: auto;
    }
    .content-section-borrow h4 {
      margin-top: 0;
      margin-bottom: 15px;
      color: #333;
      font-size: 1.3em;
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
      text-align: center;
    }
    .content-section-borrow label {
        display: block;
        margin-bottom: 5px;
        font-weight: 600;
        color: #555;
    }
    .content-section-borrow select, 
    .content-section-borrow .action-button,
    .content-section-borrow .form-clear-button { /* Alt formlardaki temizle butonu */
      width: 100%;
      padding: 10px;
      margin-bottom: 15px;
      border-radius: 5px;
      border: 1px solid #ccc;
      box-sizing: border-box;
      font-size: 1em;
    }
    .content-section-borrow .action-button {
      background-color: #5cb85c; 
      color: white;
      cursor: pointer;
      font-weight: bold;
      border: none;
      margin-bottom: 10px; /* Temizle butonundan önce biraz boşluk */
    }
    .content-section-borrow .action-button:hover:not(:disabled) {
      background-color: #4cae4c;
    }
    .content-section-borrow .action-button:disabled {
      background-color: #A9A9A9;
      cursor: not-allowed;
    }

    /* Alt formlar için Temizle Butonu Stili */
    .content-section-borrow .form-clear-button {
      background-color: #B22222; /* Firebrick Red - TC temizle butonundan farklı */
      color: white;
      cursor: pointer;
      font-weight: bold;
      border: none;
      margin-top: 0; /* Action butonundan sonraki boşluğu sıfırla */
    }
    .content-section-borrow .form-clear-button:hover:not(:disabled) {
      background-color: #8B0000; /* DarkRed */
    }
     .content-section-borrow .form-clear-button:disabled {
      background-color: #A9A9A9;
      cursor: not-allowed;
    }
    /* --- */

    .borrowed-books-list {
      list-style-type: none;
      padding: 0;
    }
    .borrowed-books-list li {
      padding: 10px;
      margin-bottom: 8px;
      background-color: #fff;
      border: 1px solid #eee;
      border-radius: 5px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .borrowed-books-list .return-button {
      padding: 6px 12px;
      font-size: 0.9em;
      background-color: #d9534f; 
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-left: 10px;
    }
    .borrowed-books-list .return-button:hover:not(:disabled) {
      background-color: #c9302c;
    }
    .status-text-borrow {
        margin-top: 10px;
        font-weight: bold;
        text-align: center; 
    }
    .citizen-name-display { 
        font-size: 1.1em;
        font-weight: bold;
        color: #444;
        margin-bottom: 20px;
        padding: 10px;
        background-color: #e9ecef;
        border-radius: 5px;
        text-align: center;
        max-width: 600px; 
        margin-left: auto;
        margin-right: auto;
    }
    @media (max-width: 768px) {
        .fancy-return-button { top: 15px; right: 15px; width: 180px; height: 60px; }
        .button-image-overlay { font-size: 1em; }
        .tc-input-platform { max-width: 90%; }
    }
    @media (max-width: 576px) {
        .fancy-return-button { width: 150px; height: 50px; top: 10px; right: 10px; }
        .button-image-overlay { font-size: 0.9em; }
         .tc-input-platform .tc-button-group { flex-direction: column; }
         .tc-input-platform .tc-button-group button { width: 100%; }
    }
  `;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [bookRes, libRes] = await Promise.all([
          axiosInstance.get('/books/getAllBooks'),
          axiosInstance.get('/kutuphane/getAllLibraries'),
        ]);
        setBooks(Array.isArray(bookRes.data.content) ? bookRes.data.content : (Array.isArray(bookRes.data) ? bookRes.data : []));
        setLibraries(Array.isArray(libRes.data.content) ? libRes.data.content : (Array.isArray(libRes.data) ? libRes.data : []));
      } catch (err) {
        console.error('Veriler alınamadı:', err);
        alert('Kitap ve kütüphane bilgileri yüklenirken bir sorun oluştu.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFetchCitizenId = async () => {
    if (!citizenTc.trim() || citizenTc.length !== 11 || !/^\d+$/.test(citizenTc)) {
        setErrorTc('Lütfen geçerli 11 haneli bir TC Kimlik No giriniz.');
        setCitizenId(null);
        setCitizenDisplayInfo('');
        setBorrowedBooks([]);
        return;
    }
    setErrorTc('');
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/citizens/getIdByTc/${citizenTc}`);
      if (res.data && typeof res.data === 'number') {
        const fetchedCitizenId = res.data;
        setCitizenId(fetchedCitizenId);
        // Vatandaş ID'sini aldıktan sonra vatandaşın adını da alıp göstermek daha kullanıcı dostu olabilir.
        // Şimdilik sadece ID gösteriliyor. İstenirse /citizens/{id} endpoint'inden tam vatandaş bilgisi çekilebilir.
        setCitizenDisplayInfo(`Vatandaş ID: ${fetchedCitizenId} için işlem yapılıyor.`); 
        fetchActiveBorrowedBooks(fetchedCitizenId);
      } else {
        setCitizenId(null);
        setCitizenDisplayInfo('');
        setBorrowedBooks([]);
        alert('Vatandaş ID bilgisi alınamadı veya beklenen formatta değil.');
      }
    } catch (error) {
      setCitizenId(null);
      setCitizenDisplayInfo('');
      setBorrowedBooks([]);
      if (error.response && error.response.status === 404) {
        setErrorTc('Bu TC numarasına ait vatandaş bulunamadı.');
      } else {
        setErrorTc('TC numarası kontrol edilirken bir hata oluştu.');
        console.error('TC Kontrol Hatası:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClearTcAndRelatedData = () => {
    if (window.confirm('TC giriş alanını ve ilgili tüm bilgileri temizlemek istediğinizden emin misiniz?')) {
      setCitizenTc('');
      setCitizenId(null);
      setCitizenDisplayInfo('');
      setBorrowedBooks([]);
      setErrorTc('');
      setBookId('');
      setLibraryId('');
      setBookForStatusCheck('');
      setIsBookBorrowed(null);
    }
  };

  const handleClearBorrowFormInputs = () => {
    if (window.confirm('"Kitap Ödünç Al" formundaki seçimleri temizlemek istediğinizden emin misiniz?')) {
      setBookId('');
      setLibraryId('');
    }
  };

  const handleClearStatusCheckFormInputs = () => {
    if (window.confirm('"Kitap Durumu Kontrol Et" formundaki seçimi ve sonucu temizlemek istediğinizden emin misiniz?')) {
      setBookForStatusCheck('');
      setIsBookBorrowed(null);
    }
  };

  const fetchActiveBorrowedBooks = async (id) => { 
    setLoading(true); 
    try { 
      const response = await axiosInstance.get(`/borrowed/activeBorrowedBooks/${id}`); 
      setBorrowedBooks(Array.isArray(response.data) ? response.data : []); 
    } catch (error) { 
      console.error('Ödünç alınan kitaplar alınırken hata:', error); 
      setBorrowedBooks([]); 
      alert('Ödünç alınan kitaplar yüklenirken bir sorun oluştu.');
    } finally { 
      setLoading(false); 
    } 
  };

  const handleBorrowBook = async (e) => { 
    e.preventDefault(); 
    if (!citizenId || !bookId || !libraryId) { 
      alert('Lütfen vatandaş, kitap ve kütüphane seçimi yapınız.'); 
      return; 
    } 
    setLoading(true); 
    try { 
      await axiosInstance.post(`/borrowed/borrow/${citizenId}/${bookId}/${libraryId}`); 
      alert('Kitap başarıyla ödünç alındı!'); 
      fetchActiveBorrowedBooks(citizenId); 
      setBookId(''); 
      setLibraryId(''); 
    } catch (error) { 
      alert(error.response?.data?.message || error.response?.data || 'Kitap ödünç alınırken hata oluştu.'); 
      console.error('Ödünç Alma Hatası:', error); 
    } finally { 
      setLoading(false); 
    } 
  };

  const handleReturnBook = async (bookIdToReturn) => { 
    if (!citizenId || !bookIdToReturn) { 
      alert('Vatandaş veya kitap ID bulunamadı.'); 
      return; 
    } 
    if (!window.confirm('Bu kitabı iade etmek istediğinizden emin misiniz?')) {
        return;
    }
    setLoading(true); 
    try { 
      await axiosInstance.post(`/borrowed/return/${citizenId}/${bookIdToReturn}`); 
      alert('Kitap başarıyla iade edildi!'); 
      fetchActiveBorrowedBooks(citizenId); 
    } catch (error) { 
      alert(error.response?.data?.message || error.response?.data || 'Kitap iade edilirken hata oluştu.'); 
      console.error('İade Etme Hatası:', error); 
    } finally { 
      setLoading(false); 
    } 
  };

  const checkIfBookIsBorrowed = async () => { 
    if (!citizenId || !bookForStatusCheck) { 
      alert('Lütfen TC girip durumunu kontrol etmek istediğiniz kitabı seçiniz.'); 
      return; 
    } 
    setLoading(true); 
    try { 
      const response = await axiosInstance.get(`/borrowed/isBookBorrowed/${citizenId}/${bookForStatusCheck}`); 
      setIsBookBorrowed(response.data); 
    } catch (error) { 
      setIsBookBorrowed(null); 
      alert('Kitap ödünç durumu kontrol edilirken hata oluştu.'); 
      console.error('Durum Kontrol Hatası:', error); 
    } finally { 
      setLoading(false); 
    } 
  };

  const handleReturnHome = () => { 
    if (window.confirm('Anasayfaya dönmek istediğinizden emin misiniz? Mevcut değişiklikler kaybolabilir.')) { 
      window.location.href = '/home'; // Assuming relative path works for routing
    } 
  };
  
  const handleKeyPressReturnHome = (event) => { 
    if (event.key === 'Enter' || event.key === ' ') { 
      handleReturnHome(); 
    } 
  };


  return (
    <>
      <style jsx global>{pageStyles.replace('${returnHomeBgImage}', returnHomeBgImage)}</style>
      <div className="borrow-page-container">
        <div 
          className="fancy-return-button"
          onClick={handleReturnHome}
          onKeyPress={handleKeyPressReturnHome}
          role="button"
          tabIndex="0" 
          title="Anasayfaya Dön"
          style={{ 
            backgroundImage: `url(${returnHomeBgImage})`,
            pointerEvents: loading ? 'none' : 'auto',
            opacity: loading ? 0.7 : 1 
          }}
        >
          <div className="button-image-overlay">
            Anasayfaya Dön
          </div>
        </div>

        <h3>Ödünç Kitaplar</h3>

        <div className="tc-input-platform">
          <div className="tc-input-row">
            <input
              type="text"
              placeholder="TC Kimlik No"
              value={citizenTc}
              onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  setCitizenTc(val.slice(0, 11));
                  if(errorTc) setErrorTc('');
              }}
              maxLength={11}
              disabled={loading}
            />
          </div>
          {errorTc && <p className="error-tc-message-borrow">{errorTc}</p>}
          <div className="tc-button-group">
            <button 
                onClick={handleFetchCitizenId} 
                className="tc-confirm-button"
                disabled={loading || citizenTc.length !== 11}>
                {loading && !citizenId ? 'Kontrol Ediliyor...' : "TC'yi Onayla"}
            </button>
            <button 
                onClick={handleClearTcAndRelatedData}
                className="tc-clear-button"
                disabled={loading}>
                Tümünü Temizle
            </button>
          </div>
        </div>


        {citizenId && (
          <>
            {citizenDisplayInfo && <p className="citizen-name-display">{citizenDisplayInfo}</p>}
            <div className="content-section-borrow">
              <h4>Kitap Ödünç Al</h4>
              <form onSubmit={handleBorrowBook}>
                <label htmlFor="book-select-borrow">Kitap Seç:</label>
                <select id="book-select-borrow" value={bookId} onChange={(e) => setBookId(e.target.value)} required disabled={loading}>
                  <option value="">-- Kitap Seçiniz --</option>
                  {books.map((book) => (
                    <option key={book.id} value={book.id}>
                      {book.title}
                    </option>
                  ))}
                </select>

                <label htmlFor="library-select-borrow">Kütüphane Seç:</label>
                <select id="library-select-borrow" value={libraryId} onChange={(e) => setLibraryId(e.target.value)} required disabled={loading}>
                  <option value="">-- Kütüphane Seçiniz --</option>
                  {libraries.map((lib) => (
                    <option key={lib.id} value={lib.id}>
                      {lib.name}
                    </option>
                  ))}
                </select>

                <button type="submit" className="action-button" disabled={loading || !bookId || !libraryId}>
                  {loading ? 'İşlem Yapılıyor...' : 'Ödünç Al'}
                </button>
                <button 
                    type="button" 
                    onClick={handleClearBorrowFormInputs} 
                    className="form-clear-button"
                    disabled={loading || (!bookId && !libraryId) }
                >
                    Formu Temizle
                </button>
              </form>
            </div>

            <div className="content-section-borrow">
              <h4>Kitap Ödünç Alındı mı?</h4>
              <label htmlFor="book-select-status">Kontrol Edilecek Kitap:</label>
              <select 
                id="book-select-status" 
                value={bookForStatusCheck} 
                onChange={(e) => {setBookForStatusCheck(e.target.value); setIsBookBorrowed(null);}}
                disabled={loading}
              >
                <option value="">-- Kitap Seçiniz --</option>
                {books.map((book) => (
                  <option key={`status-${book.id}`} value={book.id}>
                    {book.title}
                  </option>
                ))}
              </select>
              <button onClick={checkIfBookIsBorrowed} className="action-button" disabled={loading || !bookForStatusCheck}>
                Durumu Kontrol Et
              </button>
              <button 
                  type="button" 
                  onClick={handleClearStatusCheckFormInputs} 
                  className="form-clear-button"
                  disabled={loading || !bookForStatusCheck}
              >
                  Seçimi Temizle
              </button>
              {isBookBorrowed !== null && (
                <p className="status-text-borrow">
                  {isBookBorrowed ? 'Bu kitap seçili vatandaş tarafından ödünç alınmış.' : 'Bu kitap seçili vatandaş tarafından ödünç alınmamış veya iade edilmiş.'}
                </p>
              )}
            </div>

            <div className="content-section-borrow">
              <h4>Aktif Ödünç Alınan Kitaplar</h4>
              {loading && borrowedBooks.length === 0 && citizenId ? (
                <p>Yükleniyor...</p>
              ) : (
                <ul className="borrowed-books-list">
                  {borrowedBooks.length > 0 ? (
                    borrowedBooks.map((borrowedItem) => {
                      // Kitap ID'sini belirle (handleReturnBook'taki mantığa göre)
                      const bookIdForCurrentItem = borrowedItem.book?.id || borrowedItem.id;
                      let displayTitle = 'Kitap Adı Bilinmiyor';

                      // Önce doğrudan borrowedItem.book.title'ı kontrol et
                      if (borrowedItem.book && borrowedItem.book.title) {
                        displayTitle = borrowedItem.book.title;
                      } 
                      // Eğer yoksa ve bookIdForCurrentItem varsa, books listesinden ara
                      else if (bookIdForCurrentItem && books.length > 0) {
                        const foundBook = books.find(book => String(book.id) === String(bookIdForCurrentItem)); // ID karşılaştırmasını güvenli hale getirelim
                        if (foundBook && foundBook.title) {
                          displayTitle = foundBook.title;
                        }
                      }
                      
                      // Liste elemanı için anahtar (key)
                      // borrowedItem'ın kendine ait bir ID'si (örn: ödünç alma kaydının ID'si) varsa o en iyisidir.
                      // Orijinal kodda borrowedItem.book?.id || borrowedItem.id kullanılmış.
                      const listItemKey = borrowedItem.id || borrowedItem.book?.id || `borrowed-${bookIdForCurrentItem}-${Math.random()}`;


                      return (
                        <li key={listItemKey}>
                          {displayTitle}
                          {borrowedItem.libraryName && ` (Kütüphane: ${borrowedItem.libraryName})`}
                          <button 
                            className="return-button" 
                            onClick={() => handleReturnBook(bookIdForCurrentItem)} 
                            disabled={loading || !bookIdForCurrentItem}
                          >
                            İade Et
                          </button>
                        </li>
                      );
                    })
                  ) : (
                    citizenId && !loading && <p>Bu vatandaşın aktif ödünç aldığı kitap bulunmamaktadır.</p>
                  )}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default BorrowedBooks;