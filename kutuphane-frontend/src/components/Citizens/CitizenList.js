// Citizens.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import axiosInstance from '../../api/axiosInstance';
import localSpqrEmblem from '../../images/emperor-trajan-gettyimages-170916286.avif';
import returnHomeBgImage from '../../images/Roma-Kolezyum.jpg';

// CSS styles (Bir önceki cevaptaki doğru pagination stillerini içeren CSS'i buraya yapıştırın)
const layoutCss = `
    /* Main container */
    .citizens-page-container {
      padding: 20px;
      font-family: Arial, sans-serif;
      color: #333;
      min-height: 100vh;
      position: relative;
    }

    .citizens-page-container > h3 {
      text-align: center;
      margin-bottom: 30px;
      color: #2c3e50;
      font-size: 1.8em;
    }
    
    /* Fancy Anasayfaya Dön Butonu */
    .fancy-return-button {
      position: absolute; top: 25px; right: 30px; width: 220px; height: 70px;
      background-image: url(${returnHomeBgImage});
      background-size: cover; background-position: center; border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.3); cursor: pointer; overflow: hidden;
      display: flex; align-items: center; justify-content: center;
      transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out; z-index: 20;
    }
    .fancy-return-button:hover { transform: translateY(-2px); box-shadow: 0 6px 12px rgba(0,0,0,0.4); }
    .button-image-overlay {
      width: 100%; height: 100%; background-color: rgba(253,244,227,0.60);
      display: flex; align-items: center; justify-content: center; text-align: center;
      color: #502D0F; font-size: 1.1em; font-weight: bold; font-family: 'Georgia', serif;
      padding: 5px; box-sizing: border-box; border-radius: inherit; text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
    }
    .fancy-return-button[aria-disabled="true"] {
      opacity: 0.7; cursor: not-allowed; transform: none; box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    }

    .citizen-form-and-search-platform {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center; 
      gap: 20px;
      background-color: #f0f2f5; 
      padding: 20px 25px;
      border-radius: 10px;
      box-shadow: 0 3px 8px rgba(0,0,0,0.1);
      width: auto; 
      max-width: 900px; 
      margin: 0 auto 30px auto; 
      box-sizing: border-box;
    }

    .form-container-citizens {
      width: 400px; 
      flex-shrink: 0; display: flex; flex-direction: column; gap: 15px;
      background-color: #fdf4e3; padding: 25px; border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1); box-sizing: border-box; z-index: 1;
    }
    .form-container-citizens h4 { margin-top: 0; color: #333; margin-bottom: 10px; font-size: 1.3em; }
    .form-container-citizens input {
      padding: 12px; border-radius: 5px; border: 1px solid #ccc;
      width: 100%; box-sizing: border-box; font-size: 1.1em;
    }
    .form-container-citizens .form-button-group { display: flex; gap: 10px; margin-top: 5px; }
    .form-container-citizens .form-button-group button {
      border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;
      font-weight: bold; transition: background-color 0.3s ease, opacity 0.3s ease;
      font-size: 0.95em; flex-grow: 1; color: white;
    }
    .form-container-citizens .form-button-group button:hover:not(:disabled) { opacity: 0.85; }
    .form-container-citizens .form-button-group button:disabled {
      opacity: 0.6; cursor: not-allowed; background-color: #cccccc !important;
    }
    .form-container-citizens .form-add-button { background-color: #4CAF50; }
    .form-container-citizens .form-add-button:hover:not(:disabled) { background-color: #45a049; }
    .form-container-citizens .form-clear-button { background-color: #660000; }
    .form-container-citizens .form-clear-button:hover:not(:disabled) { background-color: #4d0000; }

    .citizen-search-wrapper {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      min-width: 300px; max-width: 380px; position: relative; z-index: 15; 
      width: 100%; 
    }
    .citizen-search-wrapper input[type="text"] { 
      width: 100%; padding: 10px 14px; border-radius: 6px; border: 1px solid #ccc;
      font-size: 1em; box-shadow: 0 1px 2px rgba(0,0,0,0.05);
      transition: border-color 0.2s ease, box-shadow 0.2s ease; margin-bottom: 0;
    }
    .citizen-search-wrapper input[type="text"]:focus {
      outline: none; border-color: #802C00; box-shadow: 0 0 0 0.1rem rgba(80,45,15,0.15);
    }
    .citizen-search-results-dropdown {
      position: absolute; top: 100%; left: 0; right: 0; background-color: #fff;
      border: 1px solid #ddd; border-top: none; border-radius: 0 0 6px 6px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1); max-height: 200px; overflow-y: auto;
      z-index: 14; list-style: none; padding: 0; margin: 0;
    }
    .citizen-search-results-dropdown li {
      padding: 8px 12px; cursor: pointer; border-bottom: 1px solid #f0f0f0;
      font-size: 0.95em; color: #333; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .citizen-search-results-dropdown li:last-child { border-bottom: none; }
    .citizen-search-results-dropdown li:hover { background-color: #f7f7f7; }
    .citizen-search-results-dropdown .dropdown-message-citizens { 
      padding: 10px 12px; text-align: center; color: #777; font-style: italic; font-size: 0.9em;
    }

    .citizen-list-section { display: flex; flex-direction: column; align-items: center; z-index: 1; }
    .citizen-cards-wrapper {
      display: flex; flex-wrap: wrap; justify-content: center; list-style: none;
      padding: 0; margin: 0 0 30px 0; gap: 20px;
    }
    .citizen-card-item {
      background-color: #fdf4e3; border-radius: 10px; padding: 15px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1); display: flex !important; flex-direction: column;
      align-items: center; text-align: center; cursor: default; transition: transform 0.3s ease;
      justify-content: space-between; height: 100%; box-sizing: border-box;
      width: 240px; min-height: 340px;
    }
    .citizen-card-item:hover { transform: translateY(-5px); }
    .citizen-card-item img {
      width: 100%; max-width: 150px; height: 100px; object-fit: contain;
      margin-bottom: 15px; border: 1px solid #ddd; background-color: #fff;
    }
    .citizen-info-details {
      background-color: rgba(253,244,227,0.85); padding: 8px 10px; border-radius: 5px;
      margin-bottom: 10px; width: 100%; box-sizing: border-box;
    }
    .citizen-info-details div { margin-bottom: 5px; color: #333; word-break: break-word; }
    .citizen-info-details div:last-child { margin-bottom: 0; }
    .citizen-info-details div:first-child { font-weight: bold; font-size: 1.1em; }
    .citizen-info-details div:nth-child(2) { font-size: 0.9em; }
    .citizen-card-item .button-container-citizen {
      display: flex; gap: 10px; margin-top: auto; flex-wrap: wrap;
      justify-content: center; width: 100%;
    }
    .citizen-card-item .card-button-citizen {
      color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer;
      transition: background-color 0.3s ease, opacity 0.3s ease; font-size: 0.9em;
      flex-grow: 1; min-width: 80px;
    }
    .citizen-card-item .card-button-citizen:hover:not(:disabled) { opacity: 0.9; }
    .citizen-card-item .card-button-citizen:disabled {
      opacity: 0.6; cursor: not-allowed; background-color: #cccccc !important;
    }
    .citizen-card-item .edit-button-citizen { background-color: #b30000; }
    .citizen-card-item .edit-button-citizen:hover:not(:disabled) { background-color: #990000; }
    .citizen-card-item .delete-button-citizen { background-color: #660000; }
    .citizen-card-item .delete-button-citizen:hover:not(:disabled) { background-color: #4d0000; }

    .pagination-controls-citizens { 
      margin-top: 30px; 
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px; 
      flex-wrap: wrap;
      padding: 8px 10px; 
      background-color: rgba(230, 230, 230, 0.8); 
      border-radius: 50px; 
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); 
    }
    .pagination-controls-citizens button {
      color: white;
      border: none;
      padding: 9px 18px; 
      border-radius: 30px; 
      cursor: pointer;
      font-weight: bold;
      font-size: 0.95em; 
      transition: background-color 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease;
      box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    }
    .pagination-controls-citizens button:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    }
    .pagination-controls-citizens button:disabled {
      opacity: 0.65; 
      cursor: not-allowed;
      box-shadow: none; 
      transform: none; 
    }
    .pagination-controls-citizens button:first-of-type { 
      background-color: #5A6268; 
    }
    .pagination-controls-citizens button:first-of-type:hover:not(:disabled) {
      background-color: #495057; 
    }
    .pagination-controls-citizens button:first-of-type:disabled {
      background-color: #adb5bd; 
      color: #e9ecef;
    }
    .pagination-controls-citizens button:last-of-type { 
      background-color: #007bff; 
    }
    .pagination-controls-citizens button:last-of-type:hover:not(:disabled) {
      background-color: #0069d9; 
    }
     .pagination-controls-citizens button:last-of-type:disabled {
      background-color: #70a7ff; 
      color: #e0f1ff;
    }
    .pagination-controls-citizens span { 
      margin: 0 8px; 
      font-weight: 500; 
      color: #212529; 
      font-size: 0.95em; 
      padding: 8px 14px; 
      background-color: #ffffff; 
      border-radius: 20px; 
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    }

    .status-message-citizens {
      text-align: center; padding: 20px; font-size: 1.2em; color: #555;
      width: 100%; display: flex; justify-content: center; align-items: center; min-height: 200px;
    }
    .edit-form-container-citizens {
      margin-top: 30px; padding: 25px; background-color: #fdf4e3;
      border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      display: flex; flex-direction: column; gap: 15px; width: 100%; max-width: 600px;
      margin-left: auto; margin-right: auto; box-sizing: border-box;
    }
    .edit-form-container-citizens h4 { margin-top: 0; color: #333; font-size: 1.3em; }
    .edit-form-container-citizens input {
      padding: 12px; border-radius: 5px; border: 1px solid #ccc;
      width: 100%; box-sizing: border-box; font-size: 1.1em;
    }
    .edit-form-container-citizens .button-group-edit {
      display: flex; gap: 10px; flex-wrap: wrap; justify-content: flex-end;
    }
    .edit-form-container-citizens .button-group-edit button {
      padding: 10px 15px; border-radius: 5px; cursor: pointer; font-weight: bold;
      border: none; transition: background-color 0.3s ease, opacity 0.3s ease;
      font-size: 1em; color: white;
    }
    .edit-form-container-citizens .button-group-edit button:hover:not(:disabled) { opacity: 0.9; }
    .edit-form-container-citizens .button-group-edit button:disabled {
      opacity: 0.6; cursor: not-allowed; background-color: #cccccc !important;
    }
    .edit-form-container-citizens .form-update-button { background-color: #2980b9; }
    .edit-form-container-citizens .form-update-button:hover:not(:disabled) { background-color: #1f618d; }
    .edit-form-container-citizens .form-cancel-button { background-color: #7f8c8d; }
    .edit-form-container-citizens .form-cancel-button:hover:not(:disabled) { background-color: #626567; }

    .error-message {
      color: #b30000; font-size: 0.9em; margin-bottom: 10px;
      text-align: center; width: 100%; box-sizing: border-box;
    }
    .form-container-citizens .error-message, 
    .edit-form-container-citizens .error-message { text-align: left; }

    @media (max-width: 992px) {
        .citizen-form-and-search-platform { flex-direction: column; max-width: 500px; }
        .form-container-citizens { width: 100%; max-width: 100%; }
        .citizen-search-wrapper { width: 100%; max-width: 100%; margin-top: 20px; }
        .edit-form-container-citizens { width: 100%; max-width: 500px; }
        .fancy-return-button { top: 15px; right: 15px; width: 180px; height: 60px; }
        .button-image-overlay { font-size: 1em; }
    }
    @media (max-width: 576px) {
        .fancy-return-button { width: 150px; height: 50px; top: 10px; right: 10px; }
        .button-image-overlay { font-size: 0.9em; }
        .form-container-citizens input, .edit-form-container-citizens input { font-size: 0.9em; }
        .form-container-citizens .form-button-group button, 
        .edit-form-container-citizens .button-group-edit button { font-size: 0.85em; padding: 8px 10px;}
        .citizen-card-item { width: calc(100% - 10px); margin: 0 5px 20px 5px; }
        .citizen-search-wrapper input[type="text"] { font-size: 0.9em; }
        .pagination-controls-citizens { gap: 5px; padding: 6px 8px; } 
        .pagination-controls-citizens button { padding: 8px 15px; font-size: 0.9em; }
        .pagination-controls-citizens span { padding: 7px 12px; font-size: 0.9em; }
    }
  `;

const Citizens = () => {
  const [citizens, setCitizens] = useState([]);
  const [newCitizen, setNewCitizen] = useState({ tcNo: '', fullName: '' });
  const [editingCitizen, setEditingCitizen] = useState(null);
  
  // Tek bir `loading` state'i genel yükleme ve API çağrıları için
  const [loading, setLoading] = useState(false); 
  // Form submit butonlarının kendi içlerinde "Ekleniyor/Güncelleniyor" göstermesi için ayrı state'ler
  const [isAdding, setIsAdding] = useState(false); 
  const [isUpdating, setIsUpdating] = useState(false);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 4;
  const isInitialRender = useRef(true);

  const [citizenSearchKeyword, setCitizenSearchKeyword] = useState('');
  const [debouncedCitizenKeyword, setDebouncedCitizenKeyword] = useState('');
  const [citizenDropdownResults, setCitizenDropdownResults] = useState([]);
  const [isCitizenDropdownOpen, setIsCitizenDropdownOpen] = useState(false);
  const [citizenSearchApiLoading, setCitizenSearchApiLoading] = useState(false); // Sadece arama API'si için
  const [citizenSearchApiError, setCitizenSearchApiError] = useState(null);
  
  const citizenSearchWrapperRef = useRef(null);

  // Ana veri çekme useEffect'i
  useEffect(() => {
    let pageToLoad = page;
    if (isInitialRender.current) {
      isInitialRender.current = false;
      pageToLoad = 0;
      if (page !== 0) {
        setPage(0); // Bu, useEffect'in tekrar çalışmasını tetikler
        return;
      }
    } else {
      if (totalPages > 0 && pageToLoad >= totalPages) {
        pageToLoad = Math.max(0, totalPages - 1);
      }
      pageToLoad = Math.max(0, pageToLoad);
      if (pageToLoad !== page) {
        setPage(pageToLoad); // Bu, useEffect'in tekrar çalışmasını tetikler
        return;
      }
    }
    
    const loadCitizens = async () => {
      setLoading(true); // Genel yükleme başladı
      try {
        const response = await axiosInstance.get(`/citizens/getAllCitizens?page=${pageToLoad}&size=${pageSize}`);
        setCitizens(Array.isArray(response.data.content) ? response.data.content : []);
        setTotalPages(prevTotalPages => 
            response.data.totalPages !== undefined && prevTotalPages !== response.data.totalPages 
            ? response.data.totalPages 
            : prevTotalPages
        );
      } catch (error) {
        console.error('Vatandaşları alırken hata:', error);
        setCitizens([]);
        setTotalPages(0);
      } finally {
        setLoading(false); // Genel yükleme bitti
      }
    };
    loadCitizens();
  }, [page, pageSize, totalPages]); // totalPages bağımlılığı eklendi

  // Arama için useEffect'ler
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedCitizenKeyword(citizenSearchKeyword);
    }, 400);
    return () => clearTimeout(handler);
  }, [citizenSearchKeyword]);

  const fetchCitizenNameDropdownResults = useCallback(async (keyword) => {
    const trimmedKeyword = keyword.trim();
    if (!trimmedKeyword) {
      setCitizenDropdownResults([]);
      setIsCitizenDropdownOpen(false);
      setCitizenSearchApiError(null);
      return;
    }
    setCitizenSearchApiLoading(true); // Arama API'si yükleniyor
    setCitizenSearchApiError(null);
    try {
      const response = await axiosInstance.get('/citizens/searchCitizen', { params: { fullname: trimmedKeyword } });
      const results = response.data || [];
      setCitizenDropdownResults(results);
      setIsCitizenDropdownOpen(true);
    } catch (err) {
      setCitizenSearchApiError(err.response?.data?.message || err.message || "Arama sırasında hata.");
      setCitizenDropdownResults([]);
      setIsCitizenDropdownOpen(true);
    } finally {
      setCitizenSearchApiLoading(false); // Arama API'si yüklenmesi bitti
    }
  }, []); 

  useEffect(() => {
    if (debouncedCitizenKeyword.trim()) {
      fetchCitizenNameDropdownResults(debouncedCitizenKeyword);
    } else {
      setIsCitizenDropdownOpen(false);
      setCitizenDropdownResults([]);
      setCitizenSearchApiError(null);
    }
  }, [debouncedCitizenKeyword, fetchCitizenNameDropdownResults]);

  useEffect(() => {
    const handleClickOutsideSearch = (event) => {
      if (citizenSearchWrapperRef.current && !citizenSearchWrapperRef.current.contains(event.target)) {
        setIsCitizenDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideSearch);
    return () => document.removeEventListener("mousedown", handleClickOutsideSearch);
  }, []);

  const handleAddCitizen = async (e) => {
    e.preventDefault();
    if (!newCitizen.tcNo.trim() || newCitizen.tcNo.length !== 11 || !newCitizen.fullName.trim()) {
      alert('TC No 11 haneli olmalı ve Ad Soyad boş olamaz.'); return;
    }
    setIsAdding(true);
    try {
      await axiosInstance.post('/citizens/saveCitizen', newCitizen);
      setNewCitizen({ tcNo: '', fullName: '' });
      alert('Yeni vatandaş eklendi!');
      if (page !== 0) {
          setPage(0); // Ana useEffect tetiklenir ve veriyi çeker
      } else {
          // Zaten sayfa 0'daysa, totalPages değişmediyse bile listeyi yenilemek için
          // ana useEffect'in yeniden çalışmasını sağlamak adına totalPages'i geçici olarak değiştirip eski haline getirebiliriz
          // ya da doğrudan bir fetch tetikleyebiliriz. En temizi, ana useEffect'in totalPages'e de bakması.
          // Eğer ekleme sonrası totalPages değişmiyorsa (örneğin ilk sayfada yer varsa),
          // ana useEffect'i tetiklemek için totalPages'i değiştirmek mantıklı.
          // Bu senaryoda, backend'in yeni totalPages'i döndürmesi idealdir.
          // Şimdilik, page=0 ise ve totalPages değişmezse, ana useEffect'in yeniden çalışması için
          // totalPages'i bir anlık değiştirip sonra geri almak yerine,
          // doğrudan bir fetch çağrısı daha güvenli olabilir, AMA döngüye dikkat!
          // En iyisi, ana useEffect'in totalPages değişimine de tepki vermesi.
          // Veya, add sonrası backend'den dönen güncel totalPages'i kullanarak setState yapmak.
          // Şimdilik, totalPages'in ana useEffect'te dependency olmasıyla bu durumun çözülmesini bekliyoruz.
          // Eğer ilk sayfadaysak ve totalPages değişmezse, ana useEffect'in çalışması için:
          const response = await axiosInstance.get(`/citizens/getAllCitizens?page=0&size=${pageSize}`);
          setCitizens(Array.isArray(response.data.content) ? response.data.content : []);
          setTotalPages(response.data.totalPages || 0);
      }
      if (debouncedCitizenKeyword.trim() && newCitizen.fullName.toLowerCase().includes(debouncedCitizenKeyword.toLowerCase())) {
        fetchCitizenNameDropdownResults(debouncedCitizenKeyword);
      }
    } catch (error) {
      alert(error.response?.data?.message || error.response?.data || 'Vatandaş eklenirken bir hata oluştu.');
    } finally { setIsAdding(false); }
  };

  const handleClearAddForm = () => {
    if (window.confirm('Yeni vatandaş ekleme formunu temizlemek istediğinizden emin misiniz? Girilmiş veriler silinecektir.')) {
      setNewCitizen({ tcNo: '', fullName: '' });
    }
  };

  const handleDeleteCitizen = async (id) => {
    if (window.confirm('Bu vatandaşı silmek istediğinizden emin misiniz?')) {
        setLoading(true); // Ana yükleme state'ini kullan
        try {
        await axiosInstance.post(`/citizens/deleteCitizen/${id}`);
        alert('Vatandaş başarıyla silindi!');
        if (editingCitizen && editingCitizen.id === id) setEditingCitizen(null);
        
        // Silme sonrası sayfa ve veri güncelleme
        // Eğer mevcut sayfada hiç eleman kalmadıysa ve bu ilk sayfa değilse, bir önceki sayfaya git.
        // Ana useEffect, page veya totalPages değiştiğinde veriyi yeniden çekecek.
        if (citizens.length === 1 && page > 0) {
            setPage(p => p - 1);
        } else {
            // Mevcut sayfayı veya (eğer son eleman silindiyse) sayfa 0'ı yeniden yükle.
            // Ana useEffect totalPages'e de baktığı için bu senaryoyu ele alacak.
            // Yine de emin olmak için, totalPages güncellenene kadar bekleyebilir veya
            // doğrudan mevcut sayfa verisini ve totalPages'i yeniden çekebiliriz.
             const response = await axiosInstance.get(`/citizens/getAllCitizens?page=${page}&size=${pageSize}`);
             const newContent = Array.isArray(response.data.content) ? response.data.content : [];
             const newTotalPages = response.data.totalPages || 0;
             setCitizens(newContent);
             setTotalPages(newTotalPages);
             // Eğer mevcut sayfa artık geçerli değilse (örneğin son elemanlar silindi ve sayfa boşaldı)
             if (newContent.length === 0 && page > 0 && page >= newTotalPages && newTotalPages > 0) {
                 setPage(newTotalPages - 1);
             } else if (newContent.length === 0 && newTotalPages === 0) { // Hiç eleman kalmadı
                 setPage(0);
             }
        }

        if (isCitizenDropdownOpen && debouncedCitizenKeyword.trim()) {
            fetchCitizenNameDropdownResults(debouncedCitizenKeyword);
        }
        } catch (error) {
        const errorMessage = error.response?.data?.message || error.response?.data || error.response?.statusText || 'Sunucu hatası';
        alert(`Vatandaş silinirken bir hata oluştu: ${errorMessage} (Kod: ${error.response?.status || 'Bilinmiyor'})`);
        } finally { setLoading(false); }
    }
  };

  const handleUpdateCitizen = async (e) => {
    e.preventDefault();
    if (!editingCitizen || !editingCitizen.fullName.trim() || !editingCitizen.tcNo.trim() || editingCitizen.tcNo.length !== 11) {
      alert('TC No 11 haneli olmalı ve Ad Soyad boş olamaz.'); return;
    }
    setIsUpdating(true);
    try {
      await axiosInstance.put(`/citizens/updateCitizen/${editingCitizen.id}`, editingCitizen);
      alert('Vatandaş başarıyla güncellendi!');
      setEditingCitizen(null); 
      // Mevcut sayfayı yenile
      const response = await axiosInstance.get(`/citizens/getAllCitizens?page=${page}&size=${pageSize}`);
      setCitizens(Array.isArray(response.data.content) ? response.data.content : []);
      setTotalPages(response.data.totalPages || 0);

      if (isCitizenDropdownOpen && debouncedCitizenKeyword.trim()) {
        fetchCitizenNameDropdownResults(debouncedCitizenKeyword);
      }
    } catch (error) {
      alert(error.response?.data?.message || error.response?.data || 'Vatandaş güncellenirken bir hata oluştu.');
    } finally { setIsUpdating(false); }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && (totalPages === 0 || newPage < totalPages) && !editingCitizen && !loading && !isAdding && !isUpdating) {
      setPage(newPage);
    }
  };

  const handleReturnHome = () => {
    let confirmMsg = 'Anasayfaya dönmek istediğinizden emin misiniz?';
    if (editingCitizen) {
        confirmMsg = 'Düzenleme modundasınız. Anasayfaya dönmek istediğinizden emin misiniz? Değişiklikleriniz kaybolabilir.';
    } else if (newCitizen.tcNo || newCitizen.fullName || citizenSearchKeyword) {
        confirmMsg = 'Formlarda veya arama alanında girilmiş veriler var. Anasayfaya dönmek istediğinizden emin misiniz? Değişiklikleriniz kaybolabilir.';
    }
    if (window.confirm(confirmMsg)){ window.location.href = 'http://localhost:3000/home'; }
  };
  const handleKeyPressReturnHome = (event) => { if (event.key === 'Enter' || event.key === ' ') handleReturnHome(); };

  const handleCitizenSearchInputFocus = () => { if (citizenSearchKeyword.trim() || citizenDropdownResults.length > 0) setIsCitizenDropdownOpen(true);};
  const handleCitizenSearchInputChange = (e) => {
    setCitizenSearchKeyword(e.target.value);
  };
  const handleCitizenDropdownItemClick = (citizen) => {
    setCitizenSearchKeyword(citizen.fullName); setIsCitizenDropdownOpen(false);
  };

  const UIOperationInProgress = loading || isAdding || isUpdating || editingCitizen !== null;


  return (
    <>
      <style>{layoutCss}</style> 
      <div className="citizens-page-container">
        <div 
          className="fancy-return-button"
          onClick={handleReturnHome}
          onKeyPress={handleKeyPressReturnHome}
          role="button"
          tabIndex="0" 
          title="Anasayfaya Dön"
          aria-disabled={UIOperationInProgress}
        >
          <div className="button-image-overlay">Anasayfaya Dön</div>
        </div>
        
        <h3>Vatandaş Yönetimi</h3>

        <div className="citizen-form-and-search-platform">
            <form onSubmit={handleAddCitizen} className="form-container-citizens">
              <h4>Yeni Vatandaş Ekle</h4>
              <input
                type="text" placeholder="TC Kimlik No (11 Haneli)" value={newCitizen.tcNo}
                onChange={(e) => setNewCitizen({ ...newCitizen, tcNo: e.target.value.replace(/\D/g, '').slice(0, 11) })}
                required disabled={isAdding || editingCitizen !== null || loading}
                minLength={11} maxLength={11} pattern="\d{11}" title="TC Kimlik No 11 haneli sayı olmalıdır."
              />
              <input
                type="text" placeholder="Ad Soyad" value={newCitizen.fullName}
                onChange={(e) => setNewCitizen({ ...newCitizen, fullName: e.target.value })}
                required disabled={isAdding || editingCitizen !== null || loading}
              />
              <div className="form-button-group">
                <button
                  type="submit"
                  disabled={isAdding || editingCitizen !== null || !newCitizen.tcNo.trim() || newCitizen.tcNo.length !== 11 || !newCitizen.fullName.trim() || loading}
                  className="form-add-button"
                > {isAdding ? 'Ekleniyor...' : 'Ekle'} </button>
                <button
                  type="button" onClick={handleClearAddForm}
                  disabled={isAdding || editingCitizen !== null || loading}
                  className="form-clear-button"
                > Temizle </button>
              </div>
            </form>

            <div className="citizen-search-wrapper" ref={citizenSearchWrapperRef}>
                <input
                    // Arama input'u doğrudan JSX içinde, key prop'u yok veya sabit
                    type="text"
                    placeholder="Vatandaş adıyla hızlı ara..."
                    value={citizenSearchKeyword}
                    onChange={handleCitizenSearchInputChange} 
                    onFocus={handleCitizenSearchInputFocus} 
                    disabled={loading || citizenSearchApiLoading || editingCitizen !== null} 
                />
                {isCitizenDropdownOpen && (
                    <ul className="citizen-search-results-dropdown">
                        {citizenSearchApiLoading && <li className="dropdown-message-citizens">Yükleniyor...</li>}
                        {!citizenSearchApiLoading && citizenSearchApiError && <li className="dropdown-message-citizens" style={{ color: 'red' }}>{citizenSearchApiError}</li>}
                        {!citizenSearchApiLoading && !citizenSearchApiError && citizenDropdownResults.length === 0 && debouncedCitizenKeyword.trim() && (
                            <li className="dropdown-message-citizens">"{debouncedCitizenKeyword}" için sonuç yok.</li>
                        )}
                        {!citizenSearchApiLoading && !citizenSearchApiError && citizenDropdownResults.map((citizen) => (
                            <li key={citizen.id} onMouseDown={() => handleCitizenDropdownItemClick(citizen)}>
                                {citizen.fullName} (TC: {citizen.tcNo})
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>

        <div className="citizen-list-section">
          {(loading && citizens.length === 0 && page === 0) ? ( // Ana yükleme sırasında ve ilk sayfa boşsa
            <p className="status-message-citizens">Vatandaşlar Yükleniyor...</p>
          ) : (!loading && citizens.length === 0) ? ( // Yükleme bitti ve hiç vatandaş yoksa
            <p className="status-message-citizens">Kayıtlı vatandaş bulunamadı.</p>
          ) : (
            <>
              <ul className="citizen-cards-wrapper">
                {citizens.map((citizen) => (
                  <li key={citizen.id} className="citizen-card-item">
                    <img src={localSpqrEmblem} alt="Roman Emblem" />
                    <div className="citizen-info-details">
                      <div>{citizen.fullName}</div>
                      <div>TC: {citizen.tcNo}</div>
                    </div>
                    <div className="button-container-citizen">
                      <button
                        className="card-button-citizen edit-button-citizen"
                        onClick={() => { 
                            setEditingCitizen(citizen); 
                            setNewCitizen({ tcNo: '', fullName: '' });
                            setCitizenSearchKeyword('');
                            setIsCitizenDropdownOpen(false); 
                        }}
                        disabled={UIOperationInProgress && (!editingCitizen || editingCitizen.id !== citizen.id)}
                      > Düzenle </button>
                      <button
                        className="card-button-citizen delete-button-citizen"
                        onClick={() => handleDeleteCitizen(citizen.id)}
                        disabled={UIOperationInProgress} 
                      > Sil </button>
                    </div>
                  </li>
                ))}
              </ul>

              {totalPages > 1 && !editingCitizen && (
                <div className="pagination-controls-citizens">
                  <button disabled={page === 0 || UIOperationInProgress} onClick={() => handlePageChange(page - 1)}> ← Önceki </button>
                  <span> Sayfa {page + 1} / {totalPages > 0 ? totalPages : 1} </span>
                  <button disabled={(totalPages > 0 && page >= totalPages - 1) || UIOperationInProgress} onClick={() => handlePageChange(page + 1)}> Sonraki → </button>
                </div>
              )}
            </>
          )}
          {loading && citizens.length > 0 && <p className="status-message-citizens" style={{fontSize: '0.9em'}}>Veriler yükleniyor...</p>}

          {editingCitizen && (
            <div className="edit-form-container-citizens">
              <h4>Vatandaş Bilgilerini Güncelle</h4>
              <form onSubmit={handleUpdateCitizen}>
                <input
                  type="text" placeholder="TC Kimlik No (11 Haneli)" value={editingCitizen.tcNo}
                  onChange={(e) => setEditingCitizen({ ...editingCitizen, tcNo: e.target.value.replace(/\D/g, '').slice(0, 11) })}
                  required disabled={isUpdating || loading}
                  minLength={11} maxLength={11} pattern="\d{11}" title="TC Kimlik No 11 haneli sayı olmalıdır."
                />
                <input
                  type="text" placeholder="Ad Soyad" value={editingCitizen.fullName}
                  onChange={(e) => setEditingCitizen({ ...editingCitizen, fullName: e.target.value })}
                  required disabled={isUpdating || loading}
                />
                <div className="button-group-edit">
                  <button
                    type="submit"
                    disabled={isUpdating || !editingCitizen.tcNo.trim() || editingCitizen.tcNo.length !== 11 || !editingCitizen.fullName.trim() || loading}
                    className="form-update-button"
                  > {isUpdating ? 'Güncelleniyor...' : 'Güncelle'} </button>
                  <button
                    type="button" onClick={() => setEditingCitizen(null)}
                    disabled={isUpdating || loading}
                    className="form-cancel-button"
                  > İptal </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Citizens;