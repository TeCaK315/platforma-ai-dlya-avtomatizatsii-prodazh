'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantStyles = {
    primary: 'bg-gradient-to-r from-[#4A90E2] to-[#357ABD] text-white hover:shadow-lg hover:shadow-[#4A90E2]/50 hover:scale-105 focus:ring-[#4A90E2]',
    secondary: 'bg-gradient-to-r from-[#50E3C2] to-[#3BB89F] text-gray-900 hover:shadow-lg hover:shadow-[#50E3C2]/50 hover:scale-105 focus:ring-[#50E3C2]',
    accent: 'bg-gradient-to-r from-[#F5A623] to-[#D68910] text-white hover:shadow-lg hover:shadow-[#F5A623]/50 hover:scale-105 focus:ring-[#F5A623]',
    outline: 'border-2 border-[#4A90E2] text-[#4A90E2] hover:bg-[#4A90E2] hover:text-white focus:ring-[#4A90E2]',
    ghost: 'text-gray-300 hover:bg-gray-800 hover:text-white focus:ring-gray-700'
  };
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
};