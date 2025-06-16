import React from 'react';

interface SidebarProps {
  children: React.ReactNode;
  className?: string;
}

export function Sidebar({ children, className = '' }: SidebarProps) {
  return (
    <div className={`w-64 bg-gray-900 text-white flex flex-col h-screen ${className}`}>
      {children}
    </div>
  );
}

interface SidebarLogoProps {
  children: React.ReactNode;
  className?: string;
}

export function SidebarLogo({ children, className = '' }: SidebarLogoProps) {
  return (
    <div className={`flex items-center p-6 ${className}`}>
      {children}
    </div>
  );
}

interface SidebarNavProps {
  children: React.ReactNode;
  className?: string;
}

export function SidebarNav({ children, className = '' }: SidebarNavProps) {
  return (
    <nav className={`flex-1 px-4 ${className}`}>
      {children}
    </nav>
  );
}

interface SidebarNavGroupProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function SidebarNavGroup({ title, children, className = '' }: SidebarNavGroupProps) {
  return (
    <div className={`mb-6 ${className}`}>
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
        {title}
      </h3>
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
}

interface SidebarNavItemProps {
  href: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  active?: boolean;
  className?: string;
}

export function SidebarNavItem({ 
  href, 
  icon, 
  children, 
  active = false, 
  className = '' 
}: SidebarNavItemProps) {
  return (
    <a
      href={href}
      className={`
        flex items-center px-3 py-2 text-sm font-medium rounded-md
        ${active 
          ? 'bg-indigo-600 text-white' 
          : 'text-gray-300 hover:bg-gray-800 hover:text-white'}
        ${className}
      `}
    >
      {icon && <span className="mr-3">{icon}</span>}
      {children}
    </a>
  );
}

interface SidebarFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function SidebarFooter({ children, className = '' }: SidebarFooterProps) {
  return (
    <div className={`p-4 border-t border-gray-700 ${className}`}>
      {children}
    </div>
  );
}
