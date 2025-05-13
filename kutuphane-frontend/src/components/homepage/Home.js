import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <div className="ilayada-container p-6">
        <h1 className="text-3xl font-bold mb-4">İLİADA KÜTÜPHANESİ</h1>
      </div>

      <div className="module-container p-6 mt-4">
        <p className="mb-6 text-left text-lg font-medium">Lütfen gitmek istediğin modülü seç:</p>

        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          <button onClick={() => navigate("/books")} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Kitaplar
          </button>
          <button onClick={() => navigate("/libraries")} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Kütüphaneler
          </button>
          <button onClick={() => navigate("/citizens")} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
            Vatandaşlar
          </button>
          <button onClick={() => navigate("/authors")} className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
            Yazarlar
          </button>
          <button onClick={() => navigate("/borrowed")} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Kitap Kiralama
          </button>
          <button onClick={() => navigate("/library-books")} className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600">
            Seçilen Kütüphane Kitapları
          </button>
          <button onClick={() => navigate("/library-authors")} className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600">
            Seçilen Kütüphane Yazarları
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;

