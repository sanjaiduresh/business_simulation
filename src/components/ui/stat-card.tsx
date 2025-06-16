import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  format?: 'number' | 'currency' | 'percent';
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

export function StatCard({ 
  title, 
  value, 
  change, 
  format = 'number',
  trend,
  className = '' 
}: StatCardProps) {
  // Format the value based on the format prop
  const formattedValue = React.useMemo(() => {
    if (typeof value === 'string') return value;
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', { 
          style: 'currency', 
          currency: 'USD',
          maximumFractionDigits: 0
        }).format(value);
      case 'percent':
        return new Intl.NumberFormat('en-US', { 
          style: 'percent',
          minimumFractionDigits: 1,
          maximumFractionDigits: 1
        }).format(value / 100);
      default:
        return new Intl.NumberFormat('en-US').format(value);
    }
  }, [value, format]);

  // Determine trend if not explicitly provided
  const determinedTrend = trend || (change ? (change > 0 ? 'up' : change < 0 ? 'down' : 'neutral') : undefined);
  
  // Format the change value
  const formattedChange = change !== undefined ? (
    <span className={`flex items-center text-sm font-medium ${
      determinedTrend === 'up' ? 'text-green-600' : 
      determinedTrend === 'down' ? 'text-red-600' : 
      'text-gray-500'
    }`}>
      {determinedTrend === 'up' && (
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      )}
      {determinedTrend === 'down' && (
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      )}
      {determinedTrend === 'neutral' && (
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
        </svg>
      )}
      {Math.abs(change).toFixed(1)}%
    </span>
  ) : null;

  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      <div className="text-sm font-medium text-gray-500">{title}</div>
      <div className="mt-2 flex items-baseline">
        <div className="text-2xl font-semibold text-gray-900">{formattedValue}</div>
        {formattedChange && <div className="ml-2">{formattedChange}</div>}
      </div>
    </div>
  );
}
