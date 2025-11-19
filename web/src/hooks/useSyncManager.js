// Archivo: src/hooks/useSyncManager.js

import { useEffect, useState } from 'react';
import { useNetworkStatus } from './useNetworkStatus';
import { syncService } from '../services/syncService';

export const useSyncManager = () => {
  const isOnline = useNetworkStatus();
  const [syncStatus, setSyncStatus] = useState('idle'); // idle, syncing, success, error
  const [lastSync, setLastSync] = useState(null);

  useEffect(() => {
    if (!isOnline) return;

    setSyncStatus('syncing');
    
    syncService.syncPendingChanges()
      .then(() => {
        setSyncStatus('success');
        setLastSync(new Date());
        setTimeout(() => setSyncStatus('idle'), 3000);
      })
      .catch(error => {
        setSyncStatus('error');
        console.error('Sync error:', error);
        setTimeout(() => setSyncStatus('idle'), 5000);
      });
  }, [isOnline]);

  return { syncStatus, lastSync, isOnline };
};

// ============================================
// 2. COMPONENTE DE INDICADOR DE SINCRONIZACIÓN
// ============================================
// Archivo: src/components/common/SyncStatus.jsx

import React from 'react';
import { useSyncManager } from '../../hooks/useSyncManager';
import './SyncStatus.css';

export const SyncStatus = () => {
  const { syncStatus, lastSync, isOnline } = useSyncManager();

  return (
    <div className={`sync-status sync-${syncStatus}`}>
      <div className="sync-indicator">
        {syncStatus === 'syncing' && (
          <span className="spinner">⟳</span>
        )}
        {syncStatus === 'success' && (
          <span className="success">✓</span>
        )}
        {syncStatus === 'error' && (
          <span className="error">✗</span>
        )}
      </div>
      
      <div className="sync-info">
        {!isOnline && <p className="offline">Modo Offline</p>}
        {isOnline && syncStatus === 'syncing' && <p>Sincronizando...</p>}
        {isOnline && syncStatus === 'success' && (
          <p>Última sync: {lastSync?.toLocaleTimeString()}</p>
        )}
        {isOnline && syncStatus === 'error' && <p>Error en sincronización</p>}
      </div>
    </div>
  );
};