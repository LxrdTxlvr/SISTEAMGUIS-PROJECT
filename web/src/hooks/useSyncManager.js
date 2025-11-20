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