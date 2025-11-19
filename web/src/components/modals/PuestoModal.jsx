import React from 'react';
import { PuestoForm } from './PuestoForm'; // Ya tienes este archivo
import './PuestoModal.css'; // Crearemos el CSS abajo

export const PuestoModal = ({ puesto, onSubmit, onCancel, loading }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Puesto #{puesto?.numero}</h2>
          <button onClick={onCancel} className="close-btn">×</button>
        </div>
        <div className="modal-body">
          <PuestoForm
            puesto={puesto}
            onSubmit={onSubmit}
            onCancel={onCancel}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};