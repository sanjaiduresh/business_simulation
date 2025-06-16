import { SimulationState, Company, Product, Decision, MarketConditions, PerformanceResults, ProductPerformance, Event } from '../components/simulation/types';
import { useDatabase } from './database-context';

export function useSimulationPersistence() {
  const db = useDatabase();
  
  // Save simulation state to database
  const saveSimulationState = async (state: SimulationState): Promise<void> => {
    try {
      // Check if simulation exists
      const existingSimulation = await db.getSimulation(state.id);
      
      if (existingSimulation) {
        // Update simulation
        await db.updateSimulation(state.id, {
          name: state.name,
          description: state.description,
          config: state.config,
          currentPeriod: state.currentPeriod,
          status: state.status,
          updatedAt: state.updatedAt
        });
      } else {
        // Create simulation
        await db.createSimulation({
          id: state.id,
          name: state.name,
          description: state.description,
          config: state.config,
          currentPeriod: state.currentPeriod,
          status: state.status,
          createdBy: state.createdBy,
          createdAt: state.createdAt,
          updatedAt: state.updatedAt
        });
      }
      
      // Save companies
      for (const company of state.companies) {
        const existingCompany = await db.getCompany(company.id);
        
        if (existingCompany) {
          // Update company
          await db.updateCompany(company.id, {
            name: company.name,
            description: company.description,
            logoUrl: company.logoUrl,
            cashBalance: company.cashBalance,
            totalAssets: company.totalAssets,
            totalLiabilities: company.totalLiabilities,
            creditRating: company.creditRating,
            brandValue: company.brandValue,
            data: company.data,
            updatedAt: company.updatedAt
          });
        } else {
          // Create company
          await db.createCompany({
            id: company.id,
            simulationId: company.simulationId,
            userId: company.userId,
            name: company.name,
            description: company.description,
            logoUrl: company.logoUrl,
            cashBalance: company.cashBalance,
            totalAssets: company.totalAssets,
            totalLiabilities: company.totalLiabilities,
            creditRating: company.creditRating,
            brandValue: company.brandValue,
            data: company.data,
            createdAt: company.createdAt,
            updatedAt: company.updatedAt
          });
        }
      }
      
      // Save products
      for (const product of state.products) {
        const existingProduct = await db.getProduct(product.id);
        
        if (existingProduct) {
          // Update product
          await db.updateProduct(product.id, {
            name: product.name,
            description: product.description,
            category: product.category,
            qualityRating: product.qualityRating,
            innovationRating: product.innovationRating,
            sustainabilityRating: product.sustainabilityRating,
            productionCost: product.productionCost,
            sellingPrice: product.sellingPrice,
            inventoryLevel: product.inventoryLevel,
            productionCapacity: product.productionCapacity,
            developmentCost: product.developmentCost,
            marketingBudget: product.marketingBudget,
            status: product.status,
            launchPeriod: product.launchPeriod,
            discontinuePeriod: product.discontinuePeriod,
            data: product.data,
            updatedAt: product.updatedAt
          });
        } else {
          // Create product
          await db.createProduct({
            id: product.id,
            companyId: product.companyId,
            name: product.name,
            description: product.description,
            category: product.category,
            qualityRating: product.qualityRating,
            innovationRating: product.innovationRating,
            sustainabilityRating: product.sustainabilityRating,
            productionCost: product.productionCost,
            sellingPrice: product.sellingPrice,
            inventoryLevel: product.inventoryLevel,
            productionCapacity: product.productionCapacity,
            developmentCost: product.developmentCost,
            marketingBudget: product.marketingBudget,
            status: product.status,
            launchPeriod: product.launchPeriod,
            discontinuePeriod: product.discontinuePeriod,
            data: product.data,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt
          });
        }
      }
      
      // Save decisions
      for (const decision of state.decisions) {
        const existingDecision = await db.getDecision(decision.id);
        
        if (existingDecision) {
          // Update decision
          await db.updateDecision(decision.id, {
            processed: decision.processed,
            processedAt: decision.processedAt
          });
        } else {
          // Create decision
          await db.createDecision({
            id: decision.id,
            companyId: decision.companyId,
            period: decision.period,
            type: decision.type,
            data: decision.data,
            submittedAt: decision.submittedAt,
            processed: decision.processed,
            processedAt: decision.processedAt
          });
        }
      }
      
      // Save market conditions
      for (const marketCondition of state.marketConditions) {
        const existingMarketCondition = await db.getMarketConditions(state.id, marketCondition.period);
        
        if (!existingMarketCondition) {
          // Create market condition
          await db.createMarketConditions({
            id: marketCondition.id,
            simulationId: marketCondition.simulationId,
            period: marketCondition.period,
            totalMarketSize: marketCondition.totalMarketSize,
            segmentDistribution: marketCondition.segmentDistribution,
            economicIndicators: marketCondition.economicIndicators,
            consumerPreferences: marketCondition.consumerPreferences,
            technologyTrends: marketCondition.technologyTrends,
            sustainabilityImportance: marketCondition.sustainabilityImportance,
            data: marketCondition.data,
            createdAt: marketCondition.createdAt
          });
        }
      }
      
      // Save performance results
      for (const performanceResult of state.performanceResults) {
        const existingPerformanceResult = await db.getPerformanceResults(
          performanceResult.companyId, 
          performanceResult.period
        );
        
        if (!existingPerformanceResult) {
          // Create performance result
          await db.createPerformanceResults({
            id: performanceResult.id,
            companyId: performanceResult.companyId,
            period: performanceResult.period,
            revenue: performanceResult.revenue,
            costs: performanceResult.costs,
            profit: performanceResult.profit,
            marketShare: performanceResult.marketShare,
            cashFlow: performanceResult.cashFlow,
            roi: performanceResult.roi,
            customerSatisfaction: performanceResult.customerSatisfaction,
            employeeSatisfaction: performanceResult.employeeSatisfaction,
            sustainabilityScore: performanceResult.sustainabilityScore,
            innovationScore: performanceResult.innovationScore,
            brandValueChange: performanceResult.brandValueChange,
            data: performanceResult.data,
            createdAt: performanceResult.createdAt
          });
        }
      }
      
      // Save product performance
      for (const productPerformance of state.productPerformance) {
        const existingProductPerformance = await db.getProductPerformance(
          productPerformance.productId, 
          productPerformance.period
        );
        
        if (!existingProductPerformance) {
          // Create product performance
          await db.createProductPerformance({
            id: productPerformance.id,
            productId: productPerformance.productId,
            period: productPerformance.period,
            salesVolume: productPerformance.salesVolume,
            revenue: productPerformance.revenue,
            costs: productPerformance.costs,
            profit: productPerformance.profit,
            marketShare: productPerformance.marketShare,
            customerSatisfaction: productPerformance.customerSatisfaction,
            data: productPerformance.data,
            createdAt: productPerformance.createdAt
          });
        }
      }
      
      // Save events
      for (const event of state.events) {
        // Check if event exists by getting all events for the period
        const existingEvents = await db.getEvents(state.id, event.period);
        const eventExists = existingEvents.some(e => e.id === event.id);
        
        if (!eventExists) {
          // Create event
          await db.createEvent({
            id: event.id,
            simulationId: event.simulationId,
            period: event.period,
            type: event.type,
            name: event.name,
            description: event.description,
            impactArea: event.impactArea,
            impactStrength: event.impactStrength,
            affectedCompanies: event.affectedCompanies,
            data: event.data,
            createdAt: event.createdAt
          });
        }
      }
    } catch (error) {
      console.error('Error saving simulation state:', error);
      throw error;
    }
  };
  
  // Load simulation state from database
  const loadSimulationState = async (simulationId: string): Promise<SimulationState | null> => {
    try {
      // Get simulation
      const simulation = await db.getSimulation(simulationId);
      if (!simulation) return null;
      
      // Get companies
      const companies = await db.getCompaniesBySimulation(simulationId);
      
      // Get products for each company
      const products: Product[] = [];
      for (const company of companies) {
        const companyProducts = await db.getProductsByCompany(company.id);
        products.push(...companyProducts);
      }
      
      // Get decisions for each company
      const decisions: Decision[] = [];
      for (const company of companies) {
        const companyDecisions = await db.getDecisionsByCompany(company.id);
        decisions.push(...companyDecisions);
      }
      
      // Get market conditions
      const marketConditions: MarketConditions[] = [];
      for (let period = 0; period <= simulation.current_period; period++) {
        const marketCondition = await db.getMarketConditions(simulationId, period);
        if (marketCondition) {
          marketConditions.push(marketCondition);
        }
      }
      
      // Get performance results for each company
      const performanceResults: PerformanceResults[] = [];
      for (const company of companies) {
        const companyPerformanceHistory = await db.getPerformanceHistory(company.id);
        performanceResults.push(...companyPerformanceHistory);
      }
      
      // Get product performance for each product
      const productPerformance: ProductPerformance[] = [];
      for (const product of products) {
        const productPerformanceHistory = await db.getProductPerformanceHistory(product.id);
        productPerformance.push(...productPerformanceHistory);
      }
      
      // Get events
      const events = await db.getEvents(simulationId);
      
      // Construct simulation state
      const state: SimulationState = {
        id: simulation.id,
        name: simulation.name,
        description: simulation.description,
        config: simulation.config,
        currentPeriod: simulation.current_period,
        status: simulation.status,
        createdBy: simulation.created_by,
        createdAt: simulation.created_at,
        updatedAt: simulation.updated_at,
        companies: companies.map(mapCompanyFromDb),
        products: products.map(mapProductFromDb),
        decisions: decisions.map(mapDecisionFromDb),
        marketConditions: marketConditions.map(mapMarketConditionsFromDb),
        performanceResults: performanceResults.map(mapPerformanceResultsFromDb),
        productPerformance: productPerformance.map(mapProductPerformanceFromDb),
        events: events.map(mapEventFromDb)
      };
      
      return state;
    } catch (error) {
      console.error('Error loading simulation state:', error);
      throw error;
    }
  };
  
  // Helper functions to map database objects to simulation objects
  const mapCompanyFromDb = (dbCompany: any): Company => ({
    id: dbCompany.id,
    simulationId: dbCompany.simulation_id,
    userId: dbCompany.user_id,
    name: dbCompany.name,
    description: dbCompany.description,
    logoUrl: dbCompany.logo_url,
    cashBalance: dbCompany.cash_balance,
    totalAssets: dbCompany.total_assets,
    totalLiabilities: dbCompany.total_liabilities,
    creditRating: dbCompany.credit_rating,
    brandValue: dbCompany.brand_value,
    data: dbCompany.data,
    createdAt: dbCompany.created_at,
    updatedAt: dbCompany.updated_at
  });
  
  const mapProductFromDb = (dbProduct: any): Product => ({
    id: dbProduct.id,
    companyId: dbProduct.company_id,
    name: dbProduct.name,
    description: dbProduct.description,
    category: dbProduct.category,
    qualityRating: dbProduct.quality_rating,
    innovationRating: dbProduct.innovation_rating,
    sustainabilityRating: dbProduct.sustainability_rating,
    productionCost: dbProduct.production_cost,
    sellingPrice: dbProduct.selling_price,
    inventoryLevel: dbProduct.inventory_level,
    productionCapacity: dbProduct.production_capacity,
    developmentCost: dbProduct.development_cost,
    marketingBudget: dbProduct.marketing_budget,
    status: dbProduct.status,
    launchPeriod: dbProduct.launch_period,
    discontinuePeriod: dbProduct.discontinue_period,
    data: dbProduct.data,
    createdAt: dbProduct.created_at,
    updatedAt: dbProduct.updated_at
  });
  
  const mapDecisionFromDb = (dbDecision: any): Decision => ({
    id: dbDecision.id,
    companyId: dbDecision.company_id,
    period: dbDecision.period,
    type: dbDecision.type,
    data: dbDecision.data,
    submittedAt: dbDecision.submitted_at,
    processed: Boolean(dbDecision.processed),
    processedAt: dbDecision.processed_at
  });
  
  const mapMarketConditionsFromDb = (dbMarketConditions: any): MarketConditions => ({
    id: dbMarketConditions.id,
    simulationId: dbMarketConditions.simulation_id,
    period: dbMarketConditions.period,
    totalMarketSize: dbMarketConditions.total_market_size,
    segmentDistribution: dbMarketConditions.segment_distribution,
    economicIndicators: dbMarketConditions.economic_indicators,
    consumerPreferences: dbMarketConditions.consumer_preferences,
    technologyTrends: dbMarketConditions.technology_trends,
    sustainabilityImportance: dbMarketConditions.sustainability_importance,
    data: dbMarketConditions.data,
    createdAt: dbMarketConditions.created_at
  });
  
  const mapPerformanceResultsFromDb = (dbPerformanceResults: any): PerformanceResults => ({
    id: dbPerformanceResults.id,
    companyId: dbPerformanceResults.company_id,
    period: dbPerformanceResults.period,
    revenue: dbPerformanceResults.revenue,
    costs: dbPerformanceResults.costs,
    profit: dbPerformanceResults.profit,
    marketShare: dbPerformanceResults.market_share,
    cashFlow: dbPerformanceResults.cash_flow,
    roi: dbPerformanceResults.roi,
    customerSatisfaction: dbPerformanceResults.customer_satisfaction,
    employeeSatisfaction: dbPerformanceResults.employee_satisfaction,
    sustainabilityScore: dbPerformanceResults.sustainability_score,
    innovationScore: dbPerformanceResults.innovation_score,
    brandValueChange: dbPerformanceResults.brand_value_change,
    data: dbPerformanceResults.data,
    createdAt: dbPerformanceResults.created_at
  });
  
  const mapProductPerformanceFromDb = (dbProductPerformance: any): ProductPerformance => ({
    id: dbProductPerformance.id,
    productId: dbProductPerformance.product_id,
    period: dbProductPerformance.period,
    salesVolume: dbProductPerformance.sales_volume,
    revenue: dbProductPerformance.revenue,
    costs: dbProductPerformance.costs,
    profit: dbProductPerformance.profit,
    marketShare: dbProductPerformance.market_share,
    customerSatisfaction: dbProductPerformance.customer_satisfaction,
    data: dbProductPerformance.data,
    createdAt: dbProductPerformance.created_at
  });
  
  const mapEventFromDb = (dbEvent: any): Event => ({
    id: dbEvent.id,
    simulationId: dbEvent.simulation_id,
    period: dbEvent.period,
    type: dbEvent.type,
    name: dbEvent.name,
    description: dbEvent.description,
    impactArea: dbEvent.impact_area,
    impactStrength: dbEvent.impact_strength,
    affectedCompanies: dbEvent.affected_companies,
    data: dbEvent.data,
    createdAt: dbEvent.created_at
  });
  
  return {
    saveSimulationState,
    loadSimulationState
  };
}
