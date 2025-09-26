import React from 'react';
import { Loader2, Music, Disc3, Mic, Radio } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
  type?: 'vinyl' | 'mic' | 'radio' | 'music' | 'default';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = '',
  text,
  type = 'vinyl'
}) => {
  console.log('LoadingSpinner rendered:', { size, text, type });

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-16 h-16'
  };

  const containerClasses = {
    sm: 'space-y-2',
    md: 'space-y-3',
    lg: 'space-y-4'
  };

  const getIcon = () => {
    switch (type) {
      case 'vinyl':
        return (
          <div className="relative">
            <Disc3 className={`${sizeClasses[size]} text-purple-400 animate-spin`} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            </div>
          </div>
        );
      case 'mic':
        return (
          <div className="relative">
            <Mic className={`${sizeClasses[size]} text-red-400`} />
            <div className="absolute -top-1 -right-1">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
              <div className="absolute inset-0 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        );
      case 'radio':
        return (
          <div className="relative">
            <Radio className={`${sizeClasses[size]} text-cyan-400 animate-pulse`} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce"></div>
            </div>
          </div>
        );
      case 'music':
        return <Music className={`${sizeClasses[size]} text-emerald-400 animate-bounce`} />;
      default:
        return <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />;
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center ${containerClasses[size]} ${className}`}>
      <div className="relative">
        {size === 'lg' && (
          <div className="absolute inset-0 animate-pulse">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full"></div>
          </div>
        )}
        <div className="relative flex items-center justify-center">
          {getIcon()}
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
export { LoadingSpinner };