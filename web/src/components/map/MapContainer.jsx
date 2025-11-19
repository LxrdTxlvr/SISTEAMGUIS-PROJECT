import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = { width: '100%', height: '100%' };
// Coordenadas de tu tianguis (sacadas de tu .env)
const center = { lat: 20.6596, lng: -87.0739 }; 

export const MapContainer = ({ puestos, onPuestoClick }) => {
  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={18}>
        {puestos.map(puesto => (
          <Marker
            key={puesto.id}
            position={{ lat: puesto.latitud, lng: puesto.longitud }}
            onClick={() => onPuestoClick(puesto)}
            // Icono verde si libre, azul si ocupado
            icon={puesto.estado === 'libre' 
              ? 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
              : 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};