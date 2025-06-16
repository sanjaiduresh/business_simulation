import React from 'react';

interface HeaderProps {
  title: string;
  actions?: React.ReactNode;
  className?: string;
}

export function Header({ title, actions, className = '' }: HeaderProps) {
  return (
    <div className={`bg-background border-b border-gray-800 px-6 py-4 flex items-center justify-between ${className}`}>
      <h1 className="text-xl font-semibold text-white">{title}</h1>
      {actions && <div className="flex items-center space-x-4">{actions}</div>}
    </div>
  );
}
