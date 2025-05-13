import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/Auth/LoginPage';
import BookList from './components/Books/BookList';
import LibraryList from './components/Libraries/LibraryList';
import CitizenList from './components/Citizens/CitizenList';
import BorrowedList from './components/Borrowed/BorrowedList';
import PrivateRoute from './components/Auth/PrivateRoute';
import Home from './components/homepage/Home'; // Yeni Home bileşenini ekliyoruz
import AuthorList from './components/Authors/AuthorList';
import LibraryBookList from './components/librarybooks/LibraryBooks'; // Yeni LibraryBookList bileşenini ekliyoruz
import LibraryAuthors from './components/libraryauthors/LibraryAuthors'; // LibraryAuthors bileşenini ekliyoruz
import './styles/turkishMythology.css';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Giriş sonrası ana sayfa */}
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />

        {/* Korunan Yollar */}
        <Route path="/books" element={<PrivateRoute><BookList /></PrivateRoute>} />
        <Route path="/libraries" element={<PrivateRoute><LibraryList /></PrivateRoute>} />
        <Route path="/citizens" element={<PrivateRoute><CitizenList /></PrivateRoute>} />
        <Route path="/borrowed" element={<PrivateRoute><BorrowedList /></PrivateRoute>} />
        <Route path="/authors" element={<PrivateRoute><AuthorList /></PrivateRoute>} />
        
        {/* Yeni rota: Kütüphane Kitapları */}
        <Route path="/library-books" element={<PrivateRoute><LibraryBookList /></PrivateRoute>} />
        
        {/* Yeni rota: Kütüphane Yazarları */}
        <Route path="/library-authors" element={<PrivateRoute><LibraryAuthors /></PrivateRoute>} />
      </Routes>
    </Router>
  );
};

export default App;
