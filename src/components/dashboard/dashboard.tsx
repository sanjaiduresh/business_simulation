"use client";
import React, { useEffect, useState } from "react";
import { useSimulation } from "../simulation/simulation-context";
import { useDecisionSubmission } from "../simulation/use-decision-submission";
import { useSimulationData } from "../simulation/use-simulation-data";
import { useAuth } from "../../lib/auth-context";
import { Form, FormGroup, FormLabel, Input } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Simulation, SimulationStatus } from "../simulation/types";

export function Dashboard() {
  const { state, userCompany, companyProducts, advancePeriod, loading, error } =
    useSimulation();
  const {
    getCompanyPerformance,
    getMarketConditions,
    getMarketEvents,
    getCurrentPeriod,
  } = useSimulationData();
  const {
    submitProductDevelopment,
    submitProduction,
    submitMarketing,
    submitPricing,
  } = useDecisionSubmission();
  const { user } = useAuth();
  // State for forms
  const [simulationForm, setSimulationForm] = React.useState({
    name: "",
    description: "",
  });
  const [companyForm, setCompanyForm] = React.useState({
    simulationId: "",
    name: "",
    description: "",
  });
  // Fetch simulations
  const [simulations, setSimulations] = useState<Simulation[]>([]);

  useEffect(() => {
    const fetchSimulations = async () => {
      try {
        const response = await fetch("/api/simulations");
        if (!response.ok) {
          throw new Error("Failed to fetch simulations.");
        }
        const data: { simulations?: Simulation[] } = await response.json();
        setSimulations(data.simulations || []);
        console.log("Fetched simulations:", data.simulations);
      } catch (err) {
        console.error((err as Error).message);
      }
    };

    fetchSimulations();
  }, []);

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  // Handle form inputs
  const handleSimulationInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSimulationForm({ ...simulationForm, [e.target.name]: e.target.value });
  };

  const handleCompanyInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setCompanyForm({ ...companyForm, [e.target.name]: e.target.value });
  };

  // Handle simulation creation
  const handleCreateSimulation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/simulations/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...simulationForm,
          status: "active",
          createdBy: user?.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      });
      if (response.ok) {
        const { id } = (await response.json()) as { id: string };
        setSimulations([...simulations, {
          id : id,
          name: simulationForm.name,
          description: simulationForm.description,
          currentPeriod: 0,
          status: SimulationStatus.ACTIVE,
          createdBy: user?.id || "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }]);
      } else {
        console.error("Failed to create simulation:", await response.text());
      }
    } catch (error) {
      console.error("Simulation creation failed:", error);
    }
  };

  // Handle company creation
  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/companies/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...companyForm,
          userId: user?.id,
          cashBalance: 1000000,
          totalAssets: 1000000,
          totalLiabilities: 0,
          creditRating: "AA",
          brandValue: 50000,
          data: "{}",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      });
      if (response.ok) {
        // Refresh simulation state to update userCompany
        window.location.reload(); // Temporary; ideally use refreshState()
      } else {
        throw new Error("Failed to create company");
      }
    } catch (error) {
      console.error("Company creation failed:", error);
    }
  };

  // Existing logic for period and decisions
  const currentPeriod = getCurrentPeriod();
  const performance = getCompanyPerformance();
  const marketConditions = getMarketConditions();
  const events = getMarketEvents(currentPeriod);

  const handleAdvancePeriod = () => {
    advancePeriod();
  };

  const handleProductionDecision = (productId: string, volume: number) => {
    submitProduction({ productId, productionVolume: volume });
  };

  const handlePricingDecision = (productId: string, price: number) => {
    submitPricing({ productId, price });
  };

  const handleMarketingDecision = (productId: string, budget: number) => {
    submitMarketing({ productId, budget });
  };

  const handleNewProduct = (data: any) => {
    submitProductDevelopment({ action: "new_product", ...data });
  };

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold">Loading simulation...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold text-red-600">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (simulations.length === 0) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900">
          No simulations found
        </h2>
        <p className="text-gray-900">Create a simulation to get started.</p>
        <Form onSubmit={handleCreateSimulation} className="space-y-4 mt-4">
          <FormGroup>
            <FormLabel htmlFor="name">Simulation Name</FormLabel>
            <Input
              id="name"
              name="name"
              value={simulationForm.name}
              onChange={handleSimulationInput}
              placeholder="Enter simulation name"
            />
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="description">Description</FormLabel>
            <Input
              id="description"
              name="description"
              value={simulationForm.description}
              onChange={handleSimulationInput}
              placeholder="Enter description"
            />
          </FormGroup>
          <Button type="submit">Create Simulation</Button>
        </Form>
      </div>
    );
  }

  if (!userCompany) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold">No company found</h2>
        <p>Create a company to start the simulation.</p>
        <Form onSubmit={handleCreateCompany} className="space-y-4 mt-4">
          <FormGroup>
            <FormLabel htmlFor="simulationId">Simulation</FormLabel>
            <select
              id="simulationId"
              name="simulationId"
              value={companyForm.simulationId}
              onChange={handleCompanyInput}
              className="block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">Select a simulation</option>
              {simulations.map((sim) => (
                <option key={sim.id} value={sim.id}>
                  {sim.name}
                </option>
              ))}
            </select>
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="name">Company Name</FormLabel>
            <Input
              id="name"
              name="name"
              value={companyForm.name}
              onChange={handleCompanyInput}
              placeholder="Enter company name"
            />
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="description">Description</FormLabel>
            <Input
              id="description"
              name="description"
              value={companyForm.description}
              onChange={handleCompanyInput}
              placeholder="Enter description"
            />
          </FormGroup>
          <Button type="submit">Create Company</Button>
        </Form>
      </div>
    );
  }

  // Existing dashboard content
  return (
    <div className="p-6 bg-background">
      <h1 className="text-2xl font-bold">
        {userCompany.name} - Welcome, {user?.name || "User"}!
      </h1>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{userCompany.name}</h1>
          <p className="text-gray-600">Period {currentPeriod}</p>
        </div>
        <Button onClick={handleAdvancePeriod}>Advance to Next Period</Button>
      </div>
      {/* Financial Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Financial Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
            <p className="text-gray-700 dark:text-gray-300">Cash Balance</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              ${userCompany.cashBalance.toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
            <p className="text-gray-700 dark:text-gray-300">Total Assets</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              ${userCompany.totalAssets.toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
            <p className="text-gray-700 dark:text-gray-300">
              Total Liabilities
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              ${userCompany.totalLiabilities.toLocaleString()}
            </p>
          </div>
        </div>
        {performance && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
              <p className="text-gray-700 dark:text-gray-300">Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                ${performance.revenue.toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
              <p className="text-gray-700 dark:text-gray-300">Costs</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                ${performance.costs.toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
              <p className="text-gray-700 dark:text-gray-300">Profit</p>
              <p
                className={`text-2xl font-bold ${
                  performance.profit >= 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                ${performance.profit.toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
              <p className="text-gray-700 dark:text-gray-300">Market Share</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {(performance.marketShare * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        )}
      </div>
      {/* Products */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Products
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Quality
                </th>
                <th className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Price
                </th>
                <th className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Inventory
                </th>
                <th className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {companyProducts.map((product) => (
                <tr key={product.id}>
                  <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                    {product.name}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                    {product.category.charAt(0).toUpperCase() +
                      product.category.slice(1)}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-600">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.status === "active"
                          ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                          : product.status === "development"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                          : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                      }`}
                    >
                      {product.status.charAt(0).toUpperCase() +
                        product.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                    {product.qualityRating.toFixed(1)}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                    ${product.sellingPrice}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                    {product.inventoryLevel}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-600">
                    <Button
                      onClick={() => handleProductionDecision(product.id, 1000)}
                      variant="outline"
                      size="sm"
                      className="mr-2"
                    >
                      Produce
                    </Button>
                    <Button
                      onClick={() =>
                        handlePricingDecision(
                          product.id,
                          product.sellingPrice + 10
                        )
                      }
                      variant="outline"
                      size="sm"
                      className="mr-2"
                    >
                      Adjust Price
                    </Button>
                    <Button
                      onClick={() => handleMarketingDecision(product.id, 10000)}
                      variant="outline"
                      size="sm"
                    >
                      Marketing
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Market Information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Market Information
        </h2>
        {marketConditions && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-100">
              Market Conditions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                <p className="text-gray-700 dark:text-gray-300">
                  Total Market Size
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  ${marketConditions.totalMarketSize.toLocaleString()}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                <p className="text-gray-700 dark:text-gray-300">
                  Sustainability Importance
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {(marketConditions.sustainabilityImportance * 100).toFixed(1)}
                  %
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                <p className="text-gray-700 dark:text-gray-300">Segments</p>
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {
                    Object.keys(
                      JSON.parse(marketConditions.segmentDistribution)
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>
        )}
        {events.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-100">
              Market Events
            </h3>
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-md"
                >
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                    {event.name}
                  </h4>
                  <p className="text-gray-800 dark:text-gray-200">
                    {event.description}
                  </p>
                  <div className="mt-2 flex items-center">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Impact: {event.impactArea}
                    </span>
                    <span className="mx-2 text-gray-700 dark:text-gray-300">
                      •
                    </span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Strength: {event.impactStrength > 0 ? "+" : ""}
                      {(event.impactStrength * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
