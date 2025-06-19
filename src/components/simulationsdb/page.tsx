"use client";
import React, { useEffect, useState } from "react";
import { Simulation, SimulationStatus } from "../simulation/types";
import { Button } from "../ui/button";
import { Form, FormGroup, FormLabel, Input } from "../ui/form";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";

interface Company {
  id: string;
  simulationId: string;
  userId: string;
  name: string;
  description: string;
  cashBalance: number;
  totalAssets: number;
  totalLiabilities: number;
  creditRating: string;
  brandValue: number;
  createdAt: string;
  updatedAt: string;
}

export default function Simulationsdb() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const handleCompanyDetails = (companyId: string) => {
    window.location.href = `/company/${companyId}`;
  };

  // State for forms
  const [simulationForm, setSimulationForm] = useState({
    name: "",
    description: "",
  });

  const [companyForm, setCompanyForm] = useState({
    simulationId: "",
    name: "",
    description: "",
    cashBalance: "1000000",
    totalAssets: "1000000",
    totalLiabilities: "0",
    creditRating: "AA",
    brandValue: "50000",
  });

  const [showCreateSimulationModal, setShowCreateSimulationModal] = useState(false);
  const [showCreateCompanyModal, setShowCreateCompanyModal] = useState(false);
  const [selectedSimulation, setSelectedSimulation] = useState<string | null>(null);
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [companies, setCompanies] = useState<{ [key: string]: Company[] }>({});
  const [loadingCompanies, setLoadingCompanies] = useState<{
    [key: string]: boolean;
  }>({});
  const [loadingSimulations, setLoadingSimulations] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSimulations = async () => {
      setLoadingSimulations(true);
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
        setError("Failed to load simulations.");
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load simulations.",
        });
      } finally {
        setLoadingSimulations(false);
      }
    };

    fetchSimulations();
  }, [toast]);

  // Fetch companies for a specific simulation
  const fetchCompanies = async (simulationId: string) => {
    if (companies[simulationId] || loadingCompanies[simulationId]) return;

    setLoadingCompanies((prev) => ({ ...prev, [simulationId]: true }));

    try {
      const response = await fetch(`/api/company?simulationId=${simulationId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch companies.");
      }
      const data: { companies: Company[] } = await response.json();
      setCompanies((prev) => ({ ...prev, [simulationId]: data.companies }));
    } catch (err) {
      console.error("Failed to fetch companies:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to load companies for simulation ${simulationId}.`,
      });
    } finally {
      setLoadingCompanies((prev) => ({ ...prev, [simulationId]: false }));
    }
  };

  // Handle form inputs
  const handleSimulationInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSimulationForm({ ...simulationForm, [e.target.name]: e.target.value });
  };

  const handleCompanyInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyForm({ ...companyForm, [e.target.name]: e.target.value });
  };

  // Handle simulation creation
  const handleCreateSimulation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!simulationForm.name.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Simulation name is required.",
      });
      return;
    }
    try {
      const response = await fetch("/api/simulations/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: simulationForm.name,
          description: simulationForm.description,
        }),
      });

      if (response.ok) {
        const { simulation } = (await response.json()) as {
          simulation: Simulation;
        };
        setSimulations([...simulations, simulation]);
        setSimulationForm({ name: "", description: "" });
        setShowCreateSimulationModal(false);
        toast({
          title: "Success",
          description: "Simulation created successfully!",
        });
      } else {
        const errorData = await response.json();
        const errorMsg = (errorData as { error?: string })?.error;
        throw new Error(errorMsg || "Failed to create simulation");
      }
    } catch (error) {
      console.error("Simulation creation failed:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: (error as Error).message || "Simulation creation failed.",
      });
    }
  };

  // Handle company creation
  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyForm.name.trim() || !companyForm.simulationId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Company name and simulation ID are required.",
      });
      return;
    }
    
    // Validate numeric fields
    const cashBalance = parseFloat(companyForm.cashBalance);
    const totalAssets = parseFloat(companyForm.totalAssets);
    const totalLiabilities = parseFloat(companyForm.totalLiabilities);
    const brandValue = parseFloat(companyForm.brandValue);
    
    if (isNaN(cashBalance) || isNaN(totalAssets) || isNaN(totalLiabilities) || isNaN(brandValue)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter valid numeric values for financial fields.",
      });
      return;
    }
    
    try {
      const response = await fetch("/api/company/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          simulationId: companyForm.simulationId,
          name: companyForm.name,
          description: companyForm.description,
          userId: user?.id,
          cashBalance,
          totalAssets,
          totalLiabilities,
          creditRating: companyForm.creditRating,
          brandValue,
          data: "{}",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        const { company } = (await response.json()) as { company: Company };
        setCompanies((prev) => ({
          ...prev,
          [companyForm.simulationId]: [
            ...(prev[companyForm.simulationId] || []),
            company,
          ],
        }));
        setCompanyForm({
          simulationId: "",
          name: "",
          description: "",
          cashBalance: "1000000",
          totalAssets: "1000000",
          totalLiabilities: "0",
          creditRating: "AA",
          brandValue: "50000",
        });
        setShowCreateCompanyModal(false);
        setSelectedSimulation(null);
        toast({
          title: "Success",
          description: "Company created successfully!",
        });
      } else {
        const errorData = await response.json();
        const errorMsg = (errorData as { error?: string })?.error;
        throw new Error(errorMsg || "Failed to create company");
      }
    } catch (error) {
      console.error("Company creation failed:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: (error as Error).message || "Company creation failed.",
      });
    }
  };

  const handleAddCompany = (simulationId: string) => {
    setSelectedSimulation(simulationId);
    setCompanyForm({ ...companyForm, simulationId });
    setShowCreateCompanyModal(true);
    fetchCompanies(simulationId);
  };

  const handleViewCompanies = (simulationId: string) => {
    fetchCompanies(simulationId);
  };

  const closeSimulationModal = () => {
    setShowCreateSimulationModal(false);
    setSimulationForm({ name: "", description: "" });
  };

  const closeCompanyModal = () => {
    setShowCreateCompanyModal(false);
    setSelectedSimulation(null);
    setCompanyForm({
      simulationId: "",
      name: "",
      description: "",
      cashBalance: "1000000",
      totalAssets: "1000000",
      totalLiabilities: "0",
      creditRating: "AA",
      brandValue: "50000",
    });
  };

  if (loadingSimulations) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading simulations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  if (simulations.length === 0) {
    return (
      <div className="h-screen bg-background overflow-hidden">
        {/* Header */}
        <div className="border-b">
          <div className="container mx-auto px-6 py-4">
            <h1 className="text-2xl font-semibold">Simulations Dashboard</h1>
            <h1 className="text-2xl font-semibold">{user?.name}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage and monitor your business simulations
            </p>
          </div>
        </div>

        {/* Centered Content */}
        <div className="flex items-center justify-center h-[calc(100vh-120px)]">
          <div className="text-center max-w-md">
            {/* Empty State Icon */}
            <div className="mx-auto h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-6">
              <svg
                className="h-8 w-8 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>

            <h2 className="text-xl font-semibold mb-2">No simulations found</h2>
            <p className="text-muted-foreground mb-8">
              Get started by creating your first simulation
            </p>

            <Button
              size="lg"
              onClick={() => setShowCreateSimulationModal(true)}
              className="px-8 py-3"
            >
              Create Your First Simulation
            </Button>
          </div>
        </div>

        {/* Simulation Creation Modal */}
        {showCreateSimulationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Create New Simulation</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeSimulationModal}
                  className="h-8 w-8 p-0"
                >
                  ×
                </Button>
              </div>
              <Form onSubmit={handleCreateSimulation} className="space-y-4">
                <FormGroup>
                  <FormLabel htmlFor="name" className="text-sm font-medium">
                    Simulation Name
                  </FormLabel>
                  <Input
                    id="name"
                    name="name"
                    value={simulationForm.name}
                    onChange={handleSimulationInput}
                    placeholder="Enter simulation name"
                    className="mt-1"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel htmlFor="description" className="text-sm font-medium">
                    Description
                  </FormLabel>
                  <Input
                    id="description"
                    name="description"
                    value={simulationForm.description}
                    onChange={handleSimulationInput}
                    placeholder="Enter description"
                    className="mt-1"
                  />
                </FormGroup>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" size="sm" className="flex-1">
                    Create Simulation
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={closeSimulationModal}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="h-screen bg-background overflow-hidden">
      {/* Header with Create Button */}
      <div className="border-b">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Simulations Dashboard</h1>
            <h1 className="text-2xl font-semibold">{user?.name}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage and monitor your business simulations
            </p>
          </div>
          <Button onClick={() => setShowCreateSimulationModal(true)}>
            New Simulation
          </Button>
        </div>
      </div>

      {/* Simulations Grid */}
      <div className="h-[calc(100vh-120px)] overflow-y-auto">
        <div className="container mx-auto px-6 py-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {simulations.map((simulation) => (
              <div
                key={simulation.id}
                className="bg-card rounded-lg border p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold mb-2">
                  {simulation.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {simulation.description || "No description provided"}
                </p>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Status:</span>{" "}
                    <span
                      className={`capitalize ${
                        simulation.status === SimulationStatus.ACTIVE
                          ? "text-green-600"
                          : "text-gray-600"
                      }`}
                    >
                      {simulation.status}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">Period:</span>{" "}
                    {simulation.currentPeriod}
                  </p>
                  <p>
                    <span className="font-medium">Created:</span>{" "}
                    {new Date(simulation.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewCompanies(simulation.id)}
                  >
                    View Companies
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleAddCompany(simulation.id)}
                  >
                    Add Company
                  </Button>
                </div>
                {/* Companies List */}
                {companies[simulation.id] && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Companies</h4>
                    {loadingCompanies[simulation.id] ? (
                      <p className="text-sm text-muted-foreground">
                        Loading companies...
                      </p>
                    ) : companies[simulation.id].length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No companies found.
                      </p>
                    ) : (
                      <ul className="space-y-2">
                        {companies[simulation.id].map((company) => (
                          <li
                            key={company.id}
                            className="text-sm border-t pt-2"
                          >
                            <span className="font-medium">{company.name}</span>
                            <p className="text-muted-foreground">
                              {company.description || "No description"}
                            </p>
                            <p className="text-muted-foreground">
                              Cash: ${company.cashBalance.toLocaleString()}
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCompanyDetails(company.id)}
                            >
                              View Details
                            </Button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Simulation Creation Modal */}
      {showCreateSimulationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Create New Simulation</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeSimulationModal}
                className="h-8 w-8 p-0"
              >
                ×
              </Button>
            </div>
            <Form onSubmit={handleCreateSimulation} className="space-y-4">
              <FormGroup>
                <FormLabel htmlFor="sim-name" className="text-sm font-medium">
                  Simulation Name
                </FormLabel>
                <Input
                  id="sim-name"
                  name="name"
                  value={simulationForm.name}
                  onChange={handleSimulationInput}
                  placeholder="Enter simulation name"
                  className="mt-1"
                  required
                />
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="sim-description" className="text-sm font-medium">
                  Description
                </FormLabel>
                <Input
                  id="sim-description"
                  name="description"
                  value={simulationForm.description}
                  onChange={handleSimulationInput}
                  placeholder="Enter description"
                  className="mt-1"
                />
              </FormGroup>

              <div className="flex gap-2 pt-4">
                <Button type="submit" size="sm" className="flex-1">
                  Create Simulation
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={closeSimulationModal}
                >
                  Cancel
                </Button>
              </div>
            </Form>
          </div>
        </div>
      )}

      {/* Company Creation Modal */}
      {showCreateCompanyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Create New Company</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeCompanyModal}
                className="h-8 w-8 p-0"
              >
                ×
              </Button>
            </div>
            <Form onSubmit={handleCreateCompany} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormGroup className="md:col-span-2">
                  <FormLabel htmlFor="comp-name" className="text-sm font-medium">
                    Company Name
                  </FormLabel>
                  <Input
                    id="comp-name"
                    name="name"
                    value={companyForm.name}
                    onChange={handleCompanyInput}
                    placeholder="Enter company name"
                    className="mt-1"
                    required
                  />
                </FormGroup>

                <FormGroup className="md:col-span-2">
                  <FormLabel htmlFor="comp-description" className="text-sm font-medium">
                    Description
                  </FormLabel>
                  <Input
                    id="comp-description"
                    name="description"
                    value={companyForm.description}
                    onChange={handleCompanyInput}
                    placeholder="Enter company description"
                    className="mt-1"
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel htmlFor="cash-balance" className="text-sm font-medium">
                    Cash Balance ($)
                  </FormLabel>
                  <Input
                    id="cash-balance"
                    name="cashBalance"
                    type="number"
                    min="0"
                    step="0.01"
                    value={companyForm.cashBalance}
                    onChange={handleCompanyInput}
                    placeholder="1000000"
                    className="mt-1"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel htmlFor="total-assets" className="text-sm font-medium">
                    Total Assets ($)
                  </FormLabel>
                  <Input
                    id="total-assets"
                    name="totalAssets"
                    type="number"
                    min="0"
                    step="0.01"
                    value={companyForm.totalAssets}
                    onChange={handleCompanyInput}
                    placeholder="1000000"
                    className="mt-1"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel htmlFor="total-liabilities" className="text-sm font-medium">
                    Total Liabilities ($)
                  </FormLabel>
                  <Input
                    id="total-liabilities"
                    name="totalLiabilities"
                    type="number"
                    min="0"
                    step="0.01"
                    value={companyForm.totalLiabilities}
                    onChange={handleCompanyInput}
                    placeholder="0"
                    className="mt-1"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel htmlFor="credit-rating" className="text-sm font-medium">
                    Credit Rating
                  </FormLabel>
                  <select
                    id="credit-rating"
                    name="creditRating"
                    value={companyForm.creditRating}
                    onChange={(e) => setCompanyForm({ ...companyForm, creditRating: e.target.value })}
                    className="mt-1 h-10 w-full px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    required
                  >
                    <option value="AAA">AAA</option>
                    <option value="AA">AA</option>
                    <option value="A">A</option>
                    <option value="BBB">BBB</option>
                    <option value="BB">BB</option>
                    <option value="B">B</option>
                    <option value="CCC">CCC</option>
                    <option value="CC">CC</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </FormGroup>

                <FormGroup className="md:col-span-2">
                  <FormLabel htmlFor="brand-value" className="text-sm font-medium">
                    Brand Value ($)
                  </FormLabel>
                  <Input
                    id="brand-value"
                    name="brandValue"
                    type="number"
                    min="0"
                    step="0.01"
                    value={companyForm.brandValue}
                    onChange={handleCompanyInput}
                    placeholder="50000"
                    className="mt-1"
                    required
                  />
                </FormGroup>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" size="sm" className="flex-1">
                  Create Company
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={closeCompanyModal}
                >
                  Cancel
                </Button>
              </div>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
}