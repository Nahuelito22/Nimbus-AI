import React, { useState, useEffect } from 'react';
import { fetchNews } from '../../api/news';

const NewsSection = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getNews = async () => {
      try {
        setLoading(true);
        const data = await fetchNews('clima');
        setNews(data);
      } catch (err) {
        setError('No se pudieron cargar las noticias.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getNews();
  }, []);

  const NewsItem = ({ article }) => (
    <div className="border-b pb-4">
      <h3 className="font-bold text-lg mb-2">{article.titulo}</h3>
      <p className="text-gray-600 mb-3 text-sm">{article.descripcion}</p>
      <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm font-semibold">
        Leer más en {article.fuente}
      </a>
    </div>
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Noticias Meteorológicas</h2>
      <div className="space-y-4">
        {loading && <p>Cargando noticias...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && news.length === 0 && (
          <p>No hay noticias disponibles en este momento.</p>
        )}
        {!loading && !error && news.map((article, index) => (
          <NewsItem key={index} article={article} />
        ))}
      </div>
    </div>
  );
};

export default NewsSection;
