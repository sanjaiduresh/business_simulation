import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function Card({ title, children, actions, className = '' }: CardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm overflow-hidden ${className}`}>
      {(title || actions) && (
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {title && <h2 className="font-semibold text-gray-700">{title}</h2>}
          {actions && <div className="flex items-center">{actions}</div>}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}
