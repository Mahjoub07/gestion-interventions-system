import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found">
      <div className="not-found__content">
        <h1 className="not-found__code">404</h1>
        <h2 className="not-found__title">Page non trouvée</h2>
        <p className="not-found__text">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <Link to="/" className="not-found__link">
          ← Retour au tableau de bord
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
