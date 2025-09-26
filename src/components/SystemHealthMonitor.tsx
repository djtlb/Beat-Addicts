import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Wifi, 
  Database, 
  Zap,
  Bug,
  Download,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { errorLogger } from '../lib/errorLogger';

interface SystemStatus {
  online: boolean;
  supabase: boolean;
  audio: boolean;
  storage: boolean;
  performance: 'good' | 'fair' | 'poor';
  errors: number;
  warnings: number;
}

const SystemHealthMonitor: React.FC = () => {
  const [status, setStatus] = useState<SystemStatus>({
    online: navigator.onLine,
    supabase: false,
    audio: false,
    storage: false,
    performance: 'good',
    errors: 0,
    warnings: 0
  });
  const [showDetails, setShowDetails] = useState(false);
  const [logs, setLogs] = useState(errorLogger.getLogs());

  console.log('🔍 SystemHealthMonitor: Monitoring system health');

  useEffect(() => {
    const checkSystemHealth = async () => {
      console.log('🔍 Running system health check...');
      
      const newStatus: SystemStatus = {
        online: navigator.onLine,
        supabase: false,
        audio: false,
        storage: false,
        performance: 'good',
        errors: 0,
        warnings: 0
      };

      // Check Supabase connection
      try {
        const { supabase } = await import('../lib/supabase');
        const { data, error } = await supabase.from('profiles').select('count').limit(1);
        newStatus.supabase = !error;
        if (error) {
          errorLogger.error('Supabase connection failed', 'SystemHealthMonitor', error);
        } else {
          console.log('✅ Supabase connection healthy');
        }
      } catch (error) {
        errorLogger.error('Supabase check failed', 'SystemHealthMonitor', error as Error);
        newStatus.supabase = false;
      }

      // Check Audio API
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        newStatus.audio = audioContext.state !== 'suspended';
        console.log('✅ Audio API healthy:', audioContext.state);
        audioContext.close();
      } catch (error) {
        errorLogger.error('Audio API check failed', 'SystemHealthMonitor', error as Error);
        newStatus.audio = false;
      }

      // Check Storage
      try {
        localStorage.setItem('healthCheck', 'test');
        localStorage.removeItem('healthCheck');
        newStatus.storage = true;
        console.log('✅ Storage healthy');
      } catch (error) {
        errorLogger.error('Storage check failed', 'SystemHealthMonitor', error as Error);
        newStatus.storage = false;
      }

      // Performance check (memory usage)
      if ('memory' in performance) {
        const memoryInfo = (performance as any).memory;
        const memoryUsage = memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit;
        
        if (memoryUsage > 0.8) {
          newStatus.performance = 'poor';
          errorLogger.warn(`High memory usage: ${Math.round(memoryUsage * 100)}%`, 'SystemHealthMonitor');
        } else if (memoryUsage > 0.6) {
          newStatus.performance = 'fair';
        } else {
          newStatus.performance = 'good';
        }
        
        console.log('📊 Memory usage:', Math.round(memoryUsage * 100) + '%');
      }

      // Count errors and warnings
      const allLogs = errorLogger.getLogs();
      newStatus.errors = allLogs.filter(log => log.level === 'error').length;
      newStatus.warnings = allLogs.filter(log => log.level === 'warn').length;

      setStatus(newStatus);
      setLogs(allLogs);
    };

    // Initial check
    checkSystemHealth();

    // Periodic checks
    const interval = setInterval(checkSystemHealth, 30000); // Every 30 seconds

    // Network status listeners
    const handleOnline = () => {
      console.log('🌐 Network: Online');
      setStatus(prev => ({ ...prev, online: true }));
    };

    const handleOffline = () => {
      console.log('🌐 Network: Offline');
      errorLogger.warn('Network connection lost', 'SystemHealthMonitor');
      setStatus(prev => ({ ...prev, online: false }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getStatusIcon = (isHealthy: boolean) => {
    return isHealthy ? (
      <CheckCircle className="w-4 h-4 text-green-400" />
    ) : (
      <XCircle className="w-4 h-4 text-red-400" />
    );
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'good': return 'text-green-400';
      case 'fair': return 'text-yellow-400';
      case 'poor': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const handleDownloadLogs = () => {
    const logsData = errorLogger.exportLogs();
    const blob = new Blob([logsData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `beat-addicts-logs-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('📥 Error logs downloaded');
  };

  const handleClearLogs = () => {
    errorLogger.clearLogs();
    setLogs([]);
    console.log('🧹 Error logs cleared');
  };

  const overallHealth = status.online && status.supabase && status.audio && status.storage;

  return (
    <div className="bg-gray-900/50 rounded-lg border border-gray-700/50 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-blue-400" />
          <h3 className="font-medium text-white">System Health</h3>
          {overallHealth ? (
            <CheckCircle className="w-4 h-4 text-green-400" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
          )}
        </div>
        
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </div>

      {/* Status Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center justify-between p-2 bg-gray-800/50 rounded">
          <div className="flex items-center space-x-2">
            <Wifi className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-300">Network</span>
          </div>
          {getStatusIcon(status.online)}
        </div>

        <div className="flex items-center justify-between p-2 bg-gray-800/50 rounded">
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-300">Database</span>
          </div>
          {getStatusIcon(status.supabase)}
        </div>

        <div className="flex items-center justify-between p-2 bg-gray-800/50 rounded">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-300">Audio</span>
          </div>
          {getStatusIcon(status.audio)}
        </div>

        <div className="flex items-center justify-between p-2 bg-gray-800/50 rounded">
          <div className="flex items-center space-x-2">
            <RefreshCw className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-300">Performance</span>
          </div>
          <span className={`text-sm font-medium ${getPerformanceColor(status.performance)}`}>
            {status.performance.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Error Summary */}
      <div className="flex items-center justify-between p-2 bg-gray-800/50 rounded mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <XCircle className="w-4 h-4 text-red-400" />
            <span className="text-sm text-gray-300">Errors:</span>
            <span className="text-sm font-medium text-red-400">{status.errors}</span>
          </div>
          <div className="flex items-center space-x-1">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-gray-300">Warnings:</span>
            <span className="text-sm font-medium text-yellow-400">{status.warnings}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleDownloadLogs}
            className="p-1 hover:bg-gray-700 rounded transition-colors"
            title="Download Logs"
          >
            <Download className="w-4 h-4 text-gray-400" />
          </button>
          <button
            onClick={handleClearLogs}
            className="p-1 hover:bg-gray-700 rounded transition-colors"
            title="Clear Logs"
          >
            <Trash2 className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Detailed View */}
      {showDetails && (
        <div className="space-y-3">
          <h4 className="font-medium text-white text-sm flex items-center space-x-2">
            <Bug className="w-4 h-4" />
            <span>Recent Issues</span>
          </h4>
          
          <div className="max-h-40 overflow-y-auto space-y-2">
            {logs.length === 0 ? (
              <div className="text-sm text-gray-500 text-center py-2">
                No issues detected
              </div>
            ) : (
              logs.slice(0, 10).map((log, index) => (
                <div
                  key={index}
                  className={`p-2 rounded text-xs ${
                    log.level === 'error' 
                      ? 'bg-red-900/20 border border-red-800/30'
                      : log.level === 'warn'
                      ? 'bg-yellow-900/20 border border-yellow-800/30'
                      : 'bg-blue-900/20 border border-blue-800/30'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`font-medium ${
                      log.level === 'error' ? 'text-red-400' :
                      log.level === 'warn' ? 'text-yellow-400' : 'text-blue-400'
                    }`}>
                      {log.level.toUpperCase()}
                    </span>
                    {log.component && (
                      <span className="text-gray-400">[{log.component}]</span>
                    )}
                    <span className="text-gray-500 text-xs">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-gray-300">{log.message}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemHealthMonitor;