"use client";

import React, { useState } from 'react';
import { useSimulation } from '../simulation/simulation-context';
import { useSimulationData } from '../simulation/use-simulation-data';

export function MarketAnalysis() {
  const { state } = useSimulation();
  const { getMarketConditions, getMarketSegments, getCompetitors } = useSimulationData();
  const [activeTab, setActiveTab] = useState('overview');
  
  const marketConditions = getMarketConditions();
  const marketSegments = getMarketSegments();
  const competitors = getCompetitors();
  
  if (!state || !marketConditions) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold">Loading market data...</h2>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Market Analysis</h1>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Market Overview
          </button>
          <button
            onClick={() => setActiveTab('segments')}
            className={`${
              activeTab === 'segments'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Market Segments
          </button>
          <button
            onClick={() => setActiveTab('competitors')}
            className={`${
              activeTab === 'competitors'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Competitor Analysis
          </button>
          <button
            onClick={() => setActiveTab('trends')}
            className={`${
              activeTab === 'trends'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Market Trends
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {activeTab === 'overview' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Market Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-gray-600">Total Market Size</p>
                <p className="text-2xl font-bold">${marketConditions.totalMarketSize.toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-gray-600">Number of Segments</p>
                <p className="text-2xl font-bold">{Object.keys(JSON.parse(marketConditions.segmentDistribution)).length}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-gray-600">Major Competitors</p>
                <p className="text-2xl font-bold">{competitors.length}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Economic Indicators</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(JSON.parse(marketConditions.economicIndicators)).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 p-4 rounded-md">
                    <p className="text-gray-600">{key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</p>
                    <p className="text-xl font-bold">
                      {typeof value === 'number' 
                        ? key.includes('rate') 
                          ? `${(value as number * 100).toFixed(1)}%` 
                          : value.toFixed(2)
                        : value as string}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Sustainability Importance</h3>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-green-600 h-4 rounded-full" 
                  style={{ width: `${marketConditions.sustainabilityImportance * 100}%` }}
                ></div>
              </div>
              <p className="mt-2 text-gray-600">
                Sustainability is currently valued at {(marketConditions.sustainabilityImportance * 100).toFixed(1)}% importance by consumers
              </p>
            </div>
          </div>
        )}
        
        {activeTab === 'segments' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Market Segments</h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Segment
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Size
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Share
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Growth
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Price Range
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Quality Sensitivity
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Price Sensitivity
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {marketSegments.map((segment) => (
                    <tr key={segment.id}>
                      <td className="py-2 px-4 border-b border-gray-200 font-medium">
                        {segment.name}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        ${segment.size.toLocaleString()}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {segment.share.toFixed(1)}%
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        <span className={segment.growth >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {segment.growth >= 0 ? '+' : ''}{segment.growth.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {segment.priceRange}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          segment.qualitySensitivity === 'High' ? 'bg-red-100 text-red-800' : 
                          segment.qualitySensitivity === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-green-100 text-green-800'
                        }`}>
                          {segment.qualitySensitivity}
                        </span>
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          segment.priceSensitivity === 'High' ? 'bg-red-100 text-red-800' : 
                          segment.priceSensitivity === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-green-100 text-green-800'
                        }`}>
                          {segment.priceSensitivity}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Consumer Preferences by Segment</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {marketSegments.map((segment) => (
                  <div key={segment.id} className="bg-gray-50 p-4 rounded-md">
                    <h4 className="font-semibold mb-2">{segment.name} Segment</h4>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-gray-600">Quality Sensitivity</p>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: segment.qualitySensitivity === 'High' ? '80%' : segment.qualitySensitivity === 'Medium' ? '50%' : '20%' }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Price Sensitivity</p>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: segment.priceSensitivity === 'High' ? '80%' : segment.priceSensitivity === 'Medium' ? '50%' : '20%' }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Innovation Preference</p>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full" 
                            style={{ width: segment.innovationPreference === 'High' ? '80%' : segment.innovationPreference === 'Medium' ? '50%' : '20%' }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Sustainability Preference</p>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-yellow-600 h-2 rounded-full" 
                            style={{ width: segment.sustainabilityPreference === 'High' ? '80%' : segment.sustainabilityPreference === 'Medium' ? '50%' : '20%' }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'competitors' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Competitor Analysis</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {competitors.map((competitor) => (
                <div key={competitor.id} className="bg-gray-50 p-4 rounded-md">
                  <h3 className="text-lg font-medium">{competitor.name}</h3>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-600">Market Share</p>
                      <p className="text-xl font-bold">{competitor.marketShare.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Growth</p>
                      <p className={`text-xl font-bold ${competitor.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {competitor.growth >= 0 ? '+' : ''}{competitor.growth.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="font-medium mb-1">Strategy</h4>
                    <p>{competitor.strategy}</p>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-1">Strengths</h4>
                      <ul className="list-disc list-inside text-sm">
                        {competitor.strengths.map((strength, index) => (
                          <li key={index}>{strength}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Weaknesses</h4>
                      <ul className="list-disc list-inside text-sm">
                        {competitor.weaknesses.map((weakness, index) => (
                          <li key={index}>{weakness}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="font-medium mb-1">Products</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead>
                          <tr>
                            <th className="py-1 px-2 text-left text-xs font-semibold text-gray-600">Name</th>
                            <th className="py-1 px-2 text-left text-xs font-semibold text-gray-600">Segment</th>
                            <th className="py-1 px-2 text-left text-xs font-semibold text-gray-600">Price</th>
                            <th className="py-1 px-2 text-left text-xs font-semibold text-gray-600">Quality</th>
                            <th className="py-1 px-2 text-left text-xs font-semibold text-gray-600">Share</th>
                          </tr>
                        </thead>
                        <tbody>
                          {competitor.products.map((product, index) => (
                            <tr key={index}>
                              <td className="py-1 px-2 text-sm">{product.name}</td>
                              <td className="py-1 px-2 text-sm">{product.segment}</td>
                              <td className="py-1 px-2 text-sm">${product.price}</td>
                              <td className="py-1 px-2 text-sm">{product.quality.toFixed(1)}</td>
                              <td className="py-1 px-2 text-sm">{product.share}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-blue-50 p-4 rounded-md">
              <h3 className="text-lg font-medium mb-2">Competitive Landscape</h3>
              <p className="mb-4">
                The market is currently dominated by {competitors[0].name} with {competitors[0].marketShare.toFixed(1)}% market share,
                followed by {competitors[1].name} with {competitors[1].marketShare.toFixed(1)}% market share.
                Your company currently has a {state.performanceResults.length > 0 
                  ? (state.performanceResults[state.performanceResults.length - 1].marketShare * 100).toFixed(1) 
                  : '0.0'}% market share.
              </p>
              <p>
                The fastest growing competitor is {competitors.sort((a, b) => b.growth - a.growth)[0].name} 
                with {competitors.sort((a, b) => b.growth - a.growth)[0].growth.toFixed(1)}% growth.
              </p>
            </div>
          </div>
        )}
        
        {activeTab === 'trends' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Market Trends</h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Technology Trends</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {JSON.parse(marketConditions.technologyTrends).map((trend: any, index: number) => (
                  <div key={index} className="bg-purple-50 p-4 rounded-md">
                    <h4 className="font-semibold">{trend.name}</h4>
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">Impact Area: {trend.impact_area.split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</p>
                      <p className="text-sm text-gray-600">Impact Strength: {(trend.impact_strength * 100).toFixed(0)}%</p>
                      <p className="text-sm text-gray-600">Adoption Rate: {(trend.adoption_rate * 100).toFixed(0)}%</p>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">Adoption Progress</p>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ width: `${trend.adoption_rate * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Consumer Trend: Sustainability</h3>
              <div className="bg-green-50 p-4 rounded-md">
                <p className="mb-2">
                  Consumer preference for sustainable products has been steadily increasing.
                  Currently, sustainability importance is at {(marketConditions.sustainabilityImportance * 100).toFixed(1)}%.
                </p>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">Sustainability Importance Trend</p>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-green-600 h-4 rounded-full" 
                      style={{ width: `${marketConditions.sustainabilityImportance * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>0%</span>
                    <span>25%</span>
                    <span>50%</span>
                    <span>75%</span>
                    <span>100%</span>
                  </div>
                </div>
                <p className="mt-4 text-sm">
                  Companies with higher sustainability ratings are seeing increased consumer preference,
                  particularly in the premium and mid-range segments.
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Economic Outlook</h3>
              <div className="bg-blue-50 p-4 rounded-md">
                <p className="mb-4">
                  The current economic indicators suggest a {
                    JSON.parse(marketConditions.economicIndicators).gdp_growth > 0.025 ? 'strong' : 
                    JSON.parse(marketConditions.economicIndicators).gdp_growth > 0 ? 'moderate' : 'weak'
                  } economy with {
                    JSON.parse(marketConditions.economicIndicators).gdp_growth > 0 ? 'growth' : 'contraction'
                  } of {(JSON.parse(marketConditions.economicIndicators).gdp_growth * 100).toFixed(1)}%.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Consumer Confidence</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${Math.min(100, JSON.parse(marketConditions.economicIndicators).consumer_confidence)}%` }}
                      ></div>
                    </div>
                    <p className="mt-1 text-sm">{JSON.parse(marketConditions.economicIndicators).consumer_confidence.toFixed(1)} / 100</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Business Sentiment</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${Math.min(100, JSON.parse(marketConditions.economicIndicators).business_sentiment)}%` }}
                      ></div>
                    </div>
                    <p className="mt-1 text-sm">{JSON.parse(marketConditions.economicIndicators).business_sentiment.toFixed(1)} / 100</p>
                  </div>
                </div>
                <p className="mt-4 text-sm">
                  The inflation rate is currently at {(JSON.parse(marketConditions.economicIndicators).inflation_rate * 100).toFixed(1)}%
                  and interest rates are at {(JSON.parse(marketConditions.economicIndicators).interest_rate * 100).toFixed(1)}%.
                  These factors may influence consumer purchasing power and business financing costs.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
