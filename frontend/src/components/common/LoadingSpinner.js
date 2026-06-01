import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'md', fullPage = false }) => {
  if (fullPage) {
    return (
      <div className="spinner-fullpage">
        <div className={`spinner spinner--${size}`}></div>
      </div>
    );
  }

  return <div className={`spinner spinner--${size}`}></div>;
};

export default LoadingSpinner;
