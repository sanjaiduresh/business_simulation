import React from 'react';
import { useSimulation } from '../simulation/simulation-context';
import { Decision } from '../simulation/types';

export function useDecisionSubmission() {
  const { submitDecision, userCompany, state } = useSimulation();
  
  // Submit product development decision
  const submitProductDevelopment = (data: any) => {
    if (!userCompany || !state) return;
    
    const decision: Omit<Decision, 'id' | 'processed' | 'processedAt'> = {
      companyId: userCompany.id,
      period: state.currentPeriod,
      type: 'product_development',
      data: JSON.stringify(data),
      submittedAt: new Date().toISOString()
    };
    
    submitDecision(decision);
  };
  
  // Submit pricing decision
  const submitPricing = (data: any) => {
    if (!userCompany || !state) return;
    
    const decision: Omit<Decision, 'id' | 'processed' | 'processedAt'> = {
      companyId: userCompany.id,
      period: state.currentPeriod,
      type: 'pricing',
      data: JSON.stringify(data),
      submittedAt: new Date().toISOString()
    };
    
    submitDecision(decision);
  };
  
  // Submit production decision
  const submitProduction = (data: any) => {
    if (!userCompany || !state) return;
    
    const decision: Omit<Decision, 'id' | 'processed' | 'processedAt'> = {
      companyId: userCompany.id,
      period: state.currentPeriod,
      type: 'production',
      data: JSON.stringify(data),
      submittedAt: new Date().toISOString()
    };
    
    submitDecision(decision);
  };
  
  // Submit marketing decision
  const submitMarketing = (data: any) => {
    if (!userCompany || !state) return;
    
    const decision: Omit<Decision, 'id' | 'processed' | 'processedAt'> = {
      companyId: userCompany.id,
      period: state.currentPeriod,
      type: 'marketing',
      data: JSON.stringify(data),
      submittedAt: new Date().toISOString()
    };
    
    submitDecision(decision);
  };
  
  // Submit research decision
  const submitResearch = (data: any) => {
    if (!userCompany || !state) return;
    
    const decision: Omit<Decision, 'id' | 'processed' | 'processedAt'> = {
      companyId: userCompany.id,
      period: state.currentPeriod,
      type: 'research',
      data: JSON.stringify(data),
      submittedAt: new Date().toISOString()
    };
    
    submitDecision(decision);
  };
  
  // Submit human resources decision
  const submitHumanResources = (data: any) => {
    if (!userCompany || !state) return;
    
    const decision: Omit<Decision, 'id' | 'processed' | 'processedAt'> = {
      companyId: userCompany.id,
      period: state.currentPeriod,
      type: 'human_resources',
      data: JSON.stringify(data),
      submittedAt: new Date().toISOString()
    };
    
    submitDecision(decision);
  };
  
  // Submit finance decision
  const submitFinance = (data: any) => {
    if (!userCompany || !state) return;
    
    const decision: Omit<Decision, 'id' | 'processed' | 'processedAt'> = {
      companyId: userCompany.id,
      period: state.currentPeriod,
      type: 'finance',
      data: JSON.stringify(data),
      submittedAt: new Date().toISOString()
    };
    
    submitDecision(decision);
  };
  
  return {
    submitProductDevelopment,
    submitPricing,
    submitProduction,
    submitMarketing,
    submitResearch,
    submitHumanResources,
    submitFinance
  };
}
