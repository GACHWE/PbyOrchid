import React from 'react';

export default function LoadingSpinner({ size = 'medium' }) {
  const sizeClass = size === 'small' ? 'w-6 h-6' : size === 'large' ? 'w-12 h-12' : 'w-8 h-8';
  return (
    <div className="flex justify-center items-center">
      <div className={`${sizeClass} border-4 border-app-border border-t-primary-accent rounded-full animate-spin`} />
    </div>
  );
}