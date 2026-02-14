'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  gradient?: boolean;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className = '', gradient = false, hover = true, onClick }: CardProps) {
  const baseClasses = 'bg-gray-900 rounded-lg shadow-lg p-6 transition-all duration-300';
  const hoverClasses = hover ? 'hover:shadow-xl hover:scale-[1.02]' : '';
  const gradientClasses = gradient ? 'border-2 border-transparent bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800' : '';
  const cursorClass = onClick ? 'cursor-pointer' : '';

  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${gradientClasses} ${cursorClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}