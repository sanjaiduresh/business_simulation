"use client";

import React, { useState } from 'react';
import { useSimulation } from '../simulation/simulation-context';
import { useDecisionSubmission } from '../simulation/use-decision-submission';

export function ProductManagement() {
  const { state, userCompany, companyProducts } = useSimulation();
  const { submitProductDevelopment, submitProduction, submitPricing, submitMarketing } = useDecisionSubmission();
  const [activeTab, setActiveTab] = useState('products');
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  
  // Form states
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    description: '',
    category: 'mid-range',
    qualityRating: 5,
    innovationRating: 5,
    sustainabilityRating: 5,
    productionCost: 100,
    sellingPrice: 200,
    productionCapacity: 2000,
    developmentCost: 100000,
    developmentTime: 1
  });
  
  const [productionForm, setProductionForm] = useState({
    productionVolume: 1000
  });
  
  const [pricingForm, setPricingForm] = useState({
    price: 0
  });
  
  const [marketingForm, setMarketingForm] = useState({
    budget: 10000
  });
  
  // Handle new product submission
  const handleNewProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitProductDevelopment({
      action: 'new_product',
      ...newProductForm
    });
    
    // Reset form
    setNewProductForm({
      name: '',
      description: '',
      category: 'mid-range',
      qualityRating: 5,
      innovationRating: 5,
      sustainabilityRating: 5,
      productionCost: 100,
      sellingPrice: 200,
      productionCapacity: 2000,
      developmentCost: 100000,
      developmentTime: 1
    });
  };
  
  // Handle production submission
  const handleProductionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    
    submitProduction({
      productId: selectedProduct,
      productionVolume: productionForm.productionVolume
    });
  };
  
  // Handle pricing submission
  const handlePricingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    
    submitPricing({
      productId: selectedProduct,
      price: pricingForm.price
    });
  };
  
  // Handle marketing submission
  const handleMarketingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    
    submitMarketing({
      productId: selectedProduct,
      budget: marketingForm.budget
    });
  };
  
  // Handle product selection
  const handleProductSelect = (productId: string) => {
    setSelectedProduct(productId);
    
    // Find the product
    const product = companyProducts.find(p => p.id === productId);
    if (product) {
      // Update form values
      setPricingForm({
        price: product.sellingPrice
      });
    }
  };
  
  if (!state || !userCompany) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold">Loading product data...</h2>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Product Management</h1>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('products')}
            className={`${
              activeTab === 'products'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Current Products
          </button>
          <button
            onClick={() => setActiveTab('new')}
            className={`${
              activeTab === 'new'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            New Product
          </button>
          <button
            onClick={() => setActiveTab('production')}
            className={`${
              activeTab === 'production'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Production
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            className={`${
              activeTab === 'pricing'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Pricing
          </button>
          <button
            onClick={() => setActiveTab('marketing')}
            className={`${
              activeTab === 'marketing'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Marketing
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {activeTab === 'products' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Current Products</h2>
            
            {companyProducts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">You don't have any products yet.</p>
                <button
                  onClick={() => setActiveTab('new')}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Create Your First Product
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {companyProducts.map((product) => (
                  <div 
                    key={product.id} 
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedProduct === product.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => handleProductSelect(product.id)}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-medium">{product.name}</h3>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.status === 'active' ? 'bg-green-100 text-green-800' : 
                        product.status === 'development' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mt-1">{product.description}</p>
                    
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Category</p>
                        <p className="font-medium">{product.category.charAt(0).toUpperCase() + product.category.slice(1)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Price</p>
                        <p className="font-medium">${product.sellingPrice}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Production Cost</p>
                        <p className="font-medium">${product.productionCost}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Inventory</p>
                        <p className="font-medium">{product.inventoryLevel} units</p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-1">Quality Rating</p>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${product.qualityRating * 10}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 mb-1">Innovation Rating</p>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ width: `${product.innovationRating * 10}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 mb-1">Sustainability Rating</p>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${product.sustainabilityRating * 10}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProduct(product.id);
                          setActiveTab('production');
                        }}
                        className="text-blue-600 hover:text-blue-900 text-sm"
                      >
                        Production
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProduct(product.id);
                          setActiveTab('pricing');
                        }}
                        className="text-green-600 hover:text-green-900 text-sm"
                      >
                        Pricing
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProduct(product.id);
                          setActiveTab('marketing');
                        }}
                        className="text-purple-600 hover:text-purple-900 text-sm"
                      >
                        Marketing
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'new' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Develop New Product</h2>
            
            <form onSubmit={handleNewProductSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={newProductForm.name}
                    onChange={(e) => setNewProductForm({...newProductForm, name: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={newProductForm.category}
                    onChange={(e) => setNewProductForm({...newProductForm, category: e.target.value})}
                    required
                  >
                    <option value="budget">Budget</option>
                    <option value="mid-range">Mid-Range</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    rows={3}
                    value={newProductForm.description}
                    onChange={(e) => setNewProductForm({...newProductForm, description: e.target.value})}
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quality Rating (1-10)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.1"
                    className="w-full"
                    value={newProductForm.qualityRating}
                    onChange={(e) => setNewProductForm({...newProductForm, qualityRating: parseFloat(e.target.value)})}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Low</span>
                    <span>Medium</span>
                    <span>High</span>
                  </div>
                  <p className="text-center mt-1">{newProductForm.qualityRating.toFixed(1)}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Innovation Rating (1-10)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.1"
                    className="w-full"
                    value={newProductForm.innovationRating}
                    onChange={(e) => setNewProductForm({...newProductForm, innovationRating: parseFloat(e.target.value)})}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Low</span>
                    <span>Medium</span>
                    <span>High</span>
                  </div>
                  <p className="text-center mt-1">{newProductForm.innovationRating.toFixed(1)}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sustainability Rating (1-10)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.1"
                    className="w-full"
                    value={newProductForm.sustainabilityRating}
                    onChange={(e) => setNewProductForm({...newProductForm, sustainabilityRating: parseFloat(e.target.value)})}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Low</span>
                    <span>Medium</span>
                    <span>High</span>
                  </div>
                  <p className="text-center mt-1">{newProductForm.sustainabilityRating.toFixed(1)}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Production Cost ($)
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={newProductForm.productionCost}
                    onChange={(e) => setNewProductForm({...newProductForm, productionCost: parseInt(e.target.value)})}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Selling Price ($)
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={newProductForm.sellingPrice}
                    onChange={(e) => setNewProductForm({...newProductForm, sellingPrice: parseInt(e.target.value)})}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Production Capacity (units)
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={newProductForm.productionCapacity}
                    onChange={(e) => setNewProductForm({...newProductForm, productionCapacity: parseInt(e.target.value)})}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Development Cost ($)
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={newProductForm.developmentCost}
                    onChange={(e) => setNewProductForm({...newProductForm, developmentCost: parseInt(e.target.value)})}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Development Time (periods)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={newProductForm.developmentTime}
                    onChange={(e) => setNewProductForm({...newProductForm, developmentTime: parseInt(e.target.value)})}
                    required
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Develop Product
                </button>
              </div>
            </form>
          </div>
        )}
        
        {activeTab === 'production' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Production Management</h2>
            
            {!selectedProduct ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Please select a product first.</p>
                <button
                  onClick={() => setActiveTab('products')}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Select Product
                </button>
              </div>
            ) : (
              <div>
                {(() => {
                  const product = companyProducts.find(p => p.id === selectedProduct);
                  if (!product) return null;
                  
                  return (
                    <div className="mb-6">
                      <h3 className="font-medium mb-2">Selected Product: {product.name}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-4 rounded-md">
                          <p className="text-gray-600">Current Inventory</p>
                          <p className="text-xl font-bold">{product.inventoryLevel} units</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <p className="text-gray-600">Production Capacity</p>
                          <p className="text-xl font-bold">{product.productionCapacity} units</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <p className="text-gray-600">Production Cost</p>
                          <p className="text-xl font-bold">${product.productionCost} per unit</p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
                
                <form onSubmit={handleProductionSubmit}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Production Volume (units)
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={productionForm.productionVolume}
                      onChange={(e) => setProductionForm({...productionForm, productionVolume: parseInt(e.target.value)})}
                      required
                    />
                  </div>
                  
                  <div className="mt-4">
                    {(() => {
                      const product = companyProducts.find(p => p.id === selectedProduct);
                      if (!product) return null;
                      
                      const totalCost = product.productionCost * productionForm.productionVolume;
                      
                      return (
                        <div className="bg-blue-50 p-4 rounded-md">
                          <p className="font-medium">Production Summary</p>
                          <p className="mt-1">Total production cost: ${totalCost.toLocaleString()}</p>
                          <p>New inventory level: {product.inventoryLevel + productionForm.productionVolume} units</p>
                          <p className="mt-2 text-sm text-gray-600">
                            Note: Production costs will be deducted from your cash balance immediately.
                          </p>
                        </div>
                      );
                    })()}
                  </div>
                  
                  <div className="mt-6">
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Produce Units
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'pricing' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Pricing Management</h2>
            
            {!selectedProduct ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Please select a product first.</p>
                <button
                  onClick={() => setActiveTab('products')}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Select Product
                </button>
              </div>
            ) : (
              <div>
                {(() => {
                  const product = companyProducts.find(p => p.id === selectedProduct);
                  if (!product) return null;
                  
                  return (
                    <div className="mb-6">
                      <h3 className="font-medium mb-2">Selected Product: {product.name}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-4 rounded-md">
                          <p className="text-gray-600">Current Price</p>
                          <p className="text-xl font-bold">${product.sellingPrice}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <p className="text-gray-600">Production Cost</p>
                          <p className="text-xl font-bold">${product.productionCost}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <p className="text-gray-600">Profit Margin</p>
                          <p className="text-xl font-bold">
                            {((product.sellingPrice - product.productionCost) / product.sellingPrice * 100).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
                
                <form onSubmit={handlePricingSubmit}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Price ($)
                    </label>
                    <input
                      type="number"
                      min="1"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={pricingForm.price}
                      onChange={(e) => setPricingForm({...pricingForm, price: parseInt(e.target.value)})}
                      required
                    />
                  </div>
                  
                  <div className="mt-4">
                    {(() => {
                      const product = companyProducts.find(p => p.id === selectedProduct);
                      if (!product) return null;
                      
                      const newMargin = (pricingForm.price - product.productionCost) / pricingForm.price * 100;
                      const priceChange = ((pricingForm.price - product.sellingPrice) / product.sellingPrice * 100);
                      
                      return (
                        <div className="bg-blue-50 p-4 rounded-md">
                          <p className="font-medium">Pricing Summary</p>
                          <p className="mt-1">New profit margin: {newMargin.toFixed(1)}%</p>
                          <p>Price change: 
                            <span className={priceChange >= 0 ? 'text-green-600' : 'text-red-600'}>
                              {' '}{priceChange >= 0 ? '+' : ''}{priceChange.toFixed(1)}%
                            </span>
                          </p>
                          <p className="mt-2 text-sm text-gray-600">
                            Note: Price changes may affect demand for your product.
                          </p>
                        </div>
                      );
                    })()}
                  </div>
                  
                  <div className="mt-6">
                    <button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Update Price
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'marketing' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Marketing Management</h2>
            
            {!selectedProduct ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Please select a product first.</p>
                <button
                  onClick={() => setActiveTab('products')}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Select Product
                </button>
              </div>
            ) : (
              <div>
                {(() => {
                  const product = companyProducts.find(p => p.id === selectedProduct);
                  if (!product) return null;
                  
                  return (
                    <div className="mb-6">
                      <h3 className="font-medium mb-2">Selected Product: {product.name}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-md">
                          <p className="text-gray-600">Current Marketing Budget</p>
                          <p className="text-xl font-bold">${product.marketingBudget.toLocaleString()}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <p className="text-gray-600">Marketing as % of Price</p>
                          <p className="text-xl font-bold">
                            {(product.marketingBudget / (product.sellingPrice * 100)).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
                
                <form onSubmit={handleMarketingSubmit}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Marketing Budget ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={marketingForm.budget}
                      onChange={(e) => setMarketingForm({...marketingForm, budget: parseInt(e.target.value)})}
                      required
                    />
                  </div>
                  
                  <div className="mt-4">
                    <div className="bg-blue-50 p-4 rounded-md">
                      <p className="font-medium">Marketing Impact</p>
                      <p className="mt-1">Estimated effectiveness: {Math.min(10, Math.sqrt(marketingForm.budget / 10000) * 5).toFixed(1)} / 10</p>
                      <p className="mt-2 text-sm text-gray-600">
                        Note: Marketing costs will be deducted from your cash balance immediately.
                        Higher marketing budgets increase product visibility and can boost sales,
                        but with diminishing returns.
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button
                      type="submit"
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Set Marketing Budget
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
