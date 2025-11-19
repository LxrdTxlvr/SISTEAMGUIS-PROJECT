import React, { useState, useEffect } from 'react';
import { MapContainer } from '../components/map/MapContainer';
import { PuestoModal } from '../components/modals/PuestoModal'; // Usar tu PuestoForm aquí
import { usePuestos } from '../hooks/usePuestos';
import { supabase } from '../services/supabaseClient';

export const DashboardPage = () => {
  const { puestos, loading, updatePuestoEstado } = usePuestos();
  const [selectedPuesto, setSelectedPuesto] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handlePuestoClick = (puesto) => {
    setSelectedPuesto(puesto);
    setModalOpen(true);
  };

  const handleSave = async (datosFormulario) => {
    try {
      // 1. Guardar cliente/asignación en Supabase
      // 2. Actualizar estado del puesto
      await updatePuestoEstado(selectedPuesto.id, 'ocupado');
      setModalOpen(false);
    } catch (error) {
      console.error("Error guardando:", error);
    }
  };

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <MapContainer 
        puestos={puestos} 
        onPuestoClick={handlePuestoClick} 
      />
      
      {/* Reutiliza tu PuestoForm dentro de un Modal */}
      {modalOpen && (
        <div className="modal-overlay">
           <div className="modal-content">
              <PuestoForm 
                puesto={selectedPuesto} 
                onSubmit={handleSave} 
                onCancel={() => setModalOpen(false)} 
              />
           </div>
        </div>
      )}
    </div>
  );
};