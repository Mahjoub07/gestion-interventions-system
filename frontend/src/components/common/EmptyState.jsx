import React from 'react';
import './EmptyState.css';

const EmptyState = ({ title = 'Aucune donnée', message = 'Il n\'y a pas encore de données à afficher.' }) => {
  return (
    <div className="empty-state">
      <svg className="empty-state__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="9" y1="9" x2="15" y2="9" />
        <line x1="9" y1="13" x2="15" y2="13" />
        <line x1="9" y1="17" x2="11" y2="17" />
      </svg>
      <h3 className="empty-state__title">{title}</h3>
      <p className="empty-state__message">{message}</p>
    </div>
  );
};

export default EmptyState;
