// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/Auth/LoginPage';
import Register from './components/Auth/Register'; // Register bileşenini import ediyoruz
import BookList from './components/Books/BookList';
import LibraryList from './components/Libraries/LibraryList';
import CitizenList from './components/Citizens/CitizenList';
import BorrowedList from './components/Borrowed/BorrowedList';
import PrivateRoute from './components/Auth/PrivateRoute';
import Home from './components/homepage/Home';
import AuthorList from './components/Authors/AuthorList';
import LibraryBookList from './components/librarybooks/LibraryBooks';
import LibraryAuthors from './components/libraryauthors/LibraryAuthors';
import './styles/turkishMythology.css';

import { AuthProvider } from './context/AuthContext'; // AuthProvider'ı import edin

const App = () => {
  return (
    <AuthProvider> {/* Bütün uygulamayı (veya Router'ı) AuthProvider ile sarmalayın */}
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />

          {/* Giriş sonrası ana sayfa */}
          <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />

          {/* Korunan Yollar */}
          <Route path="/books" element={<PrivateRoute><BookList /></PrivateRoute>} />
          <Route path="/libraries" element={<PrivateRoute><LibraryList /></PrivateRoute>} />
          <Route path="/citizens" element={<PrivateRoute><CitizenList /></PrivateRoute>} />
          <Route path="/borrowed" element={<PrivateRoute><BorrowedList /></PrivateRoute>} />
          <Route path="/authors" element={<PrivateRoute><AuthorList /></PrivateRoute>} />
          
          <Route path="/library-books" element={<PrivateRoute><LibraryBookList /></PrivateRoute>} />
          
          <Route path="/library-authors" element={<PrivateRoute><LibraryAuthors /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;