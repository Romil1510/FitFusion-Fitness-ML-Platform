import React, { createContext, useContext, useState, useCallback } from 'react';

const DataSyncContext = createContext();

export const useDataSync = () => {
  const context = useContext(DataSyncContext);
  if (!context) {
    throw new Error('useDataSync must be used within DataSyncProvider');
  }
  return context;
};

export const DataSyncProvider = ({ children }) => {
  const [refreshTriggers, setRefreshTriggers] = useState({});

  // Trigger refresh for specific component types
  const triggerRefresh = useCallback((componentType, data = {}) => {
    const timestamp = Date.now();
    setRefreshTriggers(prev => ({
      ...prev,
      [componentType]: {
        timestamp,
        ...data
      }
    }));
    console.log(`🔄 Triggered refresh for ${componentType}`, data);
  }, []);

  // Check if component should refresh
  const shouldRefresh = useCallback((componentType, lastChecked) => {
    const trigger = refreshTriggers[componentType];
    return trigger && trigger.timestamp > lastChecked;
  }, [refreshTriggers]);

  const value = {
    triggerRefresh,
    shouldRefresh,
    refreshTriggers
  };

  return (
    <DataSyncContext.Provider value={value}>
      {children}
    </DataSyncContext.Provider>
  );
};
