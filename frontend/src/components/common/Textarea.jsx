import React from 'react';
import './Input.css';

const Textarea = ({
  label,
  name,
  value,
  onChange,
  placeholder = '',
  required = false,
  error = '',
  disabled = false,
  rows = 4,
  className = '',
  ...props
}) => {
  return (
    <div className={`input-group ${className}`}>
      {label && (
        <label htmlFor={name} className="input-group__label">
          {label}
          {required && <span className="input-group__required"> *</span>}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className={`input-group__field ${error ? 'input-group__field--error' : ''}`}
        {...props}
      />
      {error && <span className="input-group__error">{error}</span>}
    </div>
  );
};

export default Textarea;
