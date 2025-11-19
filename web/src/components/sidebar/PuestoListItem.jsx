// Archivo: src/components/sidebar/PuestoListItem.jsx

import React from 'react';
import './PuestoListItem.css';

export const PuestoListItem = ({ puesto, onClick, isSelected }) => {
  const getEstadoIcon = (estado) => {
    return estado === 'ocupado' ? '●' : '○';
  };

  const getEstadoLabel = (estado) => {
    return estado === 'ocupado' ? 'Ocupado' : 'Libre';
  };

  return (
    <div
      className={`puesto-list-item ${puesto.estado} ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="puesto-number">#{puesto.numero}</div>
      
      <div className="puesto-details">
        <p className="puesto-name">{puesto.nombre_puesto || 'Sin asignar'}</p>
        <p className="puesto-vendor">{puesto.cliente_nombre || 'Disponible'}</p>
      </div>

      <div className={`puesto-status ${puesto.estado}`}>
        <span className="icon">{getEstadoIcon(puesto.estado)}</span>
        <span className="label">{getEstadoLabel(puesto.estado)}</span>
      </div>
    </div>
  );
};