import React, { useState, useCallback, useRef } from 'react';
import './SearchBar.css';

const SearchBar = ({ placeholder = 'Rechercher...', onSearch, value = '' }) => {
  const [searchValue, setSearchValue] = useState(value);
  const timeoutRef = useRef(null);

  const debouncedSearch = useCallback((val) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => onSearch(val), 300);
  }, [onSearch]);

  const handleChange = (e) => {
    const val = e.target.value;
    setSearchValue(val);
    debouncedSearch(val);
  };

  return (
    <div className="search-bar">
      <svg className="search-bar__icon" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
      </svg>
      <input
        type="text"
        value={searchValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="search-bar__input"
      />
      {searchValue && (
        <button
          className="search-bar__clear"
          onClick={() => {
            setSearchValue('');
            onSearch('');
          }}
          aria-label="Effacer"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default SearchBar;
