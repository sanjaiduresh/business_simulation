import React, { createContext, useContext, useState, useEffect } from 'react';
import { SimulationEngine } from './simulation-engine';
import { SimulationFactory } from './simulation-factory';
import { SimulationState, Company, Product, Decision } from './types';

// Define the context type
interface SimulationContextType {
  simulation: SimulationEngine | null;
  state: SimulationState | null;
  loading: boolean;
  error: string | null;
  userCompany: Company | null;
  companyProducts: Product[];
  advancePeriod: () => void;
  submitDecision: (decision: Omit<Decision, 'id' | 'processed' | 'processedAt'>) => void;
  refreshState: () => void;
}

// Create the context with default values
const SimulationContext = createContext<SimulationContextType>({
  simulation: null,
  state: null,
  loading: true,
  error: null,
  userCompany: null,
  companyProducts: [],
  advancePeriod: () => {},
  submitDecision: () => {},
  refreshState: () => {}
});

// Hook to use the simulation context
export const useSimulation = () => useContext(SimulationContext);

// Provider component
export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [simulation, setSimulation] = useState<SimulationEngine | null>(null);
  const [state, setState] = useState<SimulationState | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userCompany, setUserCompany] = useState<Company | null>(null);
  const [companyProducts, setCompanyProducts] = useState<Product[]>([]);

  // Initialize simulation
  useEffect(() => {
    try {
      // Create a demo simulation
      const sim = SimulationFactory.createDemoSimulation();
      setSimulation(sim);
      
      // Get initial state
      const initialState = sim.getState();
      setState(initialState);
      
      // Set user company (in a real app, this would be based on user authentication)
      const company = initialState.companies.find(c => c.id === 'company_demo');
      setUserCompany(company || null);
      
      // Get company products
      if (company) {
        const products = initialState.products.filter(p => p.companyId === company.id);
        setCompanyProducts(products);
      }
      
      setLoading(false);
    } catch (err) {
      setError('Failed to initialize simulation: ' + (err instanceof Error ? err.message : String(err)));
      setLoading(false);
    }
  }, []);

  // Function to advance to the next period
  const advancePeriod = () => {
    if (!simulation) return;
    
    try {
      // Process all decisions and advance to next period
      const newState = simulation.advancePeriod();
      setState(newState);
      
      // Update user company and products
      if (userCompany) {
        const updatedCompany = newState.companies.find(c => c.id === userCompany.id);
        setUserCompany(updatedCompany || null);
        
        if (updatedCompany) {
          const updatedProducts = newState.products.filter(p => p.companyId === updatedCompany.id);
          setCompanyProducts(updatedProducts);
        }
      }
    } catch (err) {
      setError('Failed to advance period: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  // Function to submit a decision
  const submitDecision = (decision: Omit<Decision, 'id' | 'processed' | 'processedAt'>) => {
    if (!simulation || !userCompany) return;
    
    try {
      // Submit the decision
      simulation.submitDecision(userCompany.id, decision);
      
      // Refresh state
      refreshState();
    } catch (err) {
      setError('Failed to submit decision: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  // Function to refresh the state
  const refreshState = () => {
    if (!simulation) return;
    
    try {
      // Get updated state
      const updatedState = simulation.getState();
      setState(updatedState);
      
      // Update user company and products
      if (userCompany) {
        const updatedCompany = updatedState.companies.find(c => c.id === userCompany.id);
        setUserCompany(updatedCompany || null);
        
        if (updatedCompany) {
          const updatedProducts = updatedState.products.filter(p => p.companyId === updatedCompany.id);
          setCompanyProducts(updatedProducts);
        }
      }
    } catch (err) {
      setError('Failed to refresh state: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  // Context value
  const value = {
    simulation,
    state,
    loading,
    error,
    userCompany,
    companyProducts,
    advancePeriod,
    submitDecision,
    refreshState
  };

  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  );
};
