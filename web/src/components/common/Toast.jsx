// Archivo: src/components/common/Toast.jsx

import React, { useEffect, useState } from 'react';
import './Toast.css';

export const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-content">
        {type === 'success' && <span className="icon">✓</span>}
        {type === 'error' && <span className="icon">✗</span>}
        {type === 'info' && <span className="icon">ℹ</span>}
        {type === 'warning' && <span className="icon">⚠</span>}
        <p>{message}</p>
      </div>
    </div>
  );
};