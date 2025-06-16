import React from 'react';

interface FormProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  className?: string;
}

export function Form({ children, onSubmit, className = '' }: FormProps) {
  return (
    <form onSubmit={onSubmit} className={className}>
      {children}
    </form>
  );
}

interface FormGroupProps {
  children: React.ReactNode;
  className?: string;
}

export function FormGroup({ children, className = '' }: FormGroupProps) {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
}

interface FormLabelProps {
  htmlFor: string;
  children: React.ReactNode;
  className?: string;
}

export function FormLabel({ htmlFor, children, className = '' }: FormLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-medium text-gray-700 mb-1 ${className}`}
    >
      {children}
    </label>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  error?: string;
  className?: string;
}

export function Input({ id, error, className = '', ...props }: InputProps) {
  return (
    <>
      <input
        id={id}
        className={`
          block w-full rounded-md border-gray-300 shadow-sm 
          focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm
          ${error ? 'border-red-300' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  options: { value: string; label: string }[];
  error?: string;
  className?: string;
}

export function Select({ id, options, error, className = '', ...props }: SelectProps) {
  return (
    <>
      <select
        id={id}
        className={`
          block w-full rounded-md border-gray-300 shadow-sm 
          focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm
          ${error ? 'border-red-300' : ''}
          ${className}
        `}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  error?: string;
  className?: string;
}

export function Textarea({ id, error, className = '', ...props }: TextareaProps) {
  return (
    <>
      <textarea
        id={id}
        className={`
          block w-full rounded-md border-gray-300 shadow-sm 
          focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm
          ${error ? 'border-red-300' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </>
  );
}
