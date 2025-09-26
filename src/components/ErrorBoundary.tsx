import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    console.error('🚨 ErrorBoundary caught error:', error);
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🚨 ErrorBoundary componentDidCatch:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  private handleRetry = () => {
    console.log('🔄 ErrorBoundary: Retrying...');
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  private handleGoHome = () => {
    console.log('🏠 ErrorBoundary: Navigating to home...');
    window.location.href = '/';
  };

  private handleRefresh = () => {
    console.log('🔄 ErrorBoundary: Refreshing page...');
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      console.log('🚨 ErrorBoundary rendering error state');
      
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-900/20 to-red-900 flex items-center justify-center p-8">
          <div className="max-w-md w-full bg-red-950/50 backdrop-blur-sm border border-red-800/50 rounded-xl p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-500/20 rounded-full">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-red-400 mb-3">
              Something Went Wrong
            </h2>
            
            <p className="text-red-300 text-sm mb-6">
              An unexpected error occurred. This has been logged for debugging.
            </p>

            {/* Error Details (for development) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-3 bg-red-900/50 rounded-lg text-left">
                <h3 className="text-red-400 font-medium text-sm mb-2">Error Details:</h3>
                <div className="text-red-300 text-xs font-mono break-all">
                  {this.state.error.message}
                </div>
                {this.state.errorInfo && (
                  <div className="text-red-300 text-xs font-mono mt-2 max-h-32 overflow-y-auto">
                    {this.state.errorInfo.componentStack}
                  </div>
                )}
              </div>
            )}
            
            <div className="flex flex-col space-y-3">
              <button
                onClick={this.handleRetry}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try Again</span>
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Go Home</span>
              </button>
              
              <button
                onClick={this.handleRefresh}
                className="text-red-400 hover:text-red-300 text-sm transition-colors"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;