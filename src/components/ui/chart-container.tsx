import React from 'react';

interface ChartContainerProps {
  children: React.ReactNode;
  height?: string;
  className?: string;
}

export function ChartContainer({ 
  children, 
  height = 'h-80', 
  className = '' 
}: ChartContainerProps) {
  return (
    <div className={`${height} w-full ${className}`}>
      {children}
    </div>
  );
}
