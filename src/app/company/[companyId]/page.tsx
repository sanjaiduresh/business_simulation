"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSimulationData } from "@/components/simulation/use-simulation-data";
import { useSimulation } from "@/components/simulation/simulation-context";
import { useDecisionSubmission } from "@/components/simulation/use-decision-submission";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Company {
  id: string;
  name: string;
  description: string;
  cashBalance: number;
  totalAssets: number;
  totalLiabilities: number;
  creditRating: string;
  brandValue: number;
}

interface Product {
  id: string;
  name: string;
  category: string;
  status: string;
  qualityRating: number;
  sellingPrice: number;
  inventoryLevel: number;
}

export default function CompanyDashboard() {
  const { state, advancePeriod } = useSimulation();
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

  const { companyId } = useParams();
  const [company, setCompany] = useState<Company | null>(null);
  const [companyProducts, setCompanyProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    category: "mid-range",
    qualityRating: 6,
    innovationRating: 5,
    sustainabilityRating: 5,
    productionCost: 100,
    sellingPrice: 200,
    developmentCost: 100000,
    status: "development",
  });

  // Get current period and performance data
  const currentPeriod = getCurrentPeriod();
  const performance = getCompanyPerformance();
  const marketConditions = getMarketConditions();
  const events = getMarketEvents(currentPeriod);

  // Handle advance period
  const handleAdvancePeriod = () => {
    advancePeriod();
  };

  // Handle production decision
  const handleProductionDecision = (productId: string, volume: number) => {
    submitProduction({
      productId,
      productionVolume: volume,
    });
  };

  // Handle pricing decision
  const handlePricingDecision = (productId: string, price: number) => {
    submitPricing({
      productId,
      price,
    });
  };

  // Handle marketing decision
  const handleMarketingDecision = (productId: string, budget: number) => {
    submitMarketing({
      productId,
      budget,
    });
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProductForm((prev) => ({
      ...prev,
      [name]:
        name === "qualityRating" ||
        name === "innovationRating" ||
        name === "sustainabilityRating" ||
        name === "productionCost" ||
        name === "sellingPrice" ||
        name === "developmentCost"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setProductForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle product creation
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/product/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...productForm, companyId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create product: ${response.statusText}`);
      }

      const data = (await response.json()) as { id: string };
      submitProductDevelopment({
        action: "new_product",
        ...productForm,
        companyId,
        productId: data.id,
      });
      setOpen(false);
      setProductForm({
        name: "",
        description: "",
        category: "mid-range",
        qualityRating: 6,
        innovationRating: 5,
        sustainabilityRating: 5,
        productionCost: 100,
        sellingPrice: 200,
        developmentCost: 100000,
        status: "development",
      });

      // Refresh products after creation
      const productsResponse = await fetch(`/api/product/${companyId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        setCompanyProducts(productsData as Product[]);
      }
    } catch (err) {}
  };

  useEffect(() => {
    const fetchCompanyAndProducts = async () => {
      if (!companyId) {
        setError("Company ID is missing");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch company
        const companyResponse = await fetch(`/api/company/${companyId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!companyResponse.ok) {
          throw new Error(
            `Failed to fetch company: ${companyResponse.statusText}`
          );
        }

        const companyData = await companyResponse.json();
        setCompany(companyData as Company);

        // Fetch products
        const productsResponse = await fetch(`/api/product/${companyId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!productsResponse.ok) {
          throw new Error(
            `Failed to fetch products: ${productsResponse.statusText}`
          );
        }

        const productsData = await productsResponse.json();
        setCompanyProducts(productsData as Product[]);

        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyAndProducts();
  }, [companyId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800">
            Loading simulation...
          </h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            No company found
          </h2>
          <p className="text-gray-600">
            Please create a company to start the simulation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-900">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6 border border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white">
                  {company.name}
                </h1>
                <p className="text-lg text-gray-300">Period {currentPeriod}</p>
              </div>
              <Button
                onClick={handleAdvancePeriod}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg"
              >
                Advance to Next Period
              </Button>
            </div>
          </div>

          {/* Financial Overview */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6 border border-gray-700">
            <h2 className="text-2xl font-semibold mb-6 text-white border-b border-gray-600 pb-2">
              Financial Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-blue-900 p-6 rounded-lg border border-blue-700">
                <p className="text-blue-300 font-medium mb-2">Cash Balance</p>
                <p className="text-3xl font-bold text-blue-100">
                  ${company.cashBalance.toLocaleString()}
                </p>
              </div>
              <div className="bg-green-900 p-6 rounded-lg border border-green-700">
                <p className="text-green-300 font-medium mb-2">Total Assets</p>
                <p className="text-3xl font-bold text-green-100">
                  ${company.totalAssets.toLocaleString()}
                </p>
              </div>
              <div className="bg-red-900 p-6 rounded-lg border border-red-700">
                <p className="text-red-300 font-medium mb-2">
                  Total Liabilities
                </p>
                <p className="text-3xl font-bold text-red-100">
                  ${company.totalLiabilities.toLocaleString()}
                </p>
              </div>
            </div>

            {performance && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-purple-900 p-6 rounded-lg border border-purple-700">
                  <p className="text-purple-300 font-medium mb-2">Revenue</p>
                  <p className="text-2xl font-bold text-purple-100">
                    ${performance.revenue.toLocaleString()}
                  </p>
                </div>
                <div className="bg-orange-900 p-6 rounded-lg border border-orange-700">
                  <p className="text-orange-300 font-medium mb-2">Costs</p>
                  <p className="text-2xl font-bold text-orange-100">
                    ${performance.costs.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
                  <p className="text-gray-300 font-medium mb-2">Profit</p>
                  <p
                    className={`text-2xl font-bold ${
                      performance.profit >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    ${performance.profit.toLocaleString()}
                  </p>
                </div>
                <div className="bg-indigo-900 p-6 rounded-lg border border-indigo-700">
                  <p className="text-indigo-300 font-medium mb-2">
                    Market Share
                  </p>
                  <p className="text-2xl font-bold text-indigo-100">
                    {(performance.marketShare * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Products */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6 border border-gray-700">
            <h2 className="text-2xl font-semibold mb-6 text-white border-b border-gray-600 pb-2">
              Products
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-800 border border-gray-600 rounded-lg">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="py-4 px-6 border-b border-gray-600 text-left text-sm font-semibold text-gray-200 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="py-4 px-6 border-b border-gray-600 text-left text-sm font-semibold text-gray-200 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="py-4 px-6 border-b border-gray-600 text-left text-sm font-semibold text-gray-200 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="py-4 px-6 border-b border-gray-600 text-left text-sm font-semibold text-gray-200 uppercase tracking-wider">
                      Quality
                    </th>
                    <th className="py-4 px-6 border-b border-gray-600 text-left text-sm font-semibold text-gray-200 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="py-4 px-6 border-b border-gray-600 text-left text-sm font-semibold text-gray-200 uppercase tracking-wider">
                      Inventory
                    </th>
                    <th className="py-4 px-6 border-b border-gray-600 text-left text-sm font-semibold text-gray-200 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-600">
                  {companyProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-700">
                      <td className="py-4 px-6 text-white font-medium">
                        {product.name}
                      </td>
                      <td className="py-4 px-6 text-gray-300">
                        {product.category.charAt(0).toUpperCase() +
                          product.category.slice(1)}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 inline-flex text-sm font-medium rounded-full ${
                            product.status === "active"
                              ? "bg-green-800 text-green-200 border border-green-600"
                              : product.status === "development"
                              ? "bg-yellow-800 text-yellow-200 border border-yellow-600"
                              : "bg-red-800 text-red-200 border border-red-600"
                          }`}
                        >
                          {product.status.charAt(0).toUpperCase() +
                            product.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-white font-medium">
                        {product.qualityRating.toFixed(1)}
                      </td>
                      <td className="py-4 px-6 text-white font-bold">
                        ${product.sellingPrice}
                      </td>
                      <td className="py-4 px-6 text-gray-300">
                        {product.inventoryLevel.toLocaleString()}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-2">
                          <Button
                            onClick={() =>
                              handleProductionDecision(product.id, 1000)
                            }
                            className="bg-blue-800 text-blue-200 hover:bg-blue-700 px-3 py-1 rounded-md text-sm font-medium transition-colors"
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
                            className="bg-green-800 text-green-200 hover:bg-green-700 px-3 py-1 rounded-md text-sm font-medium transition-colors"
                          >
                            Price
                          </Button>
                          <Button
                            onClick={() =>
                              handleMarketingDecision(product.id, 10000)
                            }
                            className="bg-purple-800 text-purple-200 hover:bg-purple-700 px-3 py-1 rounded-md text-sm font-medium transition-colors"
                          >
                            Marketing
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg">
                    Develop New Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-800 text-white border border-gray-700 w-full max-w-md sm:max-w-lg md:max-w-xl">
                  <DialogHeader>
                    <DialogTitle className="text-xl sm:text-2xl">
                      Create New Product
                    </DialogTitle>
                  </DialogHeader>
                  <form
                    onSubmit={handleCreateProduct}
                    className="grid gap-4 sm:grid-cols-2 sm:gap-6 p-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm sm:text-base">
                        Product Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={productForm.name}
                        onChange={handleInputChange}
                        required
                        className="bg-gray-700 text-white border-gray-600 w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="description"
                        className="text-sm sm:text-base"
                      >
                        Description
                      </Label>
                      <Input
                        id="description"
                        name="description"
                        value={productForm.description}
                        onChange={handleInputChange}
                        className="bg-gray-700 text-white border-gray-600 w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="category"
                        className="text-sm sm:text-base"
                      >
                        Category
                      </Label>
                      <Select
                        name="category"
                        value={productForm.category}
                        onValueChange={(value) =>
                          handleSelectChange("category", value)
                        }
                      >
                        <SelectTrigger className="bg-gray-700 text-white border-gray-600 w-full">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 text-white border-gray-600">
                          <SelectItem value="budget">Budget</SelectItem>
                          <SelectItem value="mid-range">Mid-range</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="qualityRating"
                        className="text-sm sm:text-base"
                      >
                        Quality Rating (1-10)
                      </Label>
                      <Input
                        id="qualityRating"
                        name="qualityRating"
                        type="number"
                        min="1"
                        max="10"
                        value={productForm.qualityRating}
                        onChange={handleInputChange}
                        required
                        className="bg-gray-700 text-white border-gray-600 w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="innovationRating"
                        className="text-sm sm:text-base"
                      >
                        Innovation Rating (1-10)
                      </Label>
                      <Input
                        id="innovationRating"
                        name="innovationRating"
                        type="number"
                        min="1"
                        max="10"
                        value={productForm.innovationRating}
                        onChange={handleInputChange}
                        required
                        className="bg-gray-700 text-white border-gray-600 w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="sustainabilityRating"
                        className="text-sm sm:text-base"
                      >
                        Sustainability Rating (1-10)
                      </Label>
                      <Input
                        id="sustainabilityRating"
                        name="sustainabilityRating"
                        type="number"
                        min="1"
                        max="10"
                        value={productForm.sustainabilityRating}
                        onChange={handleInputChange}
                        required
                        className="bg-gray-700 text-white border-gray-600 w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="productionCost"
                        className="text-sm sm:text-base"
                      >
                        Production Cost ($)
                      </Label>
                      <Input
                        id="productionCost"
                        name="productionCost"
                        type="number"
                        min="0"
                        value={productForm.productionCost}
                        onChange={handleInputChange}
                        required
                        className="bg-gray-700 text-white border-gray-600 w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="sellingPrice"
                        className="text-sm sm:text-base"
                      >
                        Selling Price ($)
                      </Label>
                      <Input
                        id="sellingPrice"
                        name="sellingPrice"
                        type="number"
                        min="0"
                        value={productForm.sellingPrice}
                        onChange={handleInputChange}
                        required
                        className="bg-gray-700 text-white border-gray-600 w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="developmentCost"
                        className="text-sm sm:text-base"
                      >
                        Development Cost ($)
                      </Label>
                      <Input
                        id="developmentCost"
                        name="developmentCost"
                        type="number"
                        min="0"
                        value={productForm.developmentCost}
                        onChange={handleInputChange}
                        required
                        className="bg-gray-700 text-white border-gray-600 w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status" className="text-sm sm:text-base">
                        Status
                      </Label>
                      <Select
                        name="status"
                        value={productForm.status}
                        onValueChange={(value) =>
                          handleSelectChange("status", value)
                        }
                      >
                        <SelectTrigger className="bg-gray-700 text-white border-gray-600 w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 text-white border-gray-600">
                          <SelectItem value="development">
                            Development
                          </SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="discontinued">
                            Discontinued
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      type="submit"
                      className="w-full sm:col-span-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors duration-200"
                    >
                      Create Product
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Market Information */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
            <h2 className="text-2xl font-semibold mb-6 text-white border-b border-gray-600 pb-2">
              Market Information
            </h2>

            {marketConditions && (
              <div className="mb-8">
                <h3 className="text-xl font-medium mb-4 text-gray-200">
                  Market Conditions
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="bg-teal-900 p-6 rounded-lg border border-teal-700">
                    <p className="text-teal-300 font-medium mb-2">
                      Total Market Size
                    </p>
                    <p className="text-2xl font-bold text-teal-100">
                      ${marketConditions.totalMarketSize.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-emerald-900 p-6 rounded-lg border border-emerald-700">
                    <p className="text-emerald-300 font-medium mb-2">
                      Sustainability Importance
                    </p>
                    <p className="text-2xl font-bold text-emerald-100">
                      {(
                        marketConditions.sustainabilityImportance * 100
                      ).toFixed(1)}
                      %
                    </p>
                  </div>
                  <div className="bg-cyan-900 p-6 rounded-lg border border-cyan-700">
                    <p className="text-cyan-300 font-medium mb-2">
                      Market Segments
                    </p>
                    <p className="text-2xl font-bold text-cyan-100">
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
                <h3 className="text-xl font-medium mb-4 text-gray-200">
                  Market Events
                </h3>
                <div className="space-y-4">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="bg-amber-900 p-6 rounded-lg border border-amber-700"
                    >
                      <h4 className="font-semibold text-lg text-amber-200 mb-2">
                        {event.name}
                      </h4>
                      <p className="text-gray-300 mb-3">{event.description}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <span className="bg-amber-800 text-amber-200 px-3 py-1 rounded-full font-medium">
                          Impact: {event.impactArea}
                        </span>
                        <span className="bg-amber-800 text-amber-200 px-3 py-1 rounded-full font-medium">
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
      </div>
    </AppLayout>
  );
}
