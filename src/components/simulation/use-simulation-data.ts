import React from 'react';
import { useSimulation } from '../simulation/simulation-context';
import { PerformanceResults, ProductPerformance, MarketConditions, Event } from '../simulation/types';

export function useSimulationData() {
  const { state, userCompany, companyProducts } = useSimulation();
  
  // Get company performance
  const getCompanyPerformance = (period?: number): PerformanceResults | null => {
    if (!state || !userCompany) return null;
    
    if (period !== undefined) {
      return state.performanceResults.find(
        pr => pr.companyId === userCompany.id && pr.period === period
      ) || null;
    }

    // Get the most recent performance results
    return state.performanceResults
      .filter(pr => pr.companyId === userCompany.id)
      .sort((a, b) => b.period - a.period)[0] || null;
  };
  
  // Get all company performance history
  const getCompanyPerformanceHistory = (): PerformanceResults[] => {
    if (!state || !userCompany) return [];
    
    return state.performanceResults
      .filter(pr => pr.companyId === userCompany.id)
      .sort((a, b) => a.period - b.period);
  };
  
  // Get product performance
  const getProductPerformance = (productId: string, period?: number): ProductPerformance | null => {
    if (!state) return null;
    
    if (period !== undefined) {
      return state.productPerformance.find(
        pp => pp.productId === productId && pp.period === period
      ) || null;
    }

    // Get the most recent product performance
    return state.productPerformance
      .filter(pp => pp.productId === productId)
      .sort((a, b) => b.period - a.period)[0] || null;
  };
  
  // Get all product performance history
  const getProductPerformanceHistory = (productId: string): ProductPerformance[] => {
    if (!state) return [];
    
    return state.productPerformance
      .filter(pp => pp.productId === productId)
      .sort((a, b) => a.period - b.period);
  };
  
  // Get market conditions
  const getMarketConditions = (period?: number): MarketConditions | null => {
    if (!state) return null;
    
    if (period !== undefined) {
      return state.marketConditions.find(mc => mc.period === period) || null;
    }

    // Get the most recent market conditions
    return state.marketConditions
      .sort((a, b) => b.period - a.period)[0] || null;
  };
  
  // Get market events
  const getMarketEvents = (period?: number): Event[] => {
    if (!state) return [];
    
    if (period !== undefined) {
      return state.events.filter(e => e.period === period);
    }

    // Get all events
    return state.events.sort((a, b) => a.period - b.period);
  };
  
  // Get current period
  const getCurrentPeriod = (): number => {
    if (!state) return 0;
    return state.currentPeriod;
  };
  
  // Get competitor data
  const getCompetitors = () => {
    if (!state || !userCompany) return [];
    
    // In a real app, this would return actual competitor data
    // For now, we'll return mock data
    return [
      {
        id: 'competitor_1',
        name: 'Alpha Corp',
        marketShare: 24.5,
        growth: 3.2,
        strengths: ['Brand Recognition', 'Product Quality', 'Innovation'],
        weaknesses: ['High Prices', 'Limited Product Range'],
        strategy: 'Differentiation',
        products: [
          { name: 'Alpha Premium', segment: 'premium', price: 320, quality: 8.7, share: 35 },
          { name: 'Alpha Standard', segment: 'mid-range', price: 180, quality: 7.2, share: 22 }
        ]
      },
      {
        id: 'competitor_2',
        name: 'Beta Inc',
        marketShare: 19.8,
        growth: 4.5,
        strengths: ['Competitive Pricing', 'Wide Distribution', 'Marketing'],
        weaknesses: ['Average Quality', 'Customer Service'],
        strategy: 'Cost Leadership',
        products: [
          { name: 'Beta Elite', segment: 'premium', price: 280, quality: 8.2, share: 28 },
          { name: 'Beta Standard', segment: 'mid-range', price: 160, quality: 6.8, share: 18 },
          { name: 'Beta Basic', segment: 'budget', price: 70, quality: 5.1, share: 15 }
        ]
      },
      {
        id: 'competitor_3',
        name: 'Gamma Ltd',
        marketShare: 15.2,
        growth: -0.8,
        strengths: ['Low Prices', 'Efficiency', 'Market Coverage'],
        weaknesses: ['Product Quality', 'Innovation', 'Brand Perception'],
        strategy: 'Cost Focus',
        products: [
          { name: 'Gamma Standard', segment: 'mid-range', price: 140, quality: 6.2, share: 14 },
          { name: 'Gamma Basic', segment: 'budget', price: 60, quality: 4.8, share: 25 }
        ]
      }
    ];
  };
  
  // Get market segments
  const getMarketSegments = () => {
    if (!state) return [];
    
    const marketConditions = getMarketConditions();
    if (!marketConditions) return [];
    
    const segmentDistribution = JSON.parse(marketConditions.segmentDistribution);
    const consumerPreferences = JSON.parse(marketConditions.consumerPreferences);
    
    return Object.keys(segmentDistribution).map(segmentKey => {
      const preferences = consumerPreferences[segmentKey] || {};
      
      return {
        id: segmentKey,
        name: segmentKey.charAt(0).toUpperCase() + segmentKey.slice(1).replace('-', ' '),
        size: marketConditions.totalMarketSize * segmentDistribution[segmentKey],
        share: segmentDistribution[segmentKey] * 100,
        growth: 3 + Math.random() * 4 - 2, // Mock growth rate between 1% and 5%
        priceRange: segmentKey === 'premium' ? '$250-$500' : 
                   segmentKey === 'mid-range' ? '$100-$250' : '$50-$100',
        qualitySensitivity: preferences.quality_sensitivity > 0.6 ? 'High' : 
                           preferences.quality_sensitivity > 0.4 ? 'Medium' : 'Low',
        priceSensitivity: preferences.price_sensitivity > 0.6 ? 'High' : 
                         preferences.price_sensitivity > 0.4 ? 'Medium' : 'Low',
        innovationPreference: preferences.innovation_preference > 0.6 ? 'High' : 
                             preferences.innovation_preference > 0.4 ? 'Medium' : 'Low',
        sustainabilityPreference: preferences.sustainability_preference > 0.6 ? 'High' : 
                                 preferences.sustainability_preference > 0.4 ? 'Medium' : 'Low'
      };
    });
  };
  
  return {
    getCompanyPerformance,
    getCompanyPerformanceHistory,
    getProductPerformance,
    getProductPerformanceHistory,
    getMarketConditions,
    getMarketEvents,
    getCurrentPeriod,
    getCompetitors,
    getMarketSegments
  };
}
