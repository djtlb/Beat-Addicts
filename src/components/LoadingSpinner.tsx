import React from 'react';
import { Loader2, Music } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = '',
  text
}) => {
  console.log('LoadingSpinner rendered:', { size, text });

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-12 h-12'
  };

  const containerClasses = {
    sm: 'space-y-1',
    md: 'space-y-2',
    lg: 'space-y-4'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${containerClasses[size]} ${className}`}>
      <div className="relative">
        {size === 'lg' && (
          <div className="absolute inset-0 animate-pulse">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-electric-500 rounded-full opacity-20"></div>
          </div>
        )}
        <div className="relative flex items-center justify-center">
          {size === 'lg' ? (
            <Music className={`${sizeClasses[size]} text-primary animate-bounce`} />
          ) : (
            <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
          )}
        </div>
      </div>
      {text && (
        <p className={`text-muted-foreground text-center ${
          size === 'lg' ? 'text-base' : 'text-sm'
        }`}>
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;