import { Platform } from 'react-native';

interface DebugLog {
  timestamp: Date;
  level: 'info' | 'warn' | 'error' | 'debug';
  component: string;
  message: string;
  data?: any;
  stackTrace?: string;
}

class DebugService {
  private logs: DebugLog[] = [];
  private maxLogs: number = 100;
  private isEnabled: boolean = __DEV__;
  private listeners: ((log: DebugLog) => void)[] = [];

  constructor() {
    this.setupGlobalErrorHandlers();
  }

  private setupGlobalErrorHandlers() {
    if (!this.isEnabled) return;

    // Capture console errors (but preserve original behavior)
    const originalConsoleError = console.error;
    console.error = (...args: any[]) => {
      // Only log if it's not already a debug service log
      if (args[0] && typeof args[0] === 'string' && !args[0].includes('[Console]')) {
        this.error('Console', 'Console Error', { args });
      }
      originalConsoleError.apply(console, args);
    };

    // Capture console warnings (but preserve original behavior)
    const originalConsoleWarn = console.warn;
    console.warn = (...args: any[]) => {
      // Only log if it's not already a debug service log
      if (args[0] && typeof args[0] === 'string' && !args[0].includes('[Console]')) {
        this.warn('Console', 'Console Warning', { args });
      }
      originalConsoleWarn.apply(console, args);
    };
  }

  private addLog(log: DebugLog) {
    this.logs.unshift(log);
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }
    
    // Notify listeners
    this.listeners.forEach(listener => {
      try {
        listener(log);
      } catch (error) {
        // Don't use console.log here to avoid infinite loop
      }
    });
  }

  info(component: string, message: string, data?: any) {
    if (!this.isEnabled) return;
    
    const log: DebugLog = {
      timestamp: new Date(),
      level: 'info',
      component,
      message,
      data,
    };
    
    this.addLog(log);
    console.log(`[${component}] ${message}`, data || '');
  }

  warn(component: string, message: string, data?: any) {
    if (!this.isEnabled) return;
    
    const log: DebugLog = {
      timestamp: new Date(),
      level: 'warn',
      component,
      message,
      data,
    };
    
    this.addLog(log);
    console.log(`⚠️ [${component}] ${message}`, data || '');
  }

  error(component: string, message: string, error?: any) {
    const log: DebugLog = {
      timestamp: new Date(),
      level: 'error',
      component,
      message,
      data: error,
      stackTrace: error?.stack || new Error().stack,
    };
    
    this.addLog(log);
    console.log(`❌ [${component}] ${message}`, error || '');
  }

  debug(component: string, message: string, data?: any) {
    if (!this.isEnabled) return;
    
    const log: DebugLog = {
      timestamp: new Date(),
      level: 'debug',
      component,
      message,
      data,
    };
    
    this.addLog(log);
    console.log(`🔍 [${component}] ${message}`, data || '');
  }

  getLogs(): DebugLog[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }

  addListener(callback: (log: DebugLog) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  getSystemInfo() {
    return {
      platform: Platform.OS,
      version: Platform.Version,
      isTV: Platform.isTV,
      constants: Platform.constants,
      logs: this.logs.length,
      errors: this.logs.filter(log => log.level === 'error').length,
    };
  }

  exportLogs(): string {
    const systemInfo = this.getSystemInfo();
    const logs = this.getLogs();
    
    return JSON.stringify({
      systemInfo,
      logs,
    }, null, 2);
  }
}

export default new DebugService(); 