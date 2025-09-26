import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal,
  Bug,
  Zap,
  Database,
  Shield,
  Brain,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Monitor,
  Cpu,
  MemoryStick,
  Network,
  HardDrive
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { openaiClient } from '../lib/openaiClient';

interface DebugLog {
  timestamp: Date;
  level: 'info' | 'warn' | 'error' | 'success';
  category: 'auth' | 'database' | 'ai' | 'performance' | 'system' | 'network';
  message: string;
  details?: any;
}

interface SystemMetrics {
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  performance: {
    loadTime: number;
    renderTime: number;
    jsHeapSize: number;
  };
  network: {
    online: boolean;
    rtt: number;
    downlink: number;
  };
  database: {
    connectionTime: number;
    queryCount: number;
    errorRate: number;
  };
}

const ProductionDebugger = () => {
  const [isActive, setIsActive] = useState(false);
  const [logs, setLogs] = useState<DebugLog[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [filter, setFilter] = useState<'all' | 'error' | 'warn' | 'info' | 'success'>('all');
  const [autoScroll, setAutoScroll] = useState(true);
  
  const logsRef = useRef<HTMLDivElement>(null);
  const metricsIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    // Override console methods to capture logs
    if (isActive && isMonitoring) {
      const originalConsole = {
        log: console.log,
        warn: console.warn,
        error: console.error,
        info: console.info
      };

      console.log = (...args) => {
        originalConsole.log(...args);
        addLog('info', 'system', args.join(' '), args);
      };

      console.warn = (...args) => {
        originalConsole.warn(...args);
        addLog('warn', 'system', args.join(' '), args);
      };

      console.error = (...args) => {
        originalConsole.error(...args);
        addLog('error', 'system', args.join(' '), args);
      };

      console.info = (...args) => {
        originalConsole.info(...args);
        addLog('info', 'system', args.join(' '), args);
      };

      return () => {
        console.log = originalConsole.log;
        console.warn = originalConsole.warn;
        console.error = originalConsole.error;
        console.info = originalConsole.info;
      };
    }
  }, [isActive, isMonitoring]);

  useEffect(() => {
    if (isActive && isMonitoring) {
      startMetricsCollection();
      addLog('success', 'system', 'Production debugger activated');
    } else {
      stopMetricsCollection();
    }

    return () => stopMetricsCollection();
  }, [isActive, isMonitoring]);

  useEffect(() => {
    if (autoScroll && logsRef.current) {
      logsRef.current.scrollTop = logsRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  const addLog = (level: DebugLog['level'], category: DebugLog['category'], message: string, details?: any) => {
    const newLog: DebugLog = {
      timestamp: new Date(),
      level,
      category,
      message,
      details
    };
    
    setLogs(prev => {
      const updated = [...prev, newLog];
      // Keep only last 500 logs to prevent memory issues
      return updated.slice(-500);
    });
  };

  const startMetricsCollection = () => {
    collectMetrics();
    metricsIntervalRef.current = setInterval(collectMetrics, 2000);
  };

  const stopMetricsCollection = () => {
    if (metricsIntervalRef.current) {
      clearInterval(metricsIntervalRef.current);
      metricsIntervalRef.current = null;
    }
  };

  const collectMetrics = async () => {
    try {
      const performance = window.performance;
      const memory = (performance as any).memory;
      const connection = (navigator as any).connection;
      
      // Measure database performance
      const dbStart = performance.now();
      try {
        await supabase.from('profiles').select('id').limit(1);
        const dbTime = performance.now() - dbStart;
        
        const newMetrics: SystemMetrics = {
          memory: {
            used: memory ? memory.usedJSHeapSize : 0,
            total: memory ? memory.totalJSHeapSize : 0,
            percentage: memory ? (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100 : 0
          },
          performance: {
            loadTime: performance.timing ? performance.timing.loadEventEnd - performance.timing.navigationStart : 0,
            renderTime: performance.now(),
            jsHeapSize: memory ? memory.usedJSHeapSize : 0
          },
          network: {
            online: navigator.onLine,
            rtt: connection ? connection.rtt || 0 : 0,
            downlink: connection ? connection.downlink || 0 : 0
          },
          database: {
            connectionTime: dbTime,
            queryCount: (metrics?.database.queryCount || 0) + 1,
            errorRate: 0 // Will be calculated based on error logs
          }
        };
        
        setMetrics(newMetrics);
        
      } catch (dbError) {
        addLog('error', 'database', `Database metrics collection failed: ${dbError.message}`);
      }
      
    } catch (error) {
      addLog('error', 'performance', `Metrics collection failed: ${error.message}`);
    }
  };

  const runSystemDiagnostics = async () => {
    addLog('info', 'system', 'Starting comprehensive system diagnostics...');
    
    // Test authentication
    addLog('info', 'auth', 'Testing authentication system...');
    try {
      const { data: session, error } = await supabase.auth.getSession();
      if (error) {
        addLog('error', 'auth', `Authentication error: ${error.message}`, error);
      } else {
        addLog('success', 'auth', `Authentication working - Session: ${session.session ? 'Active' : 'None'}`);
      }
    } catch (authError) {
      addLog('error', 'auth', `Auth system failure: ${authError.message}`);
    }

    // Test database
    addLog('info', 'database', 'Testing database connectivity...');
    try {
      const startTime = performance.now();
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);
      
      const queryTime = performance.now() - startTime;
      
      if (error) {
        addLog('error', 'database', `Database query failed: ${error.message}`, error);
      } else {
        addLog('success', 'database', `Database query successful (${queryTime.toFixed(2)}ms)`, { queryTime, rowCount: data?.length || 0 });
      }
    } catch (dbError) {
      addLog('error', 'database', `Database connection failed: ${dbError.message}`);
    }

    // Test AI systems
    addLog('info', 'ai', 'Testing AI integration...');
    const aiAvailable = openaiClient.isAvailable();
    if (aiAvailable) {
      addLog('success', 'ai', 'OpenAI GPT-4 integration active');
    } else {
      addLog('warn', 'ai', 'OpenAI not configured - using fallback AI methods');
    }

    // Test performance
    addLog('info', 'performance', 'Analyzing performance metrics...');
    if (metrics) {
      const memoryUsageMB = (metrics.memory.used / 1024 / 1024).toFixed(2);
      const memoryPercentage = metrics.memory.percentage.toFixed(1);
      
      if (metrics.memory.percentage > 80) {
        addLog('warn', 'performance', `High memory usage: ${memoryUsageMB}MB (${memoryPercentage}%)`);
      } else {
        addLog('success', 'performance', `Memory usage normal: ${memoryUsageMB}MB (${memoryPercentage}%)`);
      }
      
      if (metrics.database.connectionTime > 1000) {
        addLog('warn', 'performance', `Slow database queries detected: ${metrics.database.connectionTime.toFixed(2)}ms`);
      } else {
        addLog('success', 'performance', `Database performance good: ${metrics.database.connectionTime.toFixed(2)}ms`);
      }
    }

    // Test network
    addLog('info', 'network', 'Testing network connectivity...');
    if (navigator.onLine) {
      addLog('success', 'network', 'Network connectivity active');
      
      // Test external API connectivity
      try {
        const response = await fetch('/favicon.ico', { method: 'HEAD' });
        if (response.ok) {
          addLog('success', 'network', 'External resource loading functional');
        } else {
          addLog('warn', 'network', 'External resource loading issues detected');
        }
      } catch (networkError) {
        addLog('error', 'network', `Network request failed: ${networkError.message}`);
      }
    } else {
      addLog('error', 'network', 'No network connectivity detected');
    }

    addLog('success', 'system', 'System diagnostics completed');
  };

  const clearLogs = () => {
    setLogs([]);
    addLog('info', 'system', 'Debug logs cleared');
  };

  const exportLogs = () => {
    const logData = logs.map(log => ({
      timestamp: log.timestamp.toISOString(),
      level: log.level,
      category: log.category,
      message: log.message,
      details: log.details
    }));
    
    const blob = new Blob([JSON.stringify(logData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `beat-addicts-debug-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    addLog('success', 'system', 'Debug logs exported');
  };

  const getLogIcon = (level: DebugLog['level']) => {
    switch (level) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'warn':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Activity className="w-4 h-4 text-blue-400" />;
    }
  };

  const getCategoryColor = (category: DebugLog['category']) => {
    switch (category) {
      case 'auth': return 'text-blue-300';
      case 'database': return 'text-purple-300';
      case 'ai': return 'text-cyan-300';
      case 'performance': return 'text-yellow-300';
      case 'network': return 'text-green-300';
      default: return 'text-gray-300';
    }
  };

  const filteredLogs = logs.filter(log => 
    filter === 'all' || log.level === filter
  );

  // Only show for admins or in development
  if (!isAdmin() && process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <>
      {/* Debug Toggle Button */}
      {!isActive && (
        <div className="fixed bottom-20 right-6 z-40">
          <button
            onClick={() => setIsActive(true)}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-raver text-sm transition-all border border-gray-600 shadow-lg"
            title="Production Debugger"
          >
            <Terminal className="w-4 h-4 inline mr-2" />
            DEBUG
          </button>
        </div>
      )}

      {/* Debug Panel */}
      {isActive && (
        <div className="fixed bottom-4 right-4 w-96 h-96 bg-black/95 border border-gray-700 rounded-lg shadow-2xl z-50 flex flex-col">
          {/* Header */}
          <div className="p-3 border-b border-gray-700 flex items-center justify-between bg-gray-900">
            <div className="flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-green-400" />
              <span className="font-mono text-green-400 text-sm">PRODUCTION DEBUG</span>
              {isMonitoring && (
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              )}
            </div>
            
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsMonitoring(!isMonitoring)}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  isMonitoring ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'
                }`}
                title={isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
              >
                {isMonitoring ? 'ON' : 'OFF'}
              </button>
              
              <button
                onClick={() => setIsActive(false)}
                className="p-1 hover:bg-gray-700 rounded"
              >
                <XCircle className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Metrics Bar */}
          {metrics && (
            <div className="p-2 border-b border-gray-700 bg-gray-800/50">
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div className="text-center">
                  <div className="text-purple-400 font-mono">{(metrics.memory.used / 1024 / 1024).toFixed(0)}MB</div>
                  <div className="text-gray-500">Memory</div>
                </div>
                <div className="text-center">
                  <div className="text-cyan-400 font-mono">{metrics.database.connectionTime.toFixed(0)}ms</div>
                  <div className="text-gray-500">DB</div>
                </div>
                <div className="text-center">
                  <div className="text-green-400 font-mono">{metrics.network.rtt}ms</div>
                  <div className="text-gray-500">RTT</div>
                </div>
                <div className="text-center">
                  <div className="text-yellow-400 font-mono">{logs.length}</div>
                  <div className="text-gray-500">Logs</div>
                </div>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="p-2 border-b border-gray-700 flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-white"
              >
                <option value="all">All</option>
                <option value="error">Errors</option>
                <option value="warn">Warnings</option>
                <option value="info">Info</option>
                <option value="success">Success</option>
              </select>
              
              <button
                onClick={() => setAutoScroll(!autoScroll)}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  autoScroll ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
                }`}
                title="Auto Scroll"
              >
                📄
              </button>
            </div>
            
            <div className="flex items-center space-x-1">
              <button
                onClick={runSystemDiagnostics}
                className="p-1 text-green-400 hover:bg-gray-700 rounded"
                title="Run Diagnostics"
              >
                <Bug className="w-3 h-3" />
              </button>
              
              <button
                onClick={clearLogs}
                className="p-1 text-yellow-400 hover:bg-gray-700 rounded"
                title="Clear Logs"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
              
              <button
                onClick={exportLogs}
                className="p-1 text-blue-400 hover:bg-gray-700 rounded"
                title="Export Logs"
              >
                <Download className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Logs */}
          <div 
            ref={logsRef}
            className="flex-1 p-2 overflow-y-auto font-mono text-xs space-y-1"
          >
            {filteredLogs.length === 0 ? (
              <div className="text-gray-500 text-center py-4">
                No logs to display
              </div>
            ) : (
              filteredLogs.map((log, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <span className="text-gray-500 text-xs">
                    {log.timestamp.toLocaleTimeString()}
                  </span>
                  {getLogIcon(log.level)}
                  <span className={`text-xs ${getCategoryColor(log.category)}`}>
                    [{log.category.toUpperCase()}]
                  </span>
                  <span className="text-gray-300 text-xs flex-1">
                    {log.message}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ProductionDebugger;