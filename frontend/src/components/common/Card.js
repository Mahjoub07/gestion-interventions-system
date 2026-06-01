import React from 'react';
import './Card.css';

const Card = ({ title, subtitle, children, actions, className = '', noPadding = false }) => {
  return (
    <div className={`card ${className}`}>
      {(title || actions) && (
        <div className="card__header">
          <div className="card__header-content">
            {title && <h2 className="card__title">{title}</h2>}
            {subtitle && <p className="card__subtitle">{subtitle}</p>}
          </div>
          {actions && <div className="card__actions">{actions}</div>}
        </div>
      )}
      <div className={`card__body ${noPadding ? 'card__body--no-padding' : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default Card;
