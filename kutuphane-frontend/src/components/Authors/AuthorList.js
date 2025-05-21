// Authors.js
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'; // useMemo eklendi (opsiyonel, sliderSettings için)
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import authorImage from '../../images/images.jpg';
import returnHomeBgImageFromFile from '../../images/Roma-Kolezyum.jpg';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const returnHomeBgImage = returnHomeBgImageFromFile;
const layoutCss = `
  /* Main container */
  .authors-container {
    padding: 20px 30px 30px 30px; /* Üst ve yan paddingler */
    border-radius: 10px;
    display: flex;
    flex-direction: column; 
    align-items: flex-start; /* <<-- DEĞİŞİKLİK: İçerikleri sola yasla */
    gap: 25px; 
    min-height: calc(100vh - 40px);
    position: relative; 
    box-sizing: border-box;
    width: 100%;
    max-width: 1400px; /* Ana sayfa genişliği */
    margin: 0 auto; /* Ana container'ı ortala */
  }

  /* Form & Search Wrapper */
  .author-form-and-search-platform { /* Books.js'deki .form-and-search-platform'a benzer */
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 20px;
    background-color: #fdf4e3;
    padding: 20px 25px;
    border-radius: 10px;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
    width: auto;
    max-width: 850px; /* Form (350) + Arama (380) + Gap (20) ~ 750 + pay */
    box-sizing: border-box;
    margin-bottom: 30px;
  }

  /* Home Button */
  .fancy-return-button {
    position: absolute;
    top: 25px;
    right: 30px;
    width: 220px;
    height: 70px;
    background-image: url('${returnHomeBgImageFromFile}');
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
    z-index: 20;
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

  .fancy-return-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }

  /* Add Form */
  .form-container { /* Authors.js için bu class adı kullanılıyor */
    width: 350px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 15px;
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    box-sizing: border-box;
    z-index: 1;
  }

  .form-container h4 {
    margin-top: 0;
    color: #333;
    margin-bottom: 10px;
    font-size: 1.3em;
  }

  .form-container input {
    padding: 12px;
    border-radius: 5px;
    border: 1px solid #ccc;
    width: 100%;
    box-sizing: border-box;
    font-size: 1.1em;
  }

  .form-container .author-form-button-group {
    display: flex;
    gap: 10px;
    margin-top: 5px;
  }

  .form-container .author-form-button-group button {
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.3s ease, opacity 0.3s ease;
    font-size: 0.95em;
    flex-grow: 1;
    color: white;
  }

  .form-container .author-form-button-group button:hover:not(:disabled) {
    opacity: 0.85;
  }

  .form-container .author-form-button-group button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: #cccccc !important;
  }

  .form-container .author-form-add-button {
    background-color: #4CAF50;
  }

  .form-container .author-form-add-button:hover:not(:disabled) {
    background-color: #45a049;
  }

  .form-container .author-form-clear-button {
    background-color: #660000;
  }

  .form-container .author-form-clear-button:hover:not(:disabled) {
    background-color: #4d0000;
  }

  /* Search Dropdown (Authors için .author-search-wrapper) */
  .author-search-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 300px;
    max-width: 380px; /* form-container ile benzer genişlikte */
    position: relative;
    z-index: 10; /* Dropdown'ın diğer elemanların üzerinde olması için */
  }

  .author-search-wrapper input[type="text"] {
    width: 100%;
    padding: 10px 14px;
    border-radius: 6px;
    border: 1px solid #ccc;
    font-size: 1em;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    margin-bottom: 0; /* Dropdown hemen altında başlayacak */
  }

  .author-search-wrapper input[type="text"]:focus {
    outline: none;
    border-color: #802C00;
    box-shadow: 0 0 0 0.1rem rgba(80, 45, 15, 0.15);
  }

  .author-search-results-dropdown { /* Books.js'deki .search-results-dropdown-names'e benzer */
    position: absolute;
    top: 100%; 
    left: 0;
    right: 0;
    background-color: #fff;
    border: 1px solid #ddd;
    border-top: none;
    border-radius: 0 0 6px 6px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-height: 200px;
    overflow-y: auto;
    z-index: 9; /* Input'un altında */
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .author-search-results-dropdown li {
    padding: 8px 12px;
    cursor: pointer;
    border-bottom: 1px solid #f0f0f0;
    font-size: 0.95em;
    color: #333;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .author-search-results-dropdown li:last-child {
    border-bottom: none;
  }

  .author-search-results-dropdown li:hover {
    background-color: #f7f7f7;
  }

  .author-search-results-dropdown .dropdown-message-authors { /* Books.js'deki .dropdown-message-names'e benzer */
    padding: 10px 12px;
    text-align: center;
    color: #777;
    font-style: italic;
    font-size: 0.9em;
  }

  /* Slider & Edit Section */
  .slider-and-edit-section {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 1300px;
    min-width: 300px;
    box-sizing: border-box;
    z-index: 1; /* Dropdown platformunun altında kalması için */
  }

  .slider-section {
    width: 100%;
    margin-bottom: 30px;
    padding: 0 25px;
    box-sizing: border-box;
  }

  .slick-slide > div {
    margin: 0 10px;
  }

  .slider-item {
    background-color: transparent; /* Arkaplan resimle gelecek */
    border-radius: 10px;
    padding: 15px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    display: flex !important; /* react-slick için önemli */
    flex-direction: column;
    align-items: center;
    text-align: center;
    cursor: default;
    transition: transform 0.3s ease;
    justify-content: space-between;
    height: auto; /* İçeriğe göre ayarlanır */
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    min-height: 200px; /* Yazar adı ve butonlar için minimum yükseklik */
  }

  .slider-item::before { /* Arkaplan resmi için pseudo-element */
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url('${authorImage}'); /* authorImage değişkeni kullanılacak */
    background-size: cover;
    background-position: center;
    border-radius: 10px; /* slider-item ile aynı */
    opacity: 0.9; /* İsteğe bağlı, resmi biraz soluklaştırır */
    z-index: 0; /* İçeriğin altında kalır */
  }

  .slider-item span { /* Yazar adı */
    position: relative;
    z-index: 1; /* Arkaplan resminin üzerinde */
    font-weight: bold;
    font-size: 1.1em;
    background-color: rgba(253, 244, 227, 0.85); /* Okunabilirlik için yarı saydam arkaplan */
    padding: 8px 12px;
    border-radius: 5px;
    margin-bottom: 10px;
    color: #333;
    flex-grow: 1; /* Esnek yükseklik için */
    display: flex;
    align-items: center;
    justify-content: center;
    word-break: break-word;
    min-height: 50px; /* Yazar adı için minimum yükseklik */
    width: calc(100% - 20px); /* Paddingleri hesaba kat */
    box-sizing: border-box;
    margin-left: 10px; /* Span için iç boşluk */
    margin-right: 10px;
  }

  .slider-item .button-container {
    position: relative;
    z-index: 1; /* Arkaplan resminin üzerinde */
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
    margin-top: 10px; /* Yazar adıyla butonlar arası boşluk */
    padding-bottom: 5px; /* Butonların altında biraz boşluk */
  }

  .slider-item button {
    font-size: 0.9em;
    padding: 8px 12px;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    opacity: 1; /* Başlangıçta tam opak */
    transition: background-color 0.3s ease, opacity 0.3s ease;
    flex-grow: 1; /* Butonların eşit genişlemesi için */
    min-width: 80px; /* Minimum buton genişliği */
  }

  .slider-item button:hover:not(:disabled) {
    opacity: 0.9;
  }
  .slider-item button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: #cccccc !important;
  }
    .pagination-controls {
    margin-top: 30px; 
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px; 
    flex-wrap: wrap;
    padding: 10px 15px; 
    background-color: rgba(230, 230, 230, 0.7); 
    border-radius: 50px; 
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); 
  }
     .pagination-controls button {
    background-color: #007bff; 
    color: white;
    border: none;
    padding: 10px 20px; 
    border-radius: 20px; 
    cursor: pointer;
    font-weight: bold;
    font-size: 1em; 
    transition: background-color 0.2s ease, transform 0.1s ease;
    box-shadow: 0 1px 3px rgba(0,0,0,0.15); 
  }
    .pagination-controls button:hover:not(:disabled) {
    background-color: #0056b3; 
    transform: translateY(-1px); 
  }
     .pagination-controls button:disabled {
    background-color: #6c757d; 
    color: #ccc; 
    cursor: not-allowed;
    box-shadow: none; 
    transform: none; 
  }
     .pagination-controls button:first-of-type:disabled { 
    /* background-color: #7FBCFF; 
    opacity: 0.7; */
  }
      .pagination-controls span {
    margin: 0 10px; 
    font-weight: bold;
    font-size: 1.1em; 
    color: #333; 
    padding: 8px 12px;
    background-color: rgba(255, 255, 255, 0.7); 
    border-radius: 15px;
  }

  .slider-item .edit-button { background-color: #b30000; }
  .slider-item .edit-button:hover:not(:disabled) { background-color: #990000; }
  .slider-item .delete-button { background-color: #660000; }
  .slider-item .delete-button:hover:not(:disabled) { background-color: #4d0000; }

  .slick-prev, .slick-next { /* ... (Books.js'deki gibi) ... */ }
  .status-message { /* ... (Books.js'deki gibi) ... */ }
  .pagination-controls { /* ... (Books.js'deki gibi) ... */ }
  .edit-form-container { /* ... (Books.js'deki gibi, max-width ayarlanabilir) ... */ }
  .error-message { /* ... (Books.js'deki gibi) ... */ }

  /* Responsive stiller (Authors.js'e uyarlanmış) */
  @media (max-width: 1400px) { 
      .slider-and-edit-section { max-width: 95%; }
  }
  @media (max-width: 1024px) { 
      .author-form-and-search-platform { max-width: 90%; }
      .form-container { width: 320px; } 
      .author-search-wrapper { min-width: 260px; max-width: 350px; }
      .slider-and-edit-section { max-width: 90%;}
  }
  @media (max-width: 992px) { 
      .authors-container { align-items: center; padding: 20px; } 
      .form-container { width: 100%; max-width: 500px; } 
      .slider-and-edit-section { width: 100%; } 
      .slider-section { padding: 0 10px; } 
      .edit-form-container { max-width: 90%; } 
      .fancy-return-button { width: 180px; height: 60px; } 
      .author-form-and-search-platform { flex-direction: column; max-width: 500px; }
      .author-search-wrapper { width: 100%; max-width: 100%; }
  }
  @media (max-width: 576px) { 
      .authors-container { padding: 15px; } 
      .form-container { max-width: 100%; } 
      .slider-section { padding: 0; } 
      .edit-form-container { max-width: 100%;} 
      .fancy-return-button { width: 150px; height: 50px; } 
      .author-search-wrapper { max-width: 100%;}
  }
`;


const Authors = () => {
  // Ana liste (slider) için state'ler
  const [authorsList, setAuthorsList] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(8);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [loadingSlider, setLoadingSlider] = useState(true);
  const [sliderError, setSliderError] = useState(null);

  // Yeni yazar ekleme formu için state'ler
  const [newAuthor, setNewAuthor] = useState({ name: '' });
  const [addFormError, setAddFormError] = useState(null);

  // Yazar düzenleme için state'ler
  const [editingAuthor, setEditingAuthor] = useState(null);
  const [editFormError, setEditFormError] = useState(null);

  // Yazar ARAMA DROPDOWN İÇİN STATE'LER (Books.js'ten uyarlandı)
  const [authorSearchKeyword, setAuthorSearchKeyword] = useState('');
  const [debouncedAuthorKeyword, setDebouncedAuthorKeyword] = useState('');
  const [authorDropdownResults, setAuthorDropdownResults] = useState([]);
  const [isAuthorDropdownOpen, setIsAuthorDropdownOpen] = useState(false);
  const [authorSearchApiLoading, setAuthorSearchApiLoading] = useState(false);
  const [authorSearchApiError, setAuthorSearchApiError] = useState(null);

  const sliderRef = useRef(null);
  const authorSearchWrapperRef = useRef(null);
  const navigate = useNavigate();
  const isInitialRender = useRef(true); // İlk render'ı takip etmek için

  const sliderSettings = useMemo(() => ({
    dots: false,
    infinite: true, // Bu, updateSliderOptions içinde dinamik olarak ayarlanacak
    speed: 500,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    slidesToShow: 4,
    slidesToScroll: 1, // Bu, updateSliderOptions içinde dinamik olarak ayarlanacak
    arrows: true,
    responsive: [
       { breakpoint: 1600, settings: { slidesToShow: 4, slidesToScroll: 1 } },
       { breakpoint: 1200, settings: { slidesToShow: 3, slidesToScroll: 1 } },
       { breakpoint: 992, settings: { slidesToShow: 2, slidesToScroll: 1 } },
       { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
       { breakpoint: 576, settings: { slidesToShow: 1, slidesToScroll: 1 } }
    ]
  }), []);

  const updateSliderOptions = useCallback((currentAuthsArray) => {
    if (sliderRef.current && typeof sliderRef.current.slickSetOption === 'function') {
        const authorsCount = currentAuthsArray.length;
        let responsiveSlidesToShow = sliderSettings.slidesToShow;
        if (sliderSettings.responsive && typeof window !== 'undefined') {
            const sortedResponsive = [...sliderSettings.responsive].sort((a, b) => b.breakpoint - a.breakpoint);
            for (const resp of sortedResponsive) {
                if (window.innerWidth <= resp.breakpoint) { responsiveSlidesToShow = resp.settings.slidesToShow; break; }
            }
        }
        let baseSlidesToScroll = sliderSettings.slidesToScroll;
        if (sliderSettings.responsive && typeof window !== 'undefined') {
            const sortedResponsive = [...sliderSettings.responsive].sort((a, b) => b.breakpoint - a.breakpoint);
            for (const resp of sortedResponsive) {
                if (window.innerWidth <= resp.breakpoint && resp.settings.slidesToScroll) { baseSlidesToScroll = resp.settings.slidesToScroll; break; }
            }
        }
        let finalSlidesToScroll = Math.max(1, authorsCount > 0 ? Math.min(baseSlidesToScroll, authorsCount) : 1);
        if (authorsCount > 0 && authorsCount < responsiveSlidesToShow) finalSlidesToScroll = 1;

        try {
            sliderRef.current.slickSetOption("slidesToScroll", finalSlidesToScroll, true);
            sliderRef.current.slickSetOption("infinite", authorsCount >= responsiveSlidesToShow, true);
            if ((sliderRef.current.slickCurrentSlide() !== 0 && (authorsCount === 0 || sliderRef.current.slickCurrentSlide() >= authorsCount))) {
                sliderRef.current.slickGoTo(0, true);
            }
        } catch (e) { console.warn("Error slickSetOption:", e); }
    }
  }, [sliderSettings]);

  const fetchPaginatedAuthors = useCallback(async (pageToFetch, size) => {
    console.log(`AUTHORS: Fetching page ${pageToFetch}`);
    setLoadingSlider(true);
    setSliderError(null);
    try {
      const response = await axiosInstance.get(`/authors/getAllAuthor?page=${pageToFetch}&size=${size}`);
      const fetchedAuthors = response.data.content || [];
      const totalPagesFromApi = response.data.totalPages || 0;
      const totalItemsFromApi = response.data.totalElements || 0;
      setAuthorsList(fetchedAuthors);
      setTotalPages(totalPagesFromApi);
      setTotalItems(totalItemsFromApi);
      updateSliderOptions(fetchedAuthors);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Yazarlar yüklenirken bir hata oluştu.";
      setSliderError(errorMessage);
      setAuthorsList([]);
      setTotalPages(0);
      setTotalItems(0);
      updateSliderOptions([]);
    } finally {
      setLoadingSlider(false);
    }
  }, [updateSliderOptions]);


  // ANA VERİ ÇEKME VE SAYFA YÖNETİMİ (Books.js'teki gibi)
  useEffect(() => {
    let pageToLoad = currentPage;

    if (totalPages > 0 && pageToLoad >= totalPages) {
      pageToLoad = totalPages - 1;
    }
    pageToLoad = Math.max(0, pageToLoad); // Negatif olmasını engelle

    if (pageToLoad !== currentPage) {
      console.log(`AUTHORS: Correcting page from ${currentPage} to ${pageToLoad}`);
      setCurrentPage(pageToLoad);
    } else {
      // Sadece ilk render'da veya sayfa gerçekten değişmediyse (ama totalPages değişmiş olabilir)
      // fetchPaginatedAuthors'u doğrudan çağır.
      // if (isInitialRender.current || pageToLoad === currentPage) { // Bu koşul sonsuz döngüye yol açabilir.
      console.log(`AUTHORS: Fetching data for current page ${pageToLoad}`);
      fetchPaginatedAuthors(pageToLoad, pageSize);
      // }
    }
    if(isInitialRender.current) isInitialRender.current = false;

  }, [currentPage, totalPages, pageSize, fetchPaginatedAuthors]); // fetchPaginatedAuthors eklendi

  // ARAMA DROPDOWN İÇİN useEffect'ler (Books.js'teki gibi)
  useEffect(() => {
    const handler = setTimeout(() => { setDebouncedAuthorKeyword(authorSearchKeyword); }, 400);
    return () => clearTimeout(handler);
  }, [authorSearchKeyword]);

  const fetchAuthorNameDropdownResults = useCallback(async (keyword) => {
    const trimmedKeyword = keyword.trim();
    if (!trimmedKeyword) {
      setAuthorDropdownResults([]);
      setIsAuthorDropdownOpen(false);
      setAuthorSearchApiError(null);
      return;
    }
    setAuthorSearchApiLoading(true);
    setAuthorSearchApiError(null);
    try {
      const response = await axiosInstance.get('authors/searchAuthors', { params: { name: trimmedKeyword } });
      const results = response.data || [];
      setAuthorDropdownResults(results);
      setIsAuthorDropdownOpen(true);
    } catch (err) {
      setAuthorSearchApiError(err.response?.data?.message || err.message || "Arama sırasında hata.");
      setAuthorDropdownResults([]);
      setIsAuthorDropdownOpen(true);
    } finally {
      setAuthorSearchApiLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debouncedAuthorKeyword.trim()) {
      fetchAuthorNameDropdownResults(debouncedAuthorKeyword);
    } else {
      setIsAuthorDropdownOpen(false);
      setAuthorDropdownResults([]);
      setAuthorSearchApiError(null);
    }
  }, [debouncedAuthorKeyword, fetchAuthorNameDropdownResults]);

  useEffect(() => {
    const handleClickOutsideAuthorSearch = (event) => {
      if (authorSearchWrapperRef.current && !authorSearchWrapperRef.current.contains(event.target)) {
        setIsAuthorDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideAuthorSearch);
    return () => document.removeEventListener("mousedown", handleClickOutsideAuthorSearch);
  }, []);

  // CRUD OPERASYONLARI (Books.js'ten uyarlandı)
  const handleAddAuthor = async (e) => {
    e.preventDefault(); setAddFormError(null);
    if (!newAuthor.name.trim()) { setAddFormError('Yazar adı boş olamaz.'); return; }
    setLoadingSlider(true);
    try {
      await axiosInstance.post('/authors/saveAuthor', { name: newAuthor.name.trim() });
      alert('Yeni yazar başarıyla eklendi!'); setNewAuthor({ name: '' });
      if (currentPage !== 0) setCurrentPage(0); // Ana useEffect tetiklenir
      else fetchPaginatedAuthors(0, pageSize); // Zaten ilk sayfadaysa direkt çek
      if (debouncedAuthorKeyword.trim() && newAuthor.name.toLowerCase().startsWith(debouncedAuthorKeyword.toLowerCase())) {
        fetchAuthorNameDropdownResults(debouncedAuthorKeyword);
      }
    } catch (error) {
       setAddFormError(error.response?.data?.message || error.message || "Yazar eklenirken bir hata oluştu.");
    } finally { setLoadingSlider(false); }
  };

  const handleDeleteAuthor = async (id) => {
    if (window.confirm('Bu yazarı silmek istediğinizden emin misiniz?')) {
      setLoadingSlider(true); setSliderError(null);
      if (editingAuthor && editingAuthor.id === id) { setEditingAuthor(null); setEditFormError(null); }
      try {
        await axiosInstance.post(`/authors/deleteAuthor/${id}`); // Backend POST kabul ediyorsa
        alert('Yazar silindi!');
        const newTotalItems = Math.max(0, totalItems - 1);
        const newTotalPages = Math.ceil(newTotalItems / pageSize);
        let pageToLoad = currentPage;
        if (currentPage >= newTotalPages && newTotalPages > 0) pageToLoad = newTotalPages - 1;
        else if (newTotalItems === 0) pageToLoad = 0;

        if (pageToLoad !== currentPage || (pageToLoad === 0 && currentPage === 0 && totalItems === 1 && newTotalItems === 0)) {
            setCurrentPage(pageToLoad);
        } else {
            fetchPaginatedAuthors(pageToLoad, pageSize);
        }
        if (isAuthorDropdownOpen && debouncedAuthorKeyword.trim()) {
          fetchAuthorNameDropdownResults(debouncedAuthorKeyword);
        }
      } catch (error) {
        setSliderError(error.response?.data?.message || error.message || "Yazar silinirken bir hata oluştu.");
        alert(error.response?.data?.message || error.message || "Yazar silinirken hata oluştu.");
      } finally { setLoadingSlider(false); }
    }
  };

  const handleUpdateAuthor = async (e) => {
    e.preventDefault(); setEditFormError(null);
    if (!editingAuthor || !editingAuthor.name.trim()) { setEditFormError('Yazar adı boş olamaz.'); return; }
    setLoadingSlider(true);
    try {
      await axiosInstance.put(`/authors/updateAuthor/${editingAuthor.id}`, { name: editingAuthor.name.trim() });
      alert('Yazar başarıyla güncellendi!'); setEditingAuthor(null);
      fetchPaginatedAuthors(currentPage, pageSize);
      if (isAuthorDropdownOpen && debouncedAuthorKeyword.trim()) {
        fetchAuthorNameDropdownResults(debouncedAuthorKeyword);
      }
    } catch (error) {
       setEditFormError(error.response?.data?.message || error.message || "Yazar güncellenirken bir hata oluştu.");
    } finally { setLoadingSlider(false); }
  };

  // Diğer yardımcı fonksiyonlar (Books.js'ten uyarlandı)
  const cancelEditing = useCallback(() => { setEditingAuthor(null); setEditFormError(null); }, []);
  const handleClearForm = () => { if (window.confirm('Formu temizlemek istediğinizden emin misiniz?')) { setNewAuthor({ name: '' }); setAddFormError(null); }};
  const handleReturnHome = () => { if (window.confirm('Anasayfaya dönmek istediğinizden emin misiniz?')) navigate('/home'); };
  const handleKeyPressReturnHome = (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); handleReturnHome(); }};
  const handleAuthorSearchInputFocus = () => { if (authorSearchKeyword.trim()) setIsAuthorDropdownOpen(true);};
  const handleAuthorDropdownItemClick = (author) => { setAuthorSearchKeyword(author.name); setIsAuthorDropdownOpen(false); };

  const handlePageChange = useCallback((newPage) => {
    setSliderError(null); setEditingAuthor(null);
    if (sliderRef.current && typeof sliderRef.current.slickGoTo === 'function') {
      try { sliderRef.current.slickGoTo(0, true); } catch (e) { console.warn("Error in slickGoTo:", e); }
    }
    if (!loadingSlider) {
        if (newPage >= 0 && (totalPages === 0 || newPage < totalPages) ) {
             setCurrentPage(newPage);
        }
    }
  }, [totalPages, loadingSlider]);

  const showAuthorsSlider = !loadingSlider && authorsList.length > 0;

  return (
    <div className="authors-container">
      <style>{layoutCss}</style>

      <div className="fancy-return-button" onClick={handleReturnHome} onKeyPress={handleKeyPressReturnHome} role="button" tabIndex="0" title="Anasayfaya Dön" disabled={loadingSlider} style={{ backgroundImage: `url(${returnHomeBgImageFromFile})` }}>
        <div className="button-image-overlay">Anasayfaya Dön</div>
      </div>
      
      <div className="author-form-and-search-platform">
        <div className="form-container">
            <h4>Yeni Yazar Ekle</h4>
            {addFormError && <p className="error-message">{addFormError}</p>}
            <form onSubmit={handleAddAuthor}>
              <input type="text" placeholder="Yazar Adı" value={newAuthor.name} onChange={(e) => { setNewAuthor({ name: e.target.value }); if (addFormError) setAddFormError(null); }} required disabled={loadingSlider || editingAuthor !== null} />
              <div className="author-form-button-group">
                <button type="submit" className="author-form-add-button" disabled={loadingSlider || editingAuthor !== null || !newAuthor.name.trim()}> {loadingSlider && !editingAuthor ? 'Ekleniyor...' : 'Ekle'} </button>
                <button type="button" className="author-form-clear-button" onClick={handleClearForm} disabled={loadingSlider || editingAuthor !== null}> Temizle </button>
              </div>
            </form>
        </div>
        <div className="author-search-wrapper" ref={authorSearchWrapperRef}>
          <input type="text" placeholder="Yazar adıyla hızlı ara..." value={authorSearchKeyword} onChange={(e) => setAuthorSearchKeyword(e.target.value)} onFocus={handleAuthorSearchInputFocus} disabled={loadingSlider}/>
          {isAuthorDropdownOpen && (
            <ul className="author-search-results-dropdown">
              {authorSearchApiLoading && <li className="dropdown-message-authors">Yükleniyor...</li>}
              {!authorSearchApiLoading && authorSearchApiError && <li className="dropdown-message-authors" style={{ color: 'red' }}>{authorSearchApiError}</li>}
              {!authorSearchApiLoading && !authorSearchApiError && authorDropdownResults.length === 0 && debouncedAuthorKeyword.trim() && (<li className="dropdown-message-authors">"{debouncedAuthorKeyword}" için sonuç yok.</li> )}
              {!authorSearchApiLoading && !authorSearchApiError && authorDropdownResults.map((author) => (<li key={author.id} onMouseDown={() => handleAuthorDropdownItemClick(author)}>{author.name}</li>))}
            </ul>
          )}
        </div>
      </div>

      <div className="slider-and-edit-section">
           {loadingSlider && authorsList.length === 0 && currentPage === 0 && <p className="status-message">Yazarlar Yükleniyor...</p>}
           {!loadingSlider && totalItems === 0 && <p className="status-message">Henüz hiç yazar eklenmemiş. Yeni yazar ekleyerek başlayın.</p>}
           {!loadingSlider && authorsList.length === 0 && totalItems > 0 && <p className="status-message">Bu sayfada gösterilecek yazar bulunamadı.</p> }
           {sliderError && <p className="status-message error-message" style={{color: '#b30000'}}>{sliderError}</p>}

           {showAuthorsSlider && (
             <div className="slider-section">
                 <Slider {...sliderSettings} ref={sliderRef}>
                   {authorsList.map((author) => (
                     <div key={author.id} >
                        <div className="slider-item">
                          <span>{author.name}</span>
                          <div className="button-container">
                              <button className="edit-button" onClick={(e) => { e.stopPropagation(); setEditingAuthor({ id: author.id, name: author.name }); setEditFormError(null); setAddFormError(null); setSliderError(null); }} disabled={loadingSlider || editingAuthor !== null}>Düzenle</button>
                              <button className="delete-button" onClick={(e) => { e.stopPropagation(); handleDeleteAuthor(author.id);}} disabled={loadingSlider || editingAuthor !== null}>Sil</button>
                          </div>
                        </div>
                      </div>
                   ))}
                 </Slider>
              </div>
           )}
            {!loadingSlider && totalItems > 0 && totalPages > 1 && !editingAuthor && (
                <div className="pagination-controls">
                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={loadingSlider || currentPage === 0}>← Önceki</button>
                    <span>Sayfa {currentPage + 1} / {totalPages > 0 ? totalPages : 1}</span>
                    <button onClick={() => handlePageChange(currentPage + 1)} disabled={loadingSlider || currentPage >= totalPages - 1}>Sonraki →</button>
                </div>
            )}
            {editingAuthor && (
              <div className="edit-form-container">
                <h4>Yazar Bilgilerini Güncelle: {editingAuthor.name}</h4>
                {editFormError && <p className="error-message">{editFormError}</p>}
                <form onSubmit={handleUpdateAuthor}>
                  <input type="text" placeholder="Yazar Adı" value={editingAuthor.name} onChange={(e) => { setEditingAuthor({ ...editingAuthor, name: e.target.value }); if (editFormError) setEditFormError(null);}} required disabled={loadingSlider} />
                  <div className="button-group">
                      <button type="submit" disabled={loadingSlider || !editingAuthor.name.trim()} className="update-button">{loadingSlider ? 'Güncelleniyor...' : 'Güncelle'}</button>
                      <button type="button" onClick={cancelEditing} className="cancel-button" disabled={loadingSlider}>İptal</button>
                  </div>
                </form>
              </div>
            )}
      </div>
    </div>
  );
};

export default Authors;