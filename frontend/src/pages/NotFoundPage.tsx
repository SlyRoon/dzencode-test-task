import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './NotFoundPage.css';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">{t('notFound.title')}</h2>
        <p className="not-found-text">{t('notFound.text')}</p>
        <button className="not-found-btn" onClick={() => navigate('/income')}>
          {t('notFound.back')}
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
