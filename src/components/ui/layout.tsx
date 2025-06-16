import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  header: React.ReactNode;
  className?: string;
}

export function Layout({ children, sidebar, header, className = '' }: LayoutProps) {
  return (
    <div className={`flex h-screen bg-gray-100 ${className}`}>
      {sidebar}
      <div className="flex-1 flex flex-col overflow-hidden">
        {header}
        <main className="flex-1 overflow-y-auto p-6, text-primary">
          {children}
        </main>
      </div>
    </div>
  );
}
