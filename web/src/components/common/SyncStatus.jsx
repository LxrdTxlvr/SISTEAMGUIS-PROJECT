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