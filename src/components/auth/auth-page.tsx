"use client";

import React, { useState } from 'react';
import { LoginForm } from './login-form';
import { RegisterForm } from './register-form';

interface AuthPageProps {
  onAuthSuccess?: () => void;
}

export function AuthPage({ onAuthSuccess }: AuthPageProps) {
  const [showLogin, setShowLogin] = useState(true);

  const handleAuthSuccess = () => {
    if (onAuthSuccess) onAuthSuccess();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-3xl font-extrabold text-gray-900">
            Business Simulation
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Make strategic decisions and grow your virtual company
          </p>
        </div>

        {showLogin ? (
          <LoginForm 
            onSuccess={handleAuthSuccess} 
            onRegisterClick={() => setShowLogin(false)} 
          />
        ) : (
          <RegisterForm 
            onSuccess={handleAuthSuccess} 
            onLoginClick={() => setShowLogin(true)} 
          />
        )}
      </div>
    </div>
  );
}
