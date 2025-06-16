import { createContext, useContext } from 'react';
import { DatabaseService, createDatabaseService } from './database';

// Create a context for the database service
const DatabaseContext = createContext<DatabaseService | null>(null);

// Provider component
export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  // Create a mock database service for now
  // In production, this would use the D1 database from Cloudflare
  const databaseService = createDatabaseService();
  
  return (
    <DatabaseContext.Provider value={databaseService}>
      {children}
    </DatabaseContext.Provider>
  );
}

// Hook to use the database service
export function useDatabase() {
  const context = useContext(DatabaseContext);
  
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  
  return context;
}
