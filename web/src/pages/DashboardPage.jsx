import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer } from '../components/map/MapContainer';
import { PuestoModal } from '../components/modals/PuestoModal';
import { PuestoListItem } from '../components/sidebar/PuestoListItem'; // Asegúrate de tener este componente
import { SyncStatus } from '../components/common/SyncStatus';
import { usePuestos } from '../hooks/usePuestos';
import { authService } from '../services/authService';
import './DashboardPage.css'; // Crearemos este archivo en el paso 2

export const DashboardPage = () => {
  const { puestos, loading, error, updatePuestoEstado } = usePuestos();
  const [selectedPuesto, setSelectedPuesto] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [guardando, setGuardando] = useState(false);
  const navigate = useNavigate();

  // Filtrar puestos basado en la búsqueda
  const puestosFiltrados = useMemo(() => {
    if (!busqueda) return puestos;
    const lowerBusqueda = busqueda.toLowerCase();
    return puestos.filter(p => 
      p.numero.toString().includes(lowerBusqueda) ||
      (p.cliente && p.cliente.nombre.toLowerCase().includes(lowerBusqueda)) ||
      (p.cliente && p.cliente.nombre_puesto.toLowerCase().includes(lowerBusqueda))
    );
  }, [puestos, busqueda]);

  // Manejar click en un puesto (desde mapa o lista)
  const handlePuestoClick = (puesto) => {
    setSelectedPuesto(puesto);
    setModalOpen(true);
  };

  // Guardar datos del formulario
  const handleSave = async (datosFormulario) => {
    setGuardando(true);
    try {
      // Aquí iría la lógica para guardar en la tabla 'clientes' o 'asignaciones'
      // Por ahora actualizamos el estado del puesto como ejemplo principal
      const nuevoEstado = datosFormulario.nombre ? 'ocupado' : 'libre';
      await updatePuestoEstado(selectedPuesto.id, nuevoEstado);
      
      setModalOpen(false);
      setSelectedPuesto(null);
    } catch (error) {
      console.error("Error guardando:", error);
      alert("Error al guardar los cambios");
    } finally {
      setGuardando(false);
    }
  };

  // Cerrar sesión
  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/login');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  if (loading) return <div className="loading-screen">Cargando sistema...</div>;
  if (error) return <div className="error-screen">Error: {error.message}</div>;

  return (
    <div className="dashboard-container">
      {/* COMPONENTE 1: SIDEBAR (Izquierda) */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <h2>Sisteamguis</h2>
          <div className="search-box">
            <input 
              type="text" 
              placeholder="Buscar puesto o vendedor..." 
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>

        <div className="puestos-list">
          {puestosFiltrados.length > 0 ? (
            puestosFiltrados.map(puesto => (
              <PuestoListItem
                key={puesto.id}
                puesto={puesto}
                onClick={() => handlePuestoClick(puesto)}
                isSelected={selectedPuesto?.id === puesto.id}
              />
            ))
          ) : (
            <div className="no-results">No se encontraron puestos</div>
          )}
        </div>

        <div className="sidebar-footer">
          <div className="stats">
            <span>Total: {puestos.length}</span>
            <span>Ocupados: {puestos.filter(p => p.estado === 'ocupado').length}</span>
          </div>
          <button onClick={handleLogout} className="btn-logout">
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* COMPONENTE 2: MAPA (Derecha) */}
      <main className="dashboard-map">
        <MapContainer 
          puestos={puestosFiltrados} 
          onPuestoClick={handlePuestoClick} 
        />
        <SyncStatus /> {/* Indicador flotante de sincronización */}
      </main>

      {/* COMPONENTE 3: MODAL */}
      {modalOpen && selectedPuesto && (
        <PuestoModal
          puesto={selectedPuesto}
          onSubmit={handleSave}
          onCancel={() => setModalOpen(false)}
          loading={guardando}
        />
      )}
    </div>
  );
};