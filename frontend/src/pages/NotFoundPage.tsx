import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFoundPage.css';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Страница не найдена</h2>
        <p className="not-found-text">
          Кажется, вы заблудились. Запрашиваемая страница не существует или была перемещена.
        </p>
        <button className="not-found-btn" onClick={() => navigate('/orders')}>
          Вернуться к приходам
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
