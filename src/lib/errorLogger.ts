interface ErrorLog {
  timestamp: string;
  level: 'error' | 'warn' | 'info';
  component?: string;
  message: string;
  stack?: string;
  userAgent?: string;
  url?: string;
  userId?: string;
}

class ErrorLogger {
  private logs: ErrorLog[] = [];
  private maxLogs = 100;

  log(level: 'error' | 'warn' | 'info', message: string, component?: string, error?: Error) {
    const errorLog: ErrorLog = {
      timestamp: new Date().toISOString(),
      level,
      component,
      message,
      stack: error?.stack,
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    this.logs.unshift(errorLog);
    
    // Keep only the most recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    // Console output with enhanced formatting
    const logPrefix = `${level.toUpperCase()}${component ? ` [${component}]` : ''}:`;
    
    switch (level) {
      case 'error':
        console.error(`🚨 ${logPrefix}`, message, error || '');
        break;
      case 'warn':
        console.warn(`⚠️ ${logPrefix}`, message);
        break;
      case 'info':
        console.log(`ℹ️ ${logPrefix}`, message);
        break;
    }

    // Store in localStorage for debugging
    try {
      localStorage.setItem('beatAddicts_errorLogs', JSON.stringify(this.logs.slice(0, 50)));
    } catch (e) {
      console.warn('Failed to store error logs in localStorage');
    }
  }

  error(message: string, component?: string, error?: Error) {
    this.log('error', message, component, error);
  }

  warn(message: string, component?: string) {
    this.log('warn', message, component);
  }

  info(message: string, component?: string) {
    this.log('info', message, component);
  }

  getLogs(): ErrorLog[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
    try {
      localStorage.removeItem('beatAddicts_errorLogs');
    } catch (e) {
      console.warn('Failed to clear error logs from localStorage');
    }
    console.log('🧹 Error logs cleared');
  }

  getStoredLogs(): ErrorLog[] {
    try {
      const stored = localStorage.getItem('beatAddicts_errorLogs');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.warn('Failed to retrieve stored error logs');
      return [];
    }
  }

  exportLogs(): string {
    const allLogs = [...this.getStoredLogs(), ...this.logs];
    return JSON.stringify(allLogs, null, 2);
  }
}

export const errorLogger = new ErrorLogger();

// Global error capture
window.addEventListener('error', (event) => {
  errorLogger.error(
    `Global error: ${event.message}`,
    'GlobalErrorHandler',
    event.error
  );
});

window.addEventListener('unhandledrejection', (event) => {
  errorLogger.error(
    `Unhandled promise rejection: ${event.reason}`,
    'GlobalPromiseHandler'
  );
});

export default errorLogger;