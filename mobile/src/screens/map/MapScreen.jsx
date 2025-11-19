import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { supabase } from '../services/supabaseClient'; // Reutiliza tu cliente existente

export default function MapScreen() {
  const [puestos, setPuestos] = useState([]);

  // 1. Cargar puestos desde LA MISMA base de datos
  useEffect(() => {
    const fetchPuestos = async () => {
      const { data, error } = await supabase.from('puestos').select('*');
      if (data) setPuestos(data);
    };
    
    fetchPuestos();
    
    // Suscripción Real-time: Si alguien cambia algo en la Web, el celular se actualiza solo
    const channel = supabase
      .channel('puestos-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'puestos' }, 
        (payload) => {
          console.log('Cambio detectado!', payload);
          fetchPuestos(); // Recargar
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 20.6596,
          longitude: -87.0739,
          latitudeDelta: 0.002,
          longitudeDelta: 0.002,
        }}
      >
        {puestos.map((puesto) => (
          <Marker
            key={puesto.id}
            coordinate={{ lat: puesto.latitud, longitude: puesto.longitud }}
            pinColor={puesto.estado === 'ocupado' ? 'blue' : 'green'}
            onPress={() => Alert.alert(`Puesto #${puesto.numero}`, `Estado: ${puesto.estado}`)}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: '100%', height: '100%' },
});