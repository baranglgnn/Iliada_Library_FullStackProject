// LibraryList.js
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
// LibraryForm importu kaldırıldı
import libraryImage from '../../images/Library_Trajans.jpg';
import returnHomeBgImageFromFile from '../../images/Roma-Kolezyum.jpg';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const ITEMS_PER_PAGE = 8; 

const layoutCss = `
  /* Main container */
  .libraries-container {
    padding: 20px 30px 30px 30px;
    border-radius: 10px;
    display: flex;
    flex-direction: column; 
    align-items: flex-start; 
    gap: 25px; 
    min-height: calc(100vh - 40px);
    position: relative; 
    box-sizing: border-box;
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
  }

  /* Form & Search Platform */
  .library-form-and-search-platform {
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

  /* Fancy Home Button */
  .fancy-return-button {
    position: absolute; top: 25px; right: 30px; width: 220px; height: 70px;
    background-image: url('${returnHomeBgImageFromFile}');
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
    padding: 5px; box-sizing: border-box; border-radius: inherit;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
  }
  .fancy-return-button[aria-disabled="true"], .fancy-return-button:disabled {
    opacity: 0.7; cursor: not-allowed; transform: none; box-shadow: 0 4px 8px rgba(0,0,0,0.3);
  }

  /* Add Form Wrapper (Eski LibraryForm için) */
   .add-form-wrapper { 
    width: 400px; 
    flex-shrink: 0;
    display: flex; flex-direction: column; gap: 15px;
    background-color: #fff; padding: 20px; border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05); box-sizing: border-box; z-index: 1;
  }
   .add-form-wrapper h4 { 
    margin-top: 0; color: #333; margin-bottom: 10px; font-size: 1.3em;
  }
  /* Formun içindeki input ve textarea'lar için stiller */
  .add-form-wrapper input[type="text"], 
  .add-form-wrapper textarea {
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 1em;
  }
  .add-form-wrapper textarea {
    resize: vertical;
    min-height: 60px;
  }
  .add-form-wrapper .form-button-group { display: flex; gap: 10px; margin-top: 5px; }
  .add-form-wrapper .form-button-group button {
    border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;
    font-weight: bold; transition: background-color 0.3s ease, opacity 0.3s ease;
    font-size: 0.95em; flex-grow: 1; color: white; 
  }
    .add-form-wrapper .form-button-group button:hover:not(:disabled) { opacity: 0.85; }
  .add-form-wrapper .form-button-group button:disabled {
    opacity: 0.6; cursor: not-allowed; background-color: #cccccc !important; 
  }
  .add-form-wrapper .form-add-button { background-color: #4CAF50; } 
  .add-form-wrapper .form-add-button:hover:not(:disabled) { background-color: #45a049; }
  .add-form-wrapper .form-clear-button { background-color: #660000; } 
  .add-form-wrapper .form-clear-button:hover:not(:disabled) { background-color: #4d0000; }


  /* Library Search Dropdown Wrapper */
  .library-search-wrapper {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    min-width: 300px; max-width: 380px; position: relative; z-index: 10;
  }
  .library-search-wrapper input[type="text"] {
    width: 100%; padding: 10px 14px; border-radius: 6px; border: 1px solid #ccc;
    font-size: 1em; box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    transition: border-color 0.2s ease, box-shadow 0.2s ease; margin-bottom: 0;
  }
  .library-search-wrapper input[type="text"]:focus {
    outline: none; border-color: #802C00; box-shadow: 0 0 0 0.1rem rgba(80,45,15,0.15);
  }
  .library-search-results-dropdown {
    position: absolute; top: 100%; left: 0; right: 0; background-color: #fff;
    border: 1px solid #ddd; border-top: none; border-radius: 0 0 6px 6px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1); max-height: 200px; overflow-y: auto;
    z-index: 9; list-style: none; padding: 0; margin: 0;
  }
  .library-search-results-dropdown li {
    padding: 8px 12px; cursor: pointer; border-bottom: 1px solid #f0f0f0;
    font-size: 0.95em; color: #333; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .library-search-results-dropdown li:last-child { border-bottom: none; }
  .library-search-results-dropdown li:hover { background-color: #f7f7f7; }
  .library-search-results-dropdown .dropdown-message-libraries {
    padding: 10px 12px; text-align: center; color: #777; font-style: italic; font-size: 0.9em;
  }

  /* Slider & Edit Section */
  .slider-and-edit-section {
    flex-grow: 1; display: flex; flex-direction: column; align-items: center;
    width: 100%; max-width: 1300px; min-width: 300px; box-sizing: border-box; z-index: 1;
  }
  .slider-section { 
    width: 100%; margin-bottom: 30px; padding: 0 25px; box-sizing: border-box;
  }
  .slick-slide > div { margin: 0 10px; } 

  .slider-item { 
    background-color: transparent; border-radius: 10px; padding: 15px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2); display: flex !important;
    flex-direction: column; align-items: center; text-align: center;
    cursor: default; transition: transform 0.3s ease;
    justify-content: space-between; 
    height: auto; box-sizing: border-box; position: relative; overflow: hidden;
    min-height: 280px; 
  }
  .slider-item::before { 
    content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    background-image: url('${libraryImage}'); 
    background-size: cover; background-position: center; border-radius: 10px;
    opacity: 0.9; z-index: 0;
  }
  .library-details { 
    position: relative; z-index: 1; background-color: rgba(253,244,227,0.85);
    padding: 10px 15px; border-radius: 8px; margin-bottom: 15px; color: #333;
    width: calc(100% - 30px); box-sizing: border-box; text-align: left;
    min-height: 80px; 
  }
  .library-details .library-name { font-weight: bold; font-size: 1.2em; margin-bottom: 5px; }
  .library-details .library-address { font-size: 0.95em; word-break: break-word; }
  
  .slider-item .button-container { 
    position: relative; z-index: 1; display: flex; gap: 10px;
    flex-wrap: wrap; justify-content: center; width: 100%; margin-top: auto; 
    padding-top:10px; padding-bottom: 5px;
  }
  .slider-item button { 
    font-size: 0.9em; padding: 8px 12px; color: white; border: none;
    border-radius: 5px; cursor: pointer; transition: background-color 0.3s ease, opacity 0.3s ease;
    flex-grow: 1; min-width: 80px;
  }
   .slider-item button:hover:not(:disabled) { opacity: 0.9; }
  .slider-item button:disabled { opacity: 0.6; cursor: not-allowed; background-color: #cccccc !important; }
  .slider-item .edit-button { background-color: #b30000; } 
  .slider-item .edit-button:hover:not(:disabled) { background-color: #990000; }
  .slider-item .delete-button { background-color: #660000; } 
  .slider-item .delete-button:hover:not(:disabled) { background-color: #4d0000; }

  /* Slick Arrows */
  .slick-prev, .slick-next {
    display: block !important; z-index: 5; width: 40px !important; height: 40px !important;
    top: 50% !important; transform: translateY(-50%) !important;
    background: rgba(255,255,255,0.9) !important; border-radius: 50%;
    box-shadow: 0 2px 5px rgba(0,0,0,0.3);
  }
  .slick-prev:hover, .slick-next:hover { background: #fff !important; }
  .slick-prev:before, .slick-next:before {
    font-family: 'slick'; font-size: 25px !important; line-height: 1;
    opacity: .9 !important; color: #333 !important;
    -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
    display: flex; justify-content: center; align-items: center; height: 100%;
  }
  .slick-prev { left: -10px !important; }
  .slick-next { right: -10px !important; }
  .slick-dots { display: none !important; }


  /* Status Messages, Pagination, Edit Form */
  .status-message {
    text-align: center; padding: 20px; font-size: 1.2em; color: #555;
    width: 100%; display: flex; justify-content: center; align-items: center; min-height: 150px;
  }
  .pagination-controls {
    margin-top: 30px; text-align: center; display: flex; justify-content: center;
    align-items: center; gap: 10px; flex-wrap: wrap; padding: 10px 15px;
    background-color: rgba(230,230,230,0.7); border-radius: 50px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  }
  .pagination-controls button {
    background-color: #007bff; color: white; border: none; padding: 10px 20px;
    border-radius: 20px; cursor: pointer; font-weight: bold; font-size: 1em;
    transition: background-color 0.2s ease, transform 0.1s ease;
    box-shadow: 0 1px 3px rgba(0,0,0,0.15);
  }
  .pagination-controls button:hover:not(:disabled) { background-color: #0056b3; transform: translateY(-1px); }
  .pagination-controls button:disabled {
    background-color: #6c757d; color: #ccc; cursor: not-allowed;
    box-shadow: none; transform: none;
  }
  .pagination-controls span {
    margin: 0 10px; font-weight: bold; font-size: 1.1em; color: #333;
    padding: 8px 12px; background-color: rgba(255,255,255,0.7); border-radius: 15px;
  }
   .edit-form-container {
    margin-top: 30px; padding: 25px; background-color: #fff; border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15); display: flex; flex-direction: column; gap: 20px;
    width: 100%; max-width: 550px; box-sizing: border-box;
  }
   .edit-form-container h4 { margin-top: 0; color: #333; font-size: 1.4em; margin-bottom: 5px; }
  .edit-form-container input, .edit-form-container textarea {
    padding: 12px 15px; border-radius: 6px; border: 1px solid #ced4da;
    width: 100%; box-sizing: border-box; font-size: 1em;
    transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
  }
  .edit-form-container input:focus, .edit-form-container textarea:focus {
    border-color: #80bdff; outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
  }
   .edit-form-container .button-group { 
    display: flex; gap: 12px; flex-wrap: wrap; justify-content: flex-end; margin-top: 10px;
  }
   .edit-form-container .button-group button { 
    padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: 500;
    border: none; transition: background-color .2s ease, opacity .2s ease, transform .1s ease;
    font-size: 1em;
  }
  .edit-form-container .button-group button:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
  .edit-form-container .button-group button:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }
   .edit-form-container .update-button { background-color: #4CAF50; color: white; } 
  .edit-form-container .update-button:hover:not(:disabled) { background-color: #45a049; }
  .edit-form-container .cancel-button { background-color: #6c757d; color: white; } 
  .edit-form-container .cancel-button:hover:not(:disabled) { background-color: #5a6268; }

  .error-message {
    color: #c00; font-size: 0.9em; margin-bottom: 10px;
    text-align: left; 
    width: 100%; box-sizing: border-box;
  }
  .add-form-wrapper .error-message { 
     text-align: left;
  }

  /* Responsive */
  @media (max-width: 1400px) { 
      .slider-and-edit-section { max-width: 95%; }
  }
  @media (max-width: 1024px) { 
      .library-form-and-search-platform { max-width: 90%; }
      .add-form-wrapper { width: 320px; } 
      .library-search-wrapper { min-width: 260px; max-width: 350px; }
      .slider-and-edit-section { max-width: 90%;}
  }
  @media (max-width: 992px) { 
      .libraries-container { align-items: center; padding: 20px; } 
      .library-form-and-search-platform { flex-direction: column; max-width: 500px; }
      .add-form-wrapper { width: 100%; max-width: 100%; } 
      .library-search-wrapper { width: 100%; max-width: 100%; margin-top: 20px; }
      .slider-and-edit-section { width: 100%; } 
      .slider-section { padding: 0 10px; } 
      .edit-form-container { max-width: 90%; } 
      .fancy-return-button { width: 180px; height: 60px; } 
  }
  @media (max-width: 576px) { 
      .libraries-container { padding: 15px; } 
      .add-form-wrapper { padding: 15px; } 
      .library-search-wrapper input[type="text"] { font-size: 0.9em; } 
      .slider-section { padding: 0; } 
      .edit-form-container { max-width: 100%; padding: 15px; } 
      .fancy-return-button { width: 150px; height: 50px; top: 10px; right: 10px; } 
  }
`;

const MemoizedSliderSection = React.memo(({ 
  libraries, 
  sliderSettings, 
  sliderRef, 
  loadingSlider, 
  editingLibrary, 
  setEditingLibrary,
  setEditFormError,
  setAddFormError, 
  setSliderError,
  handleDeleteLibrary 
}) => {
  // console.log("MemoizedSliderSection RENDERED");
  if (!libraries || libraries.length === 0) {
    return null;
  }
  return (
    <div className="slider-section">
      <Slider {...sliderSettings} ref={sliderRef}>
        {libraries.map((library) => (
          <div key={library.id}>
            <div className="slider-item">
              <div className="library-details">
                <div className="library-name">{library.name}</div>
                <div className="library-address">{library.address}</div>
              </div>
              <div className="button-container">
                <button 
                  className="edit-button" 
                  onClick={() => { 
                    setEditingLibrary({ ...library }); 
                    if(setEditFormError) setEditFormError(null); 
                    if(setAddFormError) setAddFormError(null); 
                    if(setSliderError) setSliderError(null); 
                  }} 
                  disabled={loadingSlider || editingLibrary !== null}
                >
                  Düzenle
                </button>
                <button 
                  className="delete-button" 
                  onClick={() => handleDeleteLibrary(library.id)} 
                  disabled={loadingSlider || editingLibrary !== null}
                >
                  Sil
                </button>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
});

const LibraryList = () => {
  const [libraries, setLibraries] = useState([]); 
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [loadingSlider, setLoadingSlider] = useState(true); 
  const [sliderError, setSliderError] = useState(null); 
  
  const [newLibraryName, setNewLibraryName] = useState('');
  const [newLibraryAddress, setNewLibraryAddress] = useState('');
  const [isSubmittingAddForm, setIsSubmittingAddForm] = useState(false);
  const [addFormError, setAddFormError] = useState(null); 

  const [editingLibrary, setEditingLibrary] = useState(null);
  const [editFormError, setEditFormError] = useState(null);
  const [librarySearchKeyword, setLibrarySearchKeyword] = useState('');
  const [debouncedLibraryKeyword, setDebouncedLibraryKeyword] = useState('');
  const [libraryDropdownResults, setLibraryDropdownResults] = useState([]);
  const [isLibraryDropdownOpen, setIsLibraryDropdownOpen] = useState(false);
  const [librarySearchApiLoading, setLibrarySearchApiLoading] = useState(false);
  const [librarySearchApiError, setLibrarySearchApiError] = useState(null);

  const sliderRef = useRef(null);
  const librarySearchWrapperRef = useRef(null); 
  const navigate = useNavigate(); 
  const isInitialRender = useRef(true);

  const sliderSettings = useMemo(() => ({
    dots: false, infinite: true, speed: 500, autoplay: true, autoplaySpeed: 3000, 
    pauseOnHover: true, slidesToShow: 4, slidesToScroll: 1, arrows: true,
    responsive: [
       { breakpoint: 1600, settings: { slidesToShow: 4, slidesToScroll: 1 } },
       { breakpoint: 1200, settings: { slidesToShow: 3, slidesToScroll: 1 } },
       { breakpoint: 992, settings: { slidesToShow: 2, slidesToScroll: 1 } },
       { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
       { breakpoint: 576, settings: { slidesToShow: 1, slidesToScroll: 1, arrows: false } } 
    ]
  }), []);

  const updateSliderOptions = useCallback((currentLibsArray) => {
    if (sliderRef.current && typeof sliderRef.current.slickSetOption === 'function') {
        const libsCount = currentLibsArray.length;
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
        let finalSlidesToScroll = Math.max(1, libsCount > 0 ? Math.min(baseSlidesToScroll, libsCount) : 1);
        if (libsCount > 0 && libsCount < responsiveSlidesToShow) finalSlidesToScroll = 1;
        try {
            sliderRef.current.slickSetOption("slidesToScroll", finalSlidesToScroll, false); 
            sliderRef.current.slickSetOption("infinite", libsCount >= responsiveSlidesToShow, true); 
            if (sliderRef.current.slickCurrentSlide && typeof sliderRef.current.slickCurrentSlide === 'function') {
                const currentSlide = sliderRef.current.slickCurrentSlide();
                 if (libsCount > 0 && currentSlide >= libsCount) {
                    sliderRef.current.slickGoTo(Math.max(0, libsCount - 1), true);
                } else if (libsCount === 0 && currentSlide !== 0) {
                    sliderRef.current.slickGoTo(0, true);
                }
            }
        } catch (e) { console.warn("Error in updateSliderOptions slickSetOption:", e); }
    }
  }, [sliderSettings]); 

  const fetchPaginatedLibraries = useCallback(async (pageToFetch) => {
    setLoadingSlider(true);
    setSliderError(null); 
    try {
      const response = await axiosInstance.get(`/kutuphane/getAllLibraries?page=${pageToFetch}&size=${ITEMS_PER_PAGE}`);
      const { content = [], totalPages: totalPagesFromApi = 0, totalElements: totalItemsFromApi = 0 } = response.data || {};
      setLibraries(content);
      setTotalPages(totalPagesFromApi); 
      setTotalItems(totalItemsFromApi);
      updateSliderOptions(content);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Kütüphaneler yüklenirken bir hata oluştu.";
      console.error("fetchPaginatedLibraries error:", errorMessage, error);
      setSliderError(errorMessage);
      setLibraries([]); setTotalPages(0); setTotalItems(0);
      updateSliderOptions([]);
    } finally {
      setLoadingSlider(false);
    }
  }, [updateSliderOptions]); 

  useEffect(() => {
    let pageToLoad = currentPage;
    if (isInitialRender.current) {
        isInitialRender.current = false;
        pageToLoad = 0; 
        if (currentPage !== 0) {
            setCurrentPage(0); 
            return; 
        }
    } else {
        if (totalPages > 0 && pageToLoad >= totalPages) {
            pageToLoad = totalPages - 1;
        }
        pageToLoad = Math.max(0, pageToLoad);
        if (pageToLoad !== currentPage) {
            setCurrentPage(pageToLoad); 
            return;
        }
    }
    fetchPaginatedLibraries(pageToLoad);
  }, [currentPage, totalPages, fetchPaginatedLibraries]);

  const handleAddFormClear = () => {
    if (window.confirm('Formu temizlemek istediğinizden emin misiniz? Girilmiş veriler silinecektir.')) {
      setNewLibraryName('');
      setNewLibraryAddress('');
      setAddFormError(null); 
    }
  };

  const handleAddFormSubmit = async (e) => {
    e.preventDefault();
    setAddFormError(null);
    if (!newLibraryName.trim() || !newLibraryAddress.trim()) {
      setAddFormError('Kütüphane adı ve adresi boş olamaz.');
      return;
    }
    setIsSubmittingAddForm(true);
    try {
      await axiosInstance.post('/kutuphane/saveLibrary', {
        name: newLibraryName.trim(),
        address: newLibraryAddress.trim(),
      });
      setNewLibraryName(''); 
      setNewLibraryAddress(''); 
      // handleLibraryAdded'ı doğrudan çağırıyoruz.
      if (currentPage !== 0) {
        setCurrentPage(0); 
      } else {
        fetchPaginatedLibraries(0); 
      }
      if (debouncedLibraryKeyword.trim()) { 
          fetchLibraryNameDropdownResults(debouncedLibraryKeyword);
      }
    } catch (error) {
      console.error('Kütüphane eklenirken hata:', error.response?.data || error);
      const errorMessage = error.response?.data?.message || error.message || "Kütüphane eklenirken bir hata oluştu.";
      setAddFormError(errorMessage);
    } finally {
      setIsSubmittingAddForm(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => { setDebouncedLibraryKeyword(librarySearchKeyword); }, 400);
    return () => clearTimeout(handler);
  }, [librarySearchKeyword]);

  const fetchLibraryNameDropdownResults = useCallback(async (keyword) => {
    const trimmedKeyword = keyword.trim();
    if (!trimmedKeyword) {
      setLibraryDropdownResults([]); setIsLibraryDropdownOpen(false); setLibrarySearchApiError(null); return;
    }
    setLibrarySearchApiLoading(true); setLibrarySearchApiError(null);
    try {
      const response = await axiosInstance.get('kutuphane/searchLibrary', { params: { name: trimmedKeyword } });
      const results = response.data || [];
      setLibraryDropdownResults(results);
      setIsLibraryDropdownOpen(true); 
    } catch (err) {
      setLibrarySearchApiError(err.response?.data?.message || err.message || "Arama sırasında hata.");
      setLibraryDropdownResults([]); setIsLibraryDropdownOpen(true);
    } finally {
      setLibrarySearchApiLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debouncedLibraryKeyword.trim()) {
      fetchLibraryNameDropdownResults(debouncedLibraryKeyword);
    } else {
      setIsLibraryDropdownOpen(false); setLibraryDropdownResults([]); setLibrarySearchApiError(null);
    }
  }, [debouncedLibraryKeyword, fetchLibraryNameDropdownResults]);

  useEffect(() => {
    const handleClickOutsideSearch = (event) => {
      if (librarySearchWrapperRef.current && !librarySearchWrapperRef.current.contains(event.target)) {
        setIsLibraryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideSearch);
    return () => document.removeEventListener("mousedown", handleClickOutsideSearch);
  }, []);
  
  /* // SEKME DEĞİŞİMİNDE YENİLEME YAPAN useEffect KALDIRILDI VEYA YORUMA ALINDI
  useEffect(() => {
    const handleDataRefresh = () => {
      if (document.visibilityState === 'visible' && !editingLibrary && !isSubmittingAddForm) { 
          fetchPaginatedLibraries(currentPage);
          if (debouncedLibraryKeyword.trim()) {
            fetchLibraryNameDropdownResults(debouncedLibraryKeyword);
          }
      }
    };
    window.addEventListener('focus', handleDataRefresh);
    document.addEventListener('visibilitychange', handleDataRefresh);
    return () => {
      window.removeEventListener('focus', handleDataRefresh);
      document.removeEventListener('visibilitychange', handleDataRefresh);
    };
  }, [currentPage, fetchPaginatedLibraries, debouncedLibraryKeyword, fetchLibraryNameDropdownResults, editingLibrary, isSubmittingAddForm]);
  */

  const handleDeleteLibrary = useCallback(async (id) => {
    if (window.confirm('Bu kütüphaneyi silmek istediğinizden emin misiniz?')) {
      setLoadingSlider(true); setSliderError(null);
      if (editingLibrary && editingLibrary.id === id) { setEditingLibrary(null); setEditFormError(null); }
      try {
        await axiosInstance.post(`/kutuphane/deleteLibrary/${id}`);
        alert('Kütüphane silindi!');
        const newTotalItems = Math.max(0, totalItems - 1);
        const newTotalPages = Math.ceil(newTotalItems / ITEMS_PER_PAGE);
        let pageToLoad = currentPage;
        if (libraries.length === 1 && newTotalItems > 0 && currentPage > 0) {
            pageToLoad = currentPage - 1;
        } else if (currentPage >= newTotalPages && newTotalPages > 0) { 
            pageToLoad = newTotalPages - 1;
        } else if (newTotalItems === 0) { 
            pageToLoad = 0;
        }
        pageToLoad = Math.max(0, Math.min(pageToLoad, newTotalPages > 0 ? newTotalPages - 1 : 0));
        if (pageToLoad !== currentPage || (libraries.length === 1 && newTotalItems === 0) ) {
            setCurrentPage(pageToLoad); 
        } else {
            fetchPaginatedLibraries(pageToLoad); 
        }
        if (isLibraryDropdownOpen && debouncedLibraryKeyword.trim()) {
          fetchLibraryNameDropdownResults(debouncedLibraryKeyword);
        }
      } catch (error) {
        const errMessage = error.response?.data?.message || error.message || "Kütüphane silinirken bir hata oluştu.";
        setSliderError(errMessage);
        alert(errMessage);
      } finally { setLoadingSlider(false); }
    }
  }, [currentPage, totalItems, fetchPaginatedLibraries, editingLibrary, isLibraryDropdownOpen, debouncedLibraryKeyword, fetchLibraryNameDropdownResults, libraries.length]);

  const handleUpdateLibrary = useCallback(async (e) => {
    e.preventDefault(); setEditFormError(null);
    if (!editingLibrary || !editingLibrary.name.trim() || !editingLibrary.address.trim()) {
      setEditFormError('Kütüphane adı ve adresi boş olamaz.'); return;
    }
    setLoadingSlider(true);
    try {
      await axiosInstance.put(`/kutuphane/updateLibrary/${editingLibrary.id}`, {
        name: editingLibrary.name.trim(),
        address: editingLibrary.address.trim(),
      });
      alert('Kütüphane başarıyla güncellendi!'); setEditingLibrary(null);
      fetchPaginatedLibraries(currentPage); 
      if (isLibraryDropdownOpen && debouncedLibraryKeyword.trim()) {
        fetchLibraryNameDropdownResults(debouncedLibraryKeyword);
      }
    } catch (error) {
      setEditFormError(error.response?.data?.message || error.message || "Kütüphane güncellenirken bir hata oluştu.");
    } finally { setLoadingSlider(false); }
  }, [editingLibrary, currentPage, fetchPaginatedLibraries, isLibraryDropdownOpen, debouncedLibraryKeyword, fetchLibraryNameDropdownResults]);

  const cancelEditing = useCallback(() => { setEditingLibrary(null); setEditFormError(null); }, []);
  
  const handleReturnHome = () => {
    const targetUrl = 'http://localhost:3000/home'; 
    if (editingLibrary || librarySearchKeyword.trim() || newLibraryName.trim() || newLibraryAddress.trim()) {
        if (window.confirm('Formda veya arama alanında girilmiş veriler var. Anasayfaya dönmek istediğinizden emin misiniz? Değişiklikleriniz kaybolabilir.')) {
            window.location.href = targetUrl;
        }
    } else {
        if (window.confirm('Anasayfaya dönmek istediğinizden emin misiniz?')) {
            window.location.href = targetUrl;
        }
    }
  };
  const handleKeyPressReturnHome = (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); handleReturnHome(); }};
  const handleLibrarySearchInputFocus = () => { if (librarySearchKeyword.trim() || libraryDropdownResults.length > 0) setIsLibraryDropdownOpen(true);};
  const handleLibraryDropdownItemClick = (library) => { setLibrarySearchKeyword(library.name); setIsLibraryDropdownOpen(false); };

  const handlePageChange = useCallback((newPage) => {
    setEditingLibrary(null); 
    if (!loadingSlider) {
        const pageToSet = Math.max(0, Math.min(newPage, totalPages > 0 ? totalPages - 1 : 0));
        if (currentPage !== pageToSet) {
            setCurrentPage(pageToSet);
        } else if (pageToSet === 0 && currentPage === 0 && totalPages === 0 && totalItems === 0) { 
            fetchPaginatedLibraries(0); 
        }
    }
  }, [totalPages, loadingSlider, currentPage, totalItems, fetchPaginatedLibraries]);

  const showLibrariesSlider = !loadingSlider && libraries.length > 0 && !sliderError;
  
  return (
    <div className="libraries-container">
      <style>{layoutCss}</style>
      <div 
        className="fancy-return-button" 
        onClick={handleReturnHome} 
        onKeyPress={handleKeyPressReturnHome} 
        role="button" 
        tabIndex="0" 
        title="Anasayfaya Dön" 
        aria-disabled={loadingSlider || editingLibrary !== null || isSubmittingAddForm}
      >
        <div className="button-image-overlay">Anasayfaya Dön</div>
      </div>
      
      <div className="library-form-and-search-platform">
        <div className="add-form-wrapper"> 
            <h4>Yeni Kütüphane Ekle</h4>
            {addFormError && !editingLibrary && <p className="error-message">{addFormError}</p>}
            <form onSubmit={handleAddFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}> {/* gap eklendi */}
              <input
                type="text"
                placeholder="Kütüphane Adı"
                value={newLibraryName}
                onChange={(e) => {
                  setNewLibraryName(e.target.value);
                  if (addFormError) setAddFormError(null);
                }}
                disabled={loadingSlider || editingLibrary !== null || isSubmittingAddForm}
                required
              />
              <textarea
                placeholder="Adres"
                value={newLibraryAddress}
                onChange={(e) => {
                  setNewLibraryAddress(e.target.value);
                  if (addFormError) setAddFormError(null);
                }}
                disabled={loadingSlider || editingLibrary !== null || isSubmittingAddForm}
                required
                rows={3} 
              />
              <div className="form-button-group">
                <button 
                  type="submit" 
                  className="form-add-button"
                  disabled={loadingSlider || editingLibrary !== null || isSubmittingAddForm || !newLibraryName.trim() || !newLibraryAddress.trim()}
                >
                  {isSubmittingAddForm ? 'Ekleniyor...' : 'Ekle'}
                </button>
                <button 
                  type="button" 
                  className="form-clear-button"
                  onClick={handleAddFormClear}
                  disabled={loadingSlider || editingLibrary !== null || isSubmittingAddForm}
                >
                  Temizle
                </button>
              </div>
            </form>
        </div>

        <div className="library-search-wrapper" ref={librarySearchWrapperRef}>
          <input type="text" placeholder="Kütüphane adıyla hızlı ara..." value={librarySearchKeyword} onChange={(e) => setLibrarySearchKeyword(e.target.value)} onFocus={handleLibrarySearchInputFocus} disabled={loadingSlider || editingLibrary !== null || isSubmittingAddForm}/>
          {isLibraryDropdownOpen && (
            <ul className="library-search-results-dropdown">
              {librarySearchApiLoading && <li className="dropdown-message-libraries">Yükleniyor...</li>}
              {!librarySearchApiLoading && librarySearchApiError && <li className="dropdown-message-libraries" style={{ color: 'red' }}>{librarySearchApiError}</li>}
              {!librarySearchApiLoading && !librarySearchApiError && libraryDropdownResults.length === 0 && debouncedLibraryKeyword.trim() && (<li className="dropdown-message-libraries">"{debouncedLibraryKeyword}" için sonuç yok.</li> )}
              {!librarySearchApiLoading && !librarySearchApiError && libraryDropdownResults.map((lib) => (<li key={lib.id} onMouseDown={() => handleLibraryDropdownItemClick(lib)}>{lib.name}</li>))}
            </ul>
          )}
        </div>
      </div>

      <div className="slider-and-edit-section">
           {loadingSlider && libraries.length === 0 && currentPage === 0 && !sliderError && <p className="status-message">Kütüphaneler Yükleniyor...</p>}
           {!loadingSlider && totalItems === 0 && !sliderError && <p className="status-message">Henüz hiç kütüphane eklenmemiş.</p>}
           {!loadingSlider && libraries.length === 0 && totalItems > 0 && currentPage < totalPages && !sliderError && <p className="status-message">Bu sayfada gösterilecek kütüphane bulunamadı.</p> }
           {sliderError && <p className="status-message error-message" style={{color: '#b30000'}}>{sliderError}</p>}

           {showLibrariesSlider && (
             <MemoizedSliderSection
                libraries={libraries}
                sliderSettings={sliderSettings}
                sliderRef={sliderRef}
                loadingSlider={loadingSlider}
                editingLibrary={editingLibrary}
                setEditingLibrary={setEditingLibrary}
                setEditFormError={setEditFormError}
                setAddFormError={setAddFormError}
                setSliderError={setSliderError}
                handleDeleteLibrary={handleDeleteLibrary}
             />
           )}
            {!loadingSlider && totalItems > 0 && totalPages > 1 && !editingLibrary && (
                <div className="pagination-controls">
                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={loadingSlider || currentPage === 0}>← Önceki</button>
                    <span>Sayfa {currentPage + 1} / {totalPages > 0 ? totalPages : 1}</span>
                    <button onClick={() => handlePageChange(currentPage + 1)} disabled={loadingSlider || (totalPages > 0 && currentPage >= totalPages - 1)}>Sonraki →</button>
                </div>
            )}
            {editingLibrary && (
              <div className="edit-form-container">
                <h4>Kütüphane Bilgilerini Güncelle: "{editingLibrary.name}"</h4>
                {editFormError && <p className="error-message">{editFormError}</p>}
                <form onSubmit={handleUpdateLibrary}>
                  <input type="text" placeholder="Kütüphane Adı" value={editingLibrary.name} onChange={(e) => { setEditingLibrary({ ...editingLibrary, name: e.target.value }); if (editFormError) setEditFormError(null);}} required disabled={loadingSlider} />
                  <textarea placeholder="Adres" value={editingLibrary.address} onChange={(e) => { setEditingLibrary({ ...editingLibrary, address: e.target.value }); if (editFormError) setEditFormError(null);}} required disabled={loadingSlider} rows={3}/>
                  <div className="button-group"> 
                      <button type="submit" className="update-button" disabled={loadingSlider || !editingLibrary.name.trim() || !editingLibrary.address.trim()}>{loadingSlider ? 'Güncelleniyor...' : 'Güncelle'}</button>
                      <button type="button" className="cancel-button" onClick={cancelEditing} disabled={loadingSlider}>İptal</button>
                  </div>
                </form>
              </div>
            )}
      </div>
    </div>
  );
};

export default LibraryList;