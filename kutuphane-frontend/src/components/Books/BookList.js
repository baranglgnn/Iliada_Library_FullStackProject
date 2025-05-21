// Books.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance'; // YOLU KONTROL EDİN
import spqrImage from '../../images/SPQRFlag.jpg'; // YOLU KONTROL EDİN
import returnHomeBgImageFromFile from '../../images/Roma-Kolezyum.jpg'; // YOLU KONTROL EDİN

import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const returnHomeBgImage = returnHomeBgImageFromFile;
const layoutCss = `
    /* Main container */
   .books-container {
      padding: 20px 30px 30px 30px;
      border-radius: 10px;
      display: flex; 
      flex-direction: column; 
      align-items: flex-start; /* DEĞİŞİKLİK BURADA: center yerine flex-start */
      gap: 25px; 
      min-height: calc(100vh - 40px);
      position: relative; 
      box-sizing: border-box;
      width: 100%;
      max-width: 1400px; 
      margin: 0 auto; /* .books-container'ı sayfa içinde ortalar */
    }

    /* "Yeni Kitap Ekle" formu ve "Arama Çubuğu" için PLATFORM sarmalayıcısı */
    .form-and-search-platform {
      display: flex;
      flex-wrap: wrap; 
      justify-content: center;
      align-items: center; 
      gap: 20px;
      background-color: #fdf4e3;
      padding: 20px 25px;
      border-radius: 10px;
      box-shadow: 0 3px 8px rgba(0,0,0,0.1);
      width: auto;
      max-width: 850px;
      box-sizing: border-box;
      margin-bottom: 30px;
    }
    .form-container { 
      width: 350px;
      flex-shrink: 0; 
      display: flex; flex-direction: column; gap: 15px; 
      background-color: #fff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      box-sizing: border-box; 
      z-index: 1; 
    }

    /* Global Search Wrapper - ARAMA ALANI */
    .global-search-wrapper {
      display: flex;
      flex-direction: column; 
      align-items: center; 
      justify-content: center; 
      min-width: 300px; 
      max-width: 480px; 
      position: relative; 
      z-index: 10; 
    }
    .global-search-wrapper input[type="text"] {
      width: 100%; 
      padding: 10px 14px; 
      border-radius: 6px;
      border: 1px solid #ccc;
      font-size: 1em; 
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
      margin-bottom: 0; 
    }
    .global-search-wrapper input[type="text"]:focus {
      outline: none;
      border-color: #802C00; 
      box-shadow: 0 0 0 0.1rem rgba(80, 45, 15, 0.15);
    }

    /* ARAMA SONUÇLARI DROPDOWN (Sadece Kitap İsimleri) */
    .search-results-dropdown-names { 
      position: absolute;
      top: 100%; 
      left: 0;
      right: 0;
      background-color: #fff;
      border: 1px solid #ddd;
      border-top: none; 
      border-radius: 0 0 6px 6px; 
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      max-height: 200px; 
      overflow-y: auto;
      z-index: 9; 
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .search-results-dropdown-names li {
      padding: 8px 12px; 
      cursor: pointer;
      border-bottom: 1px solid #f0f0f0;
      font-size: 0.95em; 
      color: #333;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .search-results-dropdown-names li:last-child {
      border-bottom: none;
    }
    .search-results-dropdown-names li:hover {
      background-color: #f7f7f7; 
    }

    .search-results-dropdown-names .dropdown-message-names { 
      padding: 10px 12px;
      text-align: center;
      color: #777;
      font-style: italic;
      font-size: 0.9em;
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
      width: 100%; height: 100%;
      background-color: rgba(253, 244, 227, 0.60);
      display: flex; align-items: center; justify-content: center; text-align: center;
      color: #502D0F; font-size: 1.1em; font-weight: bold; font-family: 'Georgia', serif; 
      padding: 5px; box-sizing: border-box; border-radius: inherit; 
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
    }
    .fancy-return-button:disabled {
      opacity: 0.7; cursor: not-allowed; transform: none;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    }
    
    .form-container h4 {
        margin-top: 0; color: #333; margin-bottom: 10px; font-size: 1.3em;
    }
    .form-container input, .form-container select {
      padding: 12px; border-radius: 5px; border: 1px solid #ccc;
      width: 100%; box-sizing: border-box; font-size: 1.1em;
    }
    .form-container .form-button-group { display: flex; gap: 10px; margin-top: 5px; }
    .form-container .form-button-group button {
      border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;
      font-weight: bold; transition: background-color 0.3s ease, opacity 0.3s ease;
      font-size: 0.95em; flex-grow: 1; color: white; 
    }
    .form-container .form-button-group button:hover:not(:disabled) { opacity: 0.85; }
    .form-container .form-button-group button:disabled {
      opacity: 0.6; cursor: not-allowed; background-color: #cccccc !important; 
    }
    .form-container .form-add-button { background-color: #4CAF50; }
    .form-container .form-add-button:hover:not(:disabled) { background-color: #45a049; }
    .form-container .form-clear-button { background-color: #660000; }
    .form-container .form-clear-button:hover:not(:disabled) { background-color: #4d0000; }

     .slider-and-edit-section {
      width: 100%; /* Ana container'ın genişliğine yayılır */
      max-width: 1300px; /* DEĞİŞİKLİK: Slider alanının maksimum genişliğini artırdık. İsteğinize göre ayarlayın. */
                         /* Bu değer .books-container'ın max-width'inden büyük olmamalı. */
      display: flex; 
      flex-direction: column;
      align-items: center; /* Kendi içindeki pagination gibi elemanları ortalar */
      min-width: 300px; 
      box-sizing: border-box; 
      z-index: 1;
    }
    .slider-section {
        width: 100%; /* .slider-and-edit-section'ın genişliğini alır */
        margin-bottom: 30px;
        padding: 0 25px; /* Oklar için kenar boşlukları, slider içeriğini sınırlar */
        box-sizing: border-box;
    }
    
    
     @media (max-width: 1024px) { 
        .form-and-search-platform {
            gap: 20px;
            padding: 15px 20px;
            max-width: 90%; 
        }
        .form-container {
            width: 320px; 
        }
        .global-search-wrapper {
            min-width: 260px;
            max-width: 350px;
        }
    }

    @media (max-width: 768px) { 
        .books-container {
            padding-left: 15px; 
            padding-right: 15px;
        }
        .form-and-search-platform {
          flex-direction: column; 
          align-items: center; 
          gap: 20px;
          width: 100%; 
          max-width: 500px;
          padding: 15px; 
        }
        .form-container { 
            width: 100%; 
            max-width: 100%; 
        }
        .global-search-wrapper { 
            width: 100%; 
            max-width: 100%;
            margin-top: 0; 
        }
    }
    @media (max-width: 576px) {
        .fancy-return-button { width: 150px; height: 50px; top: 10px; right: 10px; }
        .button-image-overlay { font-size: 0.9em; }
        .form-container { padding: 15px; max-width: 100%;}
        .form-container input, .form-container select { font-size: 0.9em; }
        .form-container .form-button-group button { font-size: 0.85em; padding: 8px 10px;}
        .global-search-wrapper { max-width: 100%;}
        .global-search-wrapper input[type="text"] { font-size: 0.9em; } 
    }
    
    .slider-item {
      background-color: #fdf4e3; border-radius: 10px; padding: 15px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1); display: flex !important; 
      flex-direction: column; align-items: center; text-align: center;
      cursor: default; transition: transform 0.3s ease;
      justify-content: space-between; height: 100%; box-sizing: border-box; margin: 0 10px; 
    }
    .slider-item:hover { transform: translateY(-5px); }
    .slider-item img {
      width: 100%; max-width: 150px; height: 100px; 
      object-fit: contain; margin-bottom: 15px;
      border: 1px solid #ddd; background-color: #fff;
    }
    .book-info-background {
        background-color: rgba(253, 244, 227, 0.85); padding: 8px 10px; border-radius: 5px;
        margin-bottom: 10px; width: 100%; box-sizing: border-box;
    }
    .book-info-background div { margin-bottom: 5px; color: #333; word-break: break-word; }
    .book-info-background div:last-child { margin-bottom: 0; }
    .book-info-background div:first-child { font-weight: bold; font-size: 1.1em; }
    .book-info-background div:nth-child(2) { font-size: 0.9em; }
    .slider-item .button-container {
        display: flex; gap: 10px; margin-top: 10px;
        flex-wrap: wrap; justify-content: center; width: 100%;
    }
    .slider-item button {
      color: white; border: none; padding: 8px 12px;
      border-radius: 5px; cursor: pointer;
      transition: background-color 0.3s ease, opacity 0.3s ease;
      font-size: 0.9em; flex-grow: 1; min-width: 80px;
    }
    .slider-item button:hover:not(:disabled) { opacity: 0.9; }
    .slider-item button:disabled { opacity: 0.6; cursor: not-allowed; }
    .slider-item .edit-button { background-color: #b30000; }
    .slider-item .edit-button:hover:not(:disabled) { background-color: #990000; }
    .slider-item .delete-button { background-color: #660000; }
    .slider-item .delete-button:hover:not(:disabled) { background-color: #4d0000; }
    .slick-prev, .slick-next {
        display: block !important; z-index: 5; 
        width: 40px !important; height: 40px !important;
        top: 50% !important; transform: translateY(-50%) !important;
        background: rgba(255, 255, 255, 0.9) !important; 
        border-radius: 50%; box-shadow: 0 2px 5px rgba(0,0,0,0.3); 
    }
    .slick-prev:hover, .slick-next:hover { background: #fff !important; }
    .slick-prev:before, .slick-next:before {
        font-family: 'slick'; font-size: 25px !important; line-height: 1;
        opacity: .9 !important; color: #333 !important; 
        -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
        display: flex; justify-content: center; align-items: center; height: 100%;
    }
    .slick-prev { left: 0px !important; }
    .slick-next { right: 0px !important; }
    .slick-dots { display: none !important; }
    .pagination-controls {
        margin-top: 40px; text-align: center; display: flex;
        justify-content: center; align-items: center;
        gap: 15px; flex-wrap: wrap; padding: 10px;
        background-color: rgba(255, 255, 255, 0.5); border-radius: 8px;
    }
    .pagination-controls button {
      background-color: #007bff; color: white; border: none;
      padding: 10px 20px; border-radius: 5px; cursor: pointer;
      font-weight: bold; transition: background-color 0.3s ease, opacity 0.3s ease;
      font-size: 1em;
    }
    .pagination-controls button:hover:not(:disabled) { background-color: #0056b3;}
    .pagination-controls button:disabled { opacity: 0.5; cursor: not-allowed;}
    .pagination-controls span { margin: 0 10px; font-weight: bold; color: #333;}
    .status-message {
        text-align: center; padding: 20px; font-size: 1.2em;
        color: #555; width: 100%; display: flex;
        justify-content: center; align-items: center; min-height: 150px;
    }
    .edit-form-container {
      margin-top: 30px; padding: 20px; background-color: #fff; 
      border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      display: flex; flex-direction: column; gap: 15px;
      width: 100%; box-sizing: border-box;
    }
    .edit-form-container h4 { margin-top: 0; color: #333; }
    .edit-form-container input, .edit-form-container select {
      padding: 10px; border-radius: 5px; border: 1px solid #ccc;
      width: 100%; box-sizing: border-box; font-size: 1em;
    }
    .edit-form-container .button-group {
        display: flex; gap: 10px; flex-wrap: wrap; justify-content: flex-end;
    }
    .edit-form-container button {
        padding: 10px 15px; border-radius: 5px; cursor: pointer;
        font-weight: bold; border: none;
        transition: background-color 0.3s ease, opacity 0.3s ease; font-size: 1em;
    }
    .edit-form-container button:hover:not(:disabled) { opacity: 0.9; }
    .edit-form-container button:disabled { opacity: 0.6; cursor: not-allowed; }
    .edit-form-container .update-button { background-color: #007bff; color: white; }
    .edit-form-container .update-button:hover:not(:disabled) { background-color: #0056b3; }
    .edit-form-container .cancel-button { background-color: #6c757d; color: white; }
    .edit-form-container .cancel-button:hover:not(:disabled) { background-color: #5a6268; }
    .error-message {
        color: #b30000; font-size: 0.9em; margin-bottom: 10px;
        text-align: center; width: 100%; box-sizing: border-box;
    }
    .form-container .error-message,
    .edit-form-container .error-message { text-align: left; }
`;

const Books = () => {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState(null);

  const [newBook, setNewBook] = useState({ title: '', authorId: '' });
  const [addFormError, setAddFormError] = useState(null);
  const [editingBook, setEditingBook] = useState(null);
  const [editFormError, setEditFormError] = useState(null);
  const [authors, setAuthors] = useState([]);
  const [loadingAuthors, setLoadingAuthors] = useState(false);

  const [searchNameKeyword, setSearchNameKeyword] = useState('');
  const [debouncedNameKeyword, setDebouncedNameKeyword] = useState('');
  const [nameDropdownResults, setNameDropdownResults] = useState([]);
  const [isNameDropdownOpen, setIsNameDropdownOpen] = useState(false);
  const [nameSearchApiLoading, setNameSearchApiLoading] = useState(false);
  const [nameSearchApiError, setNameSearchApiError] = useState(null);

  const sliderRef = useRef(null);
  const nameSearchWrapperRef = useRef(null);
  const pageSize = 8;
  const navigate = useNavigate();

  const sliderSettings = {
    dots: false, infinite: true, speed: 1000, slidesToShow: 5, slidesToScroll: 2,
    autoplay: true, autoplaySpeed: 2000, pauseOnHover: true, arrows: true,
    responsive: [
       { breakpoint: 1600, settings: { slidesToShow: 4, slidesToScroll: 1 } },
       { breakpoint: 1200, settings: { slidesToShow: 3, slidesToScroll: 1 } },
       { breakpoint: 992, settings: { slidesToShow: 2, slidesToScroll: 1 } },
       { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
       { breakpoint: 576, settings: { slidesToShow: 1, slidesToScroll: 1, arrows: false } }
    ]
  };

  const updateSliderOptions = useCallback((currentBooksArray) => {
    if (sliderRef.current && typeof sliderRef.current.slickSetOption === 'function') {
        const booksCount = currentBooksArray.length;
        const sliderProps = sliderRef.current.props || {}; 
        const currentSlidesToShow = sliderProps.slidesToShow || sliderSettings.slidesToShow;
        const baseSlidesToScroll = sliderProps.slidesToScroll || sliderSettings.slidesToScroll;
        let finalSlidesToScroll = baseSlidesToScroll;
        if (booksCount > 0 && booksCount < currentSlidesToShow ) finalSlidesToScroll = 1; 
        else if (booksCount > 0) finalSlidesToScroll = Math.min(baseSlidesToScroll, booksCount);
        else finalSlidesToScroll = 1; 
        finalSlidesToScroll = Math.max(1, finalSlidesToScroll);
        sliderRef.current.slickSetOption("slidesToScroll", finalSlidesToScroll, true);
        sliderRef.current.slickSetOption("infinite", booksCount >= currentSlidesToShow, true);
        if ((booksCount > 0 && sliderRef.current.slickCurrentSlide() !== 0 && sliderRef.current.slickCurrentSlide() >= booksCount) ||
            (booksCount === 0 && sliderRef.current.slickCurrentSlide() !== 0)) {
            sliderRef.current.slickGoTo(0);
        }
    } else if (sliderRef.current) {
        console.warn("Slick slider ref is present, but slickSetOption method is not available yet.");
    }
  }, [sliderSettings.slidesToShow, sliderSettings.slidesToScroll]);

  const fetchAuthors = useCallback(async () => {
    setLoadingAuthors(true);
    try {
      const response = await axiosInstance.get(`/authors/getAllAuthor?_=${new Date().getTime()}`);
      const data = response.data;
      let authorList = [];
      if (Array.isArray(data)) authorList = data;
      else if (data && Array.isArray(data.content)) authorList = data.content;
      else if (data && Array.isArray(data.authors)) authorList = data.authors;
      setAuthors(authorList);
    } catch (error) {
      console.error('Yazarlar alınırken hata:', error.response?.data || error.message);
      setAuthors([]);
    } finally { setLoadingAuthors(false); }
  }, []);

  const fetchPaginatedBooks = useCallback(async (page) => {
    setLoading(true);
    setGeneralError(null);
    setEditingBook(null);
    try {
      const response = await axiosInstance.get(`/books/getAllBooks?page=${page}&size=${pageSize}`);
      const fetchedBooksData = response.data.content || [];
      const totalPagesFromApi = response.data.totalPages || 0;
      const totalItemsFromApi = response.data.totalElements || 0;
      setBooks(fetchedBooksData);
      setTotalPages(totalPagesFromApi);
      setTotalItems(totalItemsFromApi);
      setCurrentPage(page);
      updateSliderOptions(fetchedBooksData);
    } catch (err) {
      setGeneralError(err.response?.data?.message || err.message || "Kitaplar yüklenirken bir hata oluştu.");
      setBooks([]); setTotalPages(0); setTotalItems(0);
      updateSliderOptions([]);
    } finally { setLoading(false); }
  }, [pageSize, updateSliderOptions]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedNameKeyword(searchNameKeyword);
    }, 400);
    return () => { clearTimeout(handler); };
  }, [searchNameKeyword]);

  const fetchNameDropdownResults = useCallback(async (keyword) => {
    const trimmedKeyword = keyword.trim();
    if (!trimmedKeyword) {
      setNameDropdownResults([]);
      setIsNameDropdownOpen(false);
      setNameSearchApiError(null);
      return;
    }
    setNameSearchApiLoading(true);
    setNameSearchApiError(null);
    try {
      const response = await axiosInstance.get('books/searchBooks', { params: { title: trimmedKeyword } });
      const results = response.data || [];
      setNameDropdownResults(results);
      setIsNameDropdownOpen(true);
    } catch (err) {
      console.error('İsim Dropdown Arama Hatası:', err.response?.data || err.message);
      setNameSearchApiError(err.response?.data?.message || err.message || "Arama sırasında hata.");
      setNameDropdownResults([]);
      setIsNameDropdownOpen(true);
    } finally {
      setNameSearchApiLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debouncedNameKeyword.trim()) {
      fetchNameDropdownResults(debouncedNameKeyword);
    } else {
      setIsNameDropdownOpen(false);
      setNameDropdownResults([]);
      setNameSearchApiError(null);
    }
  }, [debouncedNameKeyword, fetchNameDropdownResults]);

  useEffect(() => {
    const handleClickOutsideNameSearch = (event) => {
      if (nameSearchWrapperRef.current && !nameSearchWrapperRef.current.contains(event.target)) {
        setIsNameDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideNameSearch);
    return () => { document.removeEventListener("mousedown", handleClickOutsideNameSearch); };
  }, []);

  useEffect(() => {
    let pageToFetch = currentPage;
    if (totalPages > 0 && currentPage >= totalPages) pageToFetch = totalPages - 1;
    else if (totalPages === 0 && currentPage > 0) pageToFetch = 0;
    pageToFetch = pageToFetch < 0 ? 0 : pageToFetch;
    if (pageToFetch !== currentPage) setCurrentPage(pageToFetch);
    else fetchPaginatedBooks(pageToFetch);
  }, [currentPage, totalPages, fetchPaginatedBooks]);

  useEffect(() => { fetchAuthors(); }, [fetchAuthors]);

  useEffect(() => {
    const handleDataRefresh = () => { fetchAuthors(); };
    window.addEventListener('focus', handleDataRefresh);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') handleDataRefresh();
    });
    return () => {
      window.removeEventListener('focus', handleDataRefresh);
      document.removeEventListener('visibilitychange', handleDataRefresh);
    };
  }, [fetchAuthors]);


  const getAuthorNameById = useCallback((authorId) => {
    const author = authors.find((a) => a.id === authorId);
    return author ? `${author.name || ''} ${author.surname || ''}`.trim() : 'Bilinmiyor';
  }, [authors]);

  const handleAddBook = useCallback(async (e) => {
    e.preventDefault(); setAddFormError(null);
    if (!newBook.title.trim() || !newBook.authorId) {
      setAddFormError('Kitap adı ve yazar seçimi boş olamaz.'); return;
    }
    setLoading(true);
    try {
      await axiosInstance.post('/books/addBook', { title: newBook.title.trim(), author: { id: Number(newBook.authorId) } });
      alert('Kitap başarıyla eklendi!'); setNewBook({ title: '', authorId: '' });
      if (currentPage !== 0) setCurrentPage(0); else fetchPaginatedBooks(0);
      if(debouncedNameKeyword.trim() && newBook.title.toLowerCase().startsWith(debouncedNameKeyword.toLowerCase())) {
        fetchNameDropdownResults(debouncedNameKeyword);
      }
    } catch (error) {
      setAddFormError(error.response?.data?.message || error.message || "Kitap eklenirken bir hata oluştu.");
      console.error('Ekleme Hatası:', error.response?.data || error);
    } finally { setLoading(false); }
  }, [newBook, currentPage, fetchPaginatedBooks, debouncedNameKeyword, fetchNameDropdownResults]);

  const handleDeleteBook = useCallback(async (id) => {
    if (window.confirm('Bu kitabı silmek istediğinizden emin misiniz?')) {
      setLoading(true); setGeneralError(null);
      if (editingBook && editingBook.id === id) { setEditingBook(null); setEditFormError(null); }
      try {
        await axiosInstance.post(`/books/deleteBook/${id}`);
        alert('Kitap silindi!');
        if (books.length === 1 && totalItems > 1 && currentPage > 0) setCurrentPage(currentPage - 1);
        else fetchPaginatedBooks(currentPage);
        if(isNameDropdownOpen && debouncedNameKeyword.trim()){
            fetchNameDropdownResults(debouncedNameKeyword);
        }
      } catch (error) {
        setGeneralError(error.response?.data?.message || error.message || "Kitap silinirken hata oluştu.");
        alert(error.response?.data?.message || error.message || "Kitap silinirken hata oluştu.");
        console.error('Silme Hatası:', error.response?.data || error);
      } finally { setLoading(false); }
    }
  }, [fetchPaginatedBooks, currentPage, books.length, totalItems, editingBook, isNameDropdownOpen, debouncedNameKeyword, fetchNameDropdownResults]);

  const handleUpdateBook = useCallback(async (e) => {
    e.preventDefault(); setEditFormError(null);
    if (!editingBook || !editingBook.title.trim() || !editingBook.authorId) {
      setEditFormError('Kitap adı ve yazar seçimi boş olamaz.'); return;
    }
    setLoading(true);
    try {
      await axiosInstance.put(`/books/updateBook/${editingBook.id}`, { title: editingBook.title.trim(), author: { id: Number(editingBook.authorId) } });
      alert('Kitap başarıyla güncellendi!'); setEditingBook(null);
      fetchPaginatedBooks(currentPage);
      if(isNameDropdownOpen && debouncedNameKeyword.trim()){
          fetchNameDropdownResults(debouncedNameKeyword);
      }
    } catch (error) {
      setEditFormError(error.response?.data?.message || error.message || "Kitap güncellenirken bir hata oluştu.");
      console.error('Güncelleme Hatası:', error.response?.data || error);
    } finally { setLoading(false); }
  }, [editingBook, fetchPaginatedBooks, currentPage, isNameDropdownOpen, debouncedNameKeyword, fetchNameDropdownResults]);

  const cancelEditing = useCallback(() => { setEditingBook(null); setEditFormError(null); }, []);
  
  const handlePageChange = useCallback((newPage) => {
    if (loading || editingBook !== null || newPage < 0 || newPage >= totalPages) return;
    setCurrentPage(newPage);
  }, [loading, editingBook, totalPages]);

  const handleClearAddForm = () => {
    if (window.confirm('Formu temizlemek istediğinizden emin misiniz? Girilmiş veriler silinecektir.')) {
      setNewBook({ title: '', authorId: '' }); setAddFormError(null);
    }
  };

  const handleReturnHome = () => {
    let confirmReturn = true;
    if (searchNameKeyword.trim() || editingBook || newBook.title || newBook.authorId) {
        confirmReturn = window.confirm('Formlarda veya arama alanında girilmiş veriler var. Anasayfaya dönmek istediğinizden emin misiniz? Değişiklikleriniz kaybolabilir.');
    } else {
        confirmReturn = window.confirm('Anasayfaya dönmek istediğinizden emin misiniz?');
    }
    if (confirmReturn) navigate('/home');
  };

  const handleKeyPressReturnHome = (event) => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); handleReturnHome(); }
  };
  
  const showBooksSlider = !loading && books.length > 0;

  const handleNameSearchInputFocus = () => {
    if (searchNameKeyword.trim()) {
        setIsNameDropdownOpen(true);
    }
  };
  
  const handleNameDropdownItemClick = (book) => {
    console.log("Seçilen Kitap Adı (Dropdown):", book.title);
    setSearchNameKeyword(book.title); 
    setIsNameDropdownOpen(false); 
  };

  return (
    <div className="books-container">
      <style>{layoutCss}</style>

      <div
        className="fancy-return-button" onClick={handleReturnHome} onKeyPress={handleKeyPressReturnHome}
        role="button" tabIndex="0" title="Anasayfaya Dön"
        style={{ backgroundImage: `url(${returnHomeBgImageFromFile})`, pointerEvents: loading ? 'none' : 'auto', opacity: loading ? 0.7 : 1 }}
      >
        <div className="button-image-overlay">Anasayfaya Dön</div>
      </div>
      
      <div className="form-and-search-platform">
        <div className="form-container">
           <h4>Yeni Kitap Ekle</h4>
           {addFormError && !editingBook && <p className="error-message">{addFormError}</p>}
           <form onSubmit={handleAddBook}>
             <input
               type="text" placeholder="Kitap Adı" value={newBook.title}
               onChange={(e) => { setNewBook({ ...newBook, title: e.target.value }); if (addFormError) setAddFormError(null); }}
               required disabled={loading || editingBook !== null}
             />
             <select
               value={newBook.authorId}
               onChange={(e) => { setNewBook({ ...newBook, authorId: e.target.value }); if (addFormError) setAddFormError(null); }}
               required disabled={loading || editingBook !== null || loadingAuthors || authors.length === 0}
             >
               <option value="">{loadingAuthors ? "Yazarlar Yükleniyor..." : (authors.length === 0 ? "Yazar Bulunamadı" : "Yazar Seçin")}</option>
               {authors.map((author) => ( <option key={author.id} value={author.id}> {author.name} {author.surname || ''} </option> ))}
             </select>
             <div className="form-button-group">
               <button type="submit" className="form-add-button" disabled={loading || editingBook !== null || !newBook.title.trim() || !newBook.authorId}>
                 {loading && !editingBook ? 'Ekleniyor...' : 'Ekle'}
               </button>
               <button type="button" className="form-clear-button" onClick={handleClearAddForm} disabled={loading || editingBook !== null}>
                 Temizle
               </button>
             </div>
           </form>
        </div>

        <div className="global-search-wrapper" ref={nameSearchWrapperRef}>
          <input
            type="text"
            placeholder="Kitap adıyla hızlı ara..."
            value={searchNameKeyword}
            onChange={(e) => setSearchNameKeyword(e.target.value)}
            onFocus={handleNameSearchInputFocus}
            disabled={loading}
          />
          
          {isNameDropdownOpen && (
            <ul className="search-results-dropdown-names">
              {nameSearchApiLoading && <li className="dropdown-message-names">Yükleniyor...</li>}
              {!nameSearchApiLoading && nameSearchApiError && <li className="dropdown-message-names" style={{ color: 'red' }}>{nameSearchApiError}</li>}
              {!nameSearchApiLoading && !nameSearchApiError && nameDropdownResults.length === 0 && debouncedNameKeyword.trim() && (
                <li className="dropdown-message-names">"{debouncedNameKeyword}" için sonuç yok.</li>
              )}
              {!nameSearchApiLoading && !nameSearchApiError && nameDropdownResults.map((book) => (
                <li key={book.id} onMouseDown={() => handleNameDropdownItemClick(book)}>
                  {book.title}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="slider-and-edit-section">
            {loading && books.length === 0 && !generalError && <p className="status-message">Kitaplar Yükleniyor...</p>}
            {!loading && totalItems === 0 && !generalError &&
                <p className="status-message">Henüz hiç kitap eklenmemiş. Yeni kitap ekleyerek başlayın.</p>
            }
            {!loading && books.length === 0 && totalItems > 0 && !generalError && 
                <p className="status-message">Bu sayfada kitap bulunamadı.</p> 
            }
            {generalError && !loading && <p className="status-message error-message" style={{color: '#b30000'}}>{generalError}</p>}

            {showBooksSlider && (
                <div className="slider-section">
                    <Slider {...sliderSettings} ref={sliderRef}>
                        {books.map((book) => (
                           <div key={book.id} >
                             <div className="slider-item">
                                 <img src={spqrImage} alt={`Kitap Kapağı: ${book.title}`} />
                                 <div className="book-info-background">
                                     <div>{book.title}</div>
                                     <div>Yazar: {getAuthorNameById(book.author?.id)}</div>
                                 </div>
                                 <div className="button-container">
                                     <button
                                       className="edit-button"
                                       onClick={(e) => {
                                           e.stopPropagation();
                                           setEditingBook({ id: book.id, title: book.title, authorId: book.author?.id });
                                           setEditFormError(null); setGeneralError(null); setAddFormError(null); 
                                        }}
                                        disabled={loading || editingBook !== null }
                                     >
                                       Düzenle
                                     </button>
                                     <button
                                       className="delete-button"
                                       onClick={(e) => { e.stopPropagation(); handleDeleteBook(book.id); }}
                                        disabled={loading || editingBook !== null}
                                     >
                                       Sil
                                     </button>
                                 </div>
                             </div>
                           </div>
                        ))}
                    </Slider>
                 </div>
            )}
            {!loading && totalItems > 0 && totalPages > 1 && !editingBook && (
                <div className="pagination-controls">
                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0 || loading}>
                       ← Önceki
                   </button>
                   <span>Sayfa {currentPage + 1} / {totalPages > 0 ? totalPages : 1}</span>
                   <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage + 1 >= totalPages || loading}>
                       Sonraki →
                   </button>
               </div>
            )}

            {editingBook && (
                <div className="edit-form-container">
                    <h4>Kitap Bilgilerini Güncelle: "{editingBook.title}"</h4>
                    {editFormError && <p className="error-message">{editFormError}</p>}
                    <form onSubmit={handleUpdateBook}>
                      <input
                        type="text" placeholder="Kitap Adı" value={editingBook.title}
                        onChange={(e) => { setEditingBook({ ...editingBook, title: e.target.value }); if (editFormError) setEditFormError(null); }}
                        required disabled={loading}
                      />
                      <select
                        value={editingBook.authorId || ''}
                        onChange={(e) => { setEditingBook({ ...editingBook, authorId: e.target.value }); if (editFormError) setEditFormError(null); }}
                        required disabled={loading || loadingAuthors || authors.length === 0}
                      >
                        <option value="">{loadingAuthors ? "Yazarlar Yükleniyor..." : (authors.length === 0 ? "Yazar Bulunamadı" : "Yazar Seçin")}</option>
                        {authors.map((author) => ( <option key={author.id} value={author.id}> {author.name} {author.surname || ''} </option> ))}
                      </select>
                      <div className="button-group">
                          <button type="submit" disabled={loading || !editingBook.title.trim() || !editingBook.authorId} className="update-button" >
                            {loading ? 'Güncelleniyor...' : 'Güncelle'}
                          </button>
                          <button type="button" onClick={cancelEditing} className="cancel-button" disabled={loading} >
                            İptal
                          </button>
                      </div>
                    </form>
                </div>
            )}
        </div>
    </div>
  );
};

export default Books;