'use client';

import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'high' | 'medium' | 'low' | 'active' | 'inactive' | 'pending' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'info',
  size = 'md',
  className = ''
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full';
  
  const variantStyles = {
    high: 'bg-red-500/20 text-red-400 border border-red-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    low: 'bg-green-500/20 text-green-400 border border-green-500/30',
    active: 'bg-green-500/20 text-green-400 border border-green-500/30',
    inactive: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
    pending: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    success: 'bg-[#50E3C2]/20 text-[#50E3C2] border border-[#50E3C2]/30',
    warning: 'bg-[#F5A623]/20 text-[#F5A623] border border-[#F5A623]/30',
    error: 'bg-red-500/20 text-red-400 border border-red-500/30',
    info: 'bg-[#4A90E2]/20 text-[#4A90E2] border border-[#4A90E2]/30'
  };
  
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  };

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
      {children}
    </span>
  );
};