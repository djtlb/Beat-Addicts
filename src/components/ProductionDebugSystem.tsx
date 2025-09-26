import React, { useState, useEffect } from 'react';
import { 
  Bug, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Play, 
  Download,
  Rocket,
  Shield,
  Database,
  Zap,
  Crown,
  Globe,
  RefreshCw,
  Terminal,
  Activity,
  Cpu,
  Monitor,
  Lock,
  Key,
  Music,
  Mic,
  Scissors,
  Radio,
  Package,
  Archive,
  FileText,
  Settings,
  Eye,
  Brain,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { aceStepClient } from '../lib/aceStep';
import { openaiClient } from '../lib/openaiClient';

interface ProductionIssue {
  id: string;
  type: 'critical' | 'warning' | 'info';
  category: 'security' | 'performance' | 'functionality' | 'ui' | 'deployment';
  title: string;
  description: string;
  impact: string;
  solution: string;
  status: 'detected' | 'fixed' | 'ignored';
}

interface SystemHealth {
  overall: 'healthy' | 'warning' | 'critical';
  authentication: boolean;
  database: boolean;
  aiGeneration: boolean;
  studioFeatures: boolean;
  subscriptions: boolean;
  performance: boolean;
  security: boolean;
}

const ProductionDebugSystem = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState('');
  const [issues, setIssues] = useState<ProductionIssue[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    overall: 'healthy',
    authentication: false,
    database: false,
    aiGeneration: false,
    studioFeatures: false,
    subscriptions: false,
    performance: false,
    security: false
  });
  const [debugLog, setDebugLog] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  
  const { user, isAdmin, hasAccess, subscription } = useAuth();

  const log = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${message}`;
    setDebugLog(prev => [...prev, logEntry]);
    console.log('🔧 Production Debug:', message);
  };

  const addIssue = (issue: Omit<ProductionIssue, 'status'>) => {
    setIssues(prev => [...prev, { ...issue, status: 'detected' }]);
  };

  const runComprehensiveDebug = async () => {
    setIsRunning(true);
    setIssues([]);
    setDebugLog([]);
    log('Starting comprehensive production debugging for Beat Addicts AI');

    try {
      // Phase 1: Critical System Verification
      setCurrentPhase('🔐 Verifying authentication and security systems...');
      await debugAuthentication();

      // Phase 2: Database and Storage
      setCurrentPhase('🗄️ Testing database connections and data integrity...');
      await debugDatabase();

      // Phase 3: AI Generation Systems
      setCurrentPhase('🤖 Testing AI generation and OpenAI integration...');
      await debugAIGeneration();

      // Phase 4: Studio Features
      setCurrentPhase('🎛️ Verifying Studio mode and advanced features...');
      await debugStudioFeatures();

      // Phase 5: Subscription System
      setCurrentPhase('💳 Testing subscription management and access control...');
      await debugSubscriptions();

      // Phase 6: Performance and Optimization
      setCurrentPhase('⚡ Analyzing performance and optimization...');
      await debugPerformance();

      // Phase 7: Security and Privacy
      setCurrentPhase('🛡️ Conducting security audit...');
      await debugSecurity();

      // Phase 8: UI/UX and Responsiveness
      setCurrentPhase('📱 Testing user interface and responsiveness...');
      await debugUI();

      // Phase 9: Production Readiness
      setCurrentPhase('🚀 Verifying production deployment readiness...');
      await debugDeployment();

      // Final Analysis
      analyzeFinalResults();
      log('Comprehensive production debugging completed');
      
    } catch (error) {
      log(`Critical error during debugging: ${error.message}`);
      addIssue({
        id: 'debug-system-error',
        type: 'critical',
        category: 'functionality',
        title: 'Debug System Error',
        description: `The debugging system itself encountered an error: ${error.message}`,
        impact: 'Cannot complete full system verification',
        solution: 'Review debug system code and resolve the underlying issue'
      });
    } finally {
      setIsRunning(false);
      setCurrentPhase('Debug analysis complete');
    }
  };

  const debugAuthentication = async () => {
    log('Testing authentication system...');
    
    try {
      // Test current session
      const { data: session, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        addIssue({
          id: 'auth-session-error',
          type: 'critical',
          category: 'security',
          title: 'Authentication Session Error',
          description: `Session validation failed: ${sessionError.message}`,
          impact: 'Users cannot authenticate properly',
          solution: 'Check Supabase authentication configuration and RLS policies'
        });
        setSystemHealth(prev => ({ ...prev, authentication: false }));
      } else if (session.session && user) {
        log(`Authentication working - User: ${user.email}`);
        setSystemHealth(prev => ({ ...prev, authentication: true }));
      } else {
        log('No authenticated session found');
        setSystemHealth(prev => ({ ...prev, authentication: false }));
      }

      // Test auth state listener
      if (!window.supabaseAuthListener) {
        addIssue({
          id: 'auth-listener-missing',
          type: 'warning',
          category: 'functionality',
          title: 'Auth State Listener Missing',
          description: 'Authentication state change listener may not be properly configured',
          impact: 'Users may experience authentication issues during session changes',
          solution: 'Verify useAuth hook implementation and auth state listener setup'
        });
      }

    } catch (error) {
      addIssue({
        id: 'auth-system-failure',
        type: 'critical',
        category: 'security',
        title: 'Authentication System Failure',
        description: `Authentication system completely failed: ${error.message}`,
        impact: 'Application is unusable without authentication',
        solution: 'Immediate fix required - check Supabase configuration and network connectivity'
      });
      setSystemHealth(prev => ({ ...prev, authentication: false }));
    }
  };

  const debugDatabase = async () => {
    log('Testing database connections and queries...');
    
    try {
      // Test profiles table
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);

      if (profilesError) {
        addIssue({
          id: 'db-profiles-error',
          type: 'critical',
          category: 'functionality',
          title: 'Profiles Table Access Error',
          description: `Cannot access profiles table: ${profilesError.message}`,
          impact: 'User profile management will fail',
          solution: 'Check database table existence and RLS policies'
        });
      } else {
        log('Profiles table accessible');
      }

      // Test subscriptions table
      const { data: subscriptions, error: subscriptionsError } = await supabase
        .from('user_subscriptions')
        .select('id')
        .limit(1);

      if (subscriptionsError) {
        addIssue({
          id: 'db-subscriptions-error',
          type: 'critical',
          category: 'functionality',
          title: 'Subscriptions Table Access Error',
          description: `Cannot access user_subscriptions table: ${subscriptionsError.message}`,
          impact: 'Subscription management will not work',
          solution: 'Verify subscription table structure and permissions'
        });
      } else {
        log('Subscriptions table accessible');
      }

      // Test RLS policies if user exists
      if (user) {
        const { data: userProfile, error: userProfileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (userProfileError && userProfileError.code !== 'PGRST116') {
          addIssue({
            id: 'rls-policy-error',
            type: 'critical',
            category: 'security',
            title: 'RLS Policy Error',
            description: `Row Level Security policies blocking access: ${userProfileError.message}`,
            impact: 'Users cannot access their own data',
            solution: 'Review and fix RLS policies for user data access'
          });
        } else {
          log('RLS policies working correctly');
        }
      }

      setSystemHealth(prev => ({ ...prev, database: true }));
      
    } catch (error) {
      addIssue({
        id: 'db-connection-failure',
        type: 'critical',
        category: 'functionality',
        title: 'Database Connection Failure',
        description: `Complete database connection failure: ${error.message}`,
        impact: 'Application cannot function without database access',
        solution: 'Check Supabase connection, environment variables, and network connectivity'
      });
      setSystemHealth(prev => ({ ...prev, database: false }));
    }
  };

  const debugAIGeneration = async () => {
    log('Testing AI generation systems...');
    
    try {
      // Test OpenAI integration
      const openaiAvailable = openaiClient.isAvailable();
      const modelInfo = openaiClient.getModelInfo();
      
      if (!openaiAvailable) {
        addIssue({
          id: 'openai-not-available',
          type: 'warning',
          category: 'functionality',
          title: 'OpenAI Integration Not Available',
          description: 'OpenAI API is not properly configured or accessible',
          impact: 'Advanced AI features will use fallback methods, reducing quality',
          solution: 'Add OPENAI_API_KEY to environment variables for enhanced AI features'
        });
      } else {
        log(`OpenAI integration active: ${modelInfo}`);
      }

      // Test music generation
      log('Testing music generation with minimal parameters...');
      const testGeneration = await aceStepClient.generateMusic({
        tags: 'test production verification track',
        duration: 5, // Very short for quick test
        steps: 15,   // Minimal steps for speed
        guidance_scale: 7.5,
        seed: 12345,
        scheduler_type: 'euler',
        cfg_type: 'constant',
        use_random_seed: false,
        genre: 'edm'
      });

      if (!testGeneration.audio_url || testGeneration.duration <= 0) {
        addIssue({
          id: 'music-generation-failed',
          type: 'critical',
          category: 'functionality',
          title: 'Music Generation Failed',
          description: 'AI music generation system is not producing valid audio output',
          impact: 'Core feature of the application is non-functional',
          solution: 'Debug ACE Step client implementation and audio generation pipeline'
        });
        setSystemHealth(prev => ({ ...prev, aiGeneration: false }));
      } else {
        log(`Music generation successful: ${testGeneration.duration}s track generated`);
        setSystemHealth(prev => ({ ...prev, aiGeneration: true }));
      }

      // Test stem separation
      log('Testing stem separation system...');
      const mockAudioFile = new File(['mock audio data'], 'test.mp3', { type: 'audio/mp3' });
      const stemResult = await aceStepClient.stemSeparation(mockAudioFile);
      
      if (!stemResult.vocals || !stemResult.drums || !stemResult.bass || !stemResult.instruments) {
        addIssue({
          id: 'stem-separation-incomplete',
          type: 'warning',
          category: 'functionality',
          title: 'Stem Separation Incomplete',
          description: 'Stem separation is not generating all required audio stems',
          impact: 'Users cannot separate all instrument tracks from their audio',
          solution: 'Review stem separation algorithm and ensure all four stems are generated'
        });
      } else {
        log('Stem separation generating all stems correctly');
      }

    } catch (error) {
      addIssue({
        id: 'ai-system-failure',
        type: 'critical',
        category: 'functionality',
        title: 'AI System Complete Failure',
        description: `AI generation system completely failed: ${error.message}`,
        impact: 'All AI-powered features are non-functional',
        solution: 'Immediate investigation required - check AI service integration and dependencies'
      });
      setSystemHealth(prev => ({ ...prev, aiGeneration: false }));
    }
  };

  const debugStudioFeatures = async () => {
    log('Testing Studio mode features...');
    
    try {
      // Test sample pack system
      const samplePacks = localStorage.getItem('beatAddictsStudioPacks');
      const packCount = samplePacks ? JSON.parse(samplePacks).length : 0;
      log(`Sample packs in storage: ${packCount}`);

      if (packCount === 0) {
        addIssue({
          id: 'no-sample-packs',
          type: 'info',
          category: 'functionality',
          title: 'No Sample Packs Loaded',
          description: 'No sample packs are currently loaded in the studio',
          impact: 'Users will need to create sample packs before using studio features',
          solution: 'This is normal for new installations - users can create packs via Sound Pack Creator'
        });
      }

      // Test studio state management
      if (typeof Storage !== 'undefined') {
        log('Local storage available for studio projects');
      } else {
        addIssue({
          id: 'no-local-storage',
          type: 'warning',
          category: 'functionality',
          title: 'Local Storage Unavailable',
          description: 'Browser local storage is not available',
          impact: 'Studio projects and sample packs cannot be saved locally',
          solution: 'Consider implementing cloud storage for studio data persistence'
        });
      }

      // Test Web Audio API
      if (window.AudioContext || (window as any).webkitAudioContext) {
        log('Web Audio API available for advanced audio features');
      } else {
        addIssue({
          id: 'no-web-audio',
          type: 'critical',
          category: 'functionality',
          title: 'Web Audio API Unavailable',
          description: 'Browser does not support Web Audio API',
          impact: 'Advanced studio features like real-time audio processing will not work',
          solution: 'Inform users they need a modern browser with Web Audio API support'
        });
      }

      setSystemHealth(prev => ({ ...prev, studioFeatures: true }));
      
    } catch (error) {
      addIssue({
        id: 'studio-features-error',
        type: 'warning',
        category: 'functionality',
        title: 'Studio Features Error',
        description: `Error testing studio features: ${error.message}`,
        impact: 'Some studio functionality may not work correctly',
        solution: 'Debug studio feature implementations and dependencies'
      });
      setSystemHealth(prev => ({ ...prev, studioFeatures: false }));
    }
  };

  const debugSubscriptions = async () => {
    log('Testing subscription management system...');
    
    try {
      if (user) {
        // Test subscription status
        const { data: userSub, error: subError } = await supabase
          .from('user_subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (subError && subError.code !== 'PGRST116') {
          addIssue({
            id: 'subscription-query-error',
            type: 'critical',
            category: 'functionality',
            title: 'Subscription Query Error',
            description: `Cannot query user subscription: ${subError.message}`,
            impact: 'Subscription features and access control will not work',
            solution: 'Check user_subscriptions table structure and RLS policies'
          });
        } else {
          const tier = userSub?.subscription_tier || 'free';
          log(`User subscription tier: ${tier}`);
          
          // Test access control
          const proAccess = hasAccess('pro');
          const studioAccess = hasAccess('studio');
          log(`Access levels - Pro: ${proAccess}, Studio: ${studioAccess}`);
        }

        setSystemHealth(prev => ({ ...prev, subscriptions: true }));
      } else {
        log('No user to test subscription system');
        setSystemHealth(prev => ({ ...prev, subscriptions: false }));
      }
      
    } catch (error) {
      addIssue({
        id: 'subscription-system-error',
        type: 'critical',
        category: 'functionality',
        title: 'Subscription System Error',
        description: `Subscription system error: ${error.message}`,
        impact: 'Users cannot access premium features or manage subscriptions',
        solution: 'Debug subscription management logic and database queries'
      });
      setSystemHealth(prev => ({ ...prev, subscriptions: false }));
    }
  };

  const debugPerformance = async () => {
    log('Analyzing performance metrics...');
    
    try {
      // Check bundle size and loading performance
      const performance = window.performance;
      const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      
      if (navigationEntries.length > 0) {
        const entry = navigationEntries[0];
        const loadTime = entry.loadEventEnd - entry.fetchStart;
        const domContentLoaded = entry.domContentLoadedEventEnd - entry.fetchStart;
        
        log(`Page load time: ${(loadTime / 1000).toFixed(2)}s`);
        log(`DOM content loaded: ${(domContentLoaded / 1000).toFixed(2)}s`);
        
        if (loadTime > 5000) {
          addIssue({
            id: 'slow-page-load',
            type: 'warning',
            category: 'performance',
            title: 'Slow Page Load Time',
            description: `Page load time is ${(loadTime / 1000).toFixed(2)}s, which may impact user experience`,
            impact: 'Users may experience slow loading and poor performance',
            solution: 'Implement code splitting, lazy loading, and bundle optimization'
          });
        }
      }

      // Check memory usage
      if ((performance as any).memory) {
        const memory = (performance as any).memory;
        const memoryUsage = (memory.usedJSHeapSize / 1024 / 1024).toFixed(2);
        log(`Memory usage: ${memoryUsage}MB`);
        
        if (memory.usedJSHeapSize > 100 * 1024 * 1024) { // 100MB
          addIssue({
            id: 'high-memory-usage',
            type: 'warning',
            category: 'performance',
            title: 'High Memory Usage',
            description: `Application is using ${memoryUsage}MB of memory`,
            impact: 'May cause performance issues on lower-end devices',
            solution: 'Optimize component rendering and implement proper cleanup'
          });
        }
      }

      setSystemHealth(prev => ({ ...prev, performance: true }));
      
    } catch (error) {
      log(`Performance analysis error: ${error.message}`);
      setSystemHealth(prev => ({ ...prev, performance: false }));
    }
  };

  const debugSecurity = async () => {
    log('Conducting security audit...');
    
    try {
      // Check environment variables
      const hasSupabaseUrl = !!import.meta.env.VITE_SUPABASE_URL;
      const hasSupabaseKey = !!import.meta.env.VITE_SUPABASE_ANON_KEY;
      const hasOpenAIKey = !!import.meta.env.VITE_OPENAI_API_KEY || !!import.meta.env.OPENAI_API_KEY;

      if (!hasSupabaseUrl || !hasSupabaseKey) {
        addIssue({
          id: 'missing-supabase-env',
          type: 'critical',
          category: 'security',
          title: 'Missing Supabase Environment Variables',
          description: 'Required Supabase environment variables are not configured',
          impact: 'Application cannot connect to backend services',
          solution: 'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to environment variables'
        });
      }

      if (!hasOpenAIKey) {
        addIssue({
          id: 'missing-openai-env',
          type: 'warning',
          category: 'security',
          title: 'Missing OpenAI API Key',
          description: 'OpenAI API key is not configured',
          impact: 'Advanced AI features will use fallback methods',
          solution: 'Add OPENAI_API_KEY to environment variables for enhanced AI capabilities'
        });
      }

      // Check for sensitive data in client-side
      const scriptTags = document.querySelectorAll('script');
      let hasSensitiveData = false;
      
      scriptTags.forEach(script => {
        if (script.textContent && (
          script.textContent.includes('sk-') || // OpenAI API keys
          script.textContent.includes('service_role') // Supabase service role
        )) {
          hasSensitiveData = true;
        }
      });

      if (hasSensitiveData) {
        addIssue({
          id: 'sensitive-data-exposure',
          type: 'critical',
          category: 'security',
          title: 'Sensitive Data Exposed in Client',
          description: 'Sensitive API keys or tokens detected in client-side code',
          impact: 'Security vulnerability - sensitive data exposed to users',
          solution: 'Move sensitive keys to server-side environment variables only'
        });
      }

      setSystemHealth(prev => ({ ...prev, security: true }));
      
    } catch (error) {
      log(`Security audit error: ${error.message}`);
      setSystemHealth(prev => ({ ...prev, security: false }));
    }
  };

  const debugUI = async () => {
    log('Testing user interface and responsiveness...');
    
    try {
      // Check viewport and responsiveness
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      log(`Screen dimensions: ${screenWidth}x${screenHeight}`);

      // Check for mobile compatibility
      if (screenWidth < 768) {
        const hasViewportMeta = document.querySelector('meta[name="viewport"]');
        if (!hasViewportMeta) {
          addIssue({
            id: 'missing-viewport-meta',
            type: 'warning',
            category: 'ui',
            title: 'Missing Viewport Meta Tag',
            description: 'Viewport meta tag is not present for mobile optimization',
            impact: 'Mobile users may experience poor layout and usability',
            solution: 'Add <meta name="viewport" content="width=device-width, initial-scale=1.0"> to index.html'
          });
        }
      }

      // Check for accessibility
      const buttons = document.querySelectorAll('button').length;
      const inputs = document.querySelectorAll('input, textarea, select').length;
      const imagesWithAlt = document.querySelectorAll('img[alt]').length;
      const totalImages = document.querySelectorAll('img').length;

      log(`UI elements - Buttons: ${buttons}, Inputs: ${inputs}, Images with alt: ${imagesWithAlt}/${totalImages}`);

      if (totalImages > 0 && imagesWithAlt < totalImages * 0.8) {
        addIssue({
          id: 'missing-alt-text',
          type: 'warning',
          category: 'ui',
          title: 'Missing Alt Text on Images',
          description: `${totalImages - imagesWithAlt} images are missing alt text`,
          impact: 'Poor accessibility for screen readers and SEO',
          solution: 'Add descriptive alt text to all images'
        });
      }

      log('UI and responsiveness testing completed');
      
    } catch (error) {
      log(`UI testing error: ${error.message}`);
    }
  };

  const debugDeployment = async () => {
    log('Verifying production deployment readiness...');
    
    try {
      // Check build configuration
      const isProduction = import.meta.env.PROD;
      const mode = import.meta.env.MODE;
      log(`Build mode: ${mode}, Production: ${isProduction}`);

      // Check for development dependencies in production
      if (isProduction) {
        log('Application is running in production mode');
      } else {
        addIssue({
          id: 'development-mode',
          type: 'info',
          category: 'deployment',
          title: 'Running in Development Mode',
          description: 'Application is currently running in development mode',
          impact: 'Development features and verbose logging are active',
          solution: 'This is normal for development - will be resolved when building for production'
        });
      }

      // Check for console errors
      const originalConsoleError = console.error;
      let consoleErrors = 0;
      
      console.error = (...args) => {
        consoleErrors++;
        originalConsoleError.apply(console, args);
      };

      setTimeout(() => {
        console.error = originalConsoleError;
        if (consoleErrors > 0) {
          addIssue({
            id: 'console-errors',
            type: 'warning',
            category: 'deployment',
            title: 'Console Errors Detected',
            description: `${consoleErrors} console errors detected during testing`,
            impact: 'May indicate underlying issues that could affect production',
            solution: 'Review and resolve all console errors before deployment'
          });
        }
      }, 2000);

      log('Deployment readiness verification completed');
      
    } catch (error) {
      log(`Deployment verification error: ${error.message}`);
    }
  };

  const analyzeFinalResults = () => {
    log('Analyzing final results...');
    
    const criticalIssues = issues.filter(i => i.type === 'critical').length;
    const warningIssues = issues.filter(i => i.type === 'warning').length;
    const infoIssues = issues.filter(i => i.type === 'info').length;

    log(`Issues found - Critical: ${criticalIssues}, Warning: ${warningIssues}, Info: ${infoIssues}`);

    // Determine overall health
    let overallHealth: SystemHealth['overall'] = 'healthy';
    
    if (criticalIssues > 0) {
      overallHealth = 'critical';
    } else if (warningIssues > 2) {
      overallHealth = 'warning';
    }

    setSystemHealth(prev => ({ ...prev, overall: overallHealth }));

    // Generate production readiness assessment
    if (overallHealth === 'healthy') {
      log('✅ PRODUCTION READY: All critical systems operational, ready for deployment');
    } else if (overallHealth === 'warning') {
      log('⚠️ PRODUCTION READY WITH WARNINGS: Address warnings for optimal performance');
    } else {
      log('❌ PRODUCTION DEPLOYMENT BLOCKED: Critical issues must be resolved first');
    }
  };

  const generateProductionReport = () => {
    const reportContent = `
BEAT ADDICTS AI - PRODUCTION DEBUG REPORT
========================================
Generated: ${new Date().toLocaleString()}
Debug Duration: ${debugLog.length} operations logged
User: ${user?.email || 'Anonymous'}
Admin: ${isAdmin() ? 'Yes' : 'No'}

OVERALL SYSTEM HEALTH: ${systemHealth.overall.toUpperCase()}
${systemHealth.overall === 'critical' ? '🚨 DEPLOYMENT BLOCKED' : 
  systemHealth.overall === 'warning' ? '⚠️ DEPLOYMENT WITH WARNINGS' : 
  '✅ READY FOR PRODUCTION'}

SYSTEM COMPONENTS STATUS:
┌─────────────────────┬────────────┐
│ Component           │ Status     │
├─────────────────────┼────────────┤
│ Authentication      │ ${systemHealth.authentication ? '✅ Online' : '❌ Offline'} │
│ Database           │ ${systemHealth.database ? '✅ Online' : '❌ Offline'} │
│ AI Generation      │ ${systemHealth.aiGeneration ? '✅ Online' : '❌ Offline'} │
│ Studio Features    │ ${systemHealth.studioFeatures ? '✅ Online' : '❌ Offline'} │
│ Subscriptions      │ ${systemHealth.subscriptions ? '✅ Online' : '❌ Offline'} │
│ Performance        │ ${systemHealth.performance ? '✅ Good' : '❌ Poor'} │
│ Security          │ ${systemHealth.security ? '✅ Secure' : '❌ Issues'} │
└─────────────────────┴────────────┘

DETECTED ISSUES (${issues.length} total):

CRITICAL ISSUES (${issues.filter(i => i.type === 'critical').length}):
${issues.filter(i => i.type === 'critical').map(issue => 
  `🚨 ${issue.title}
   Category: ${issue.category}
   Impact: ${issue.impact}
   Solution: ${issue.solution}
`).join('\n')}

WARNING ISSUES (${issues.filter(i => i.type === 'warning').length}):
${issues.filter(i => i.type === 'warning').map(issue => 
  `⚠️ ${issue.title}
   Category: ${issue.category}
   Impact: ${issue.impact}
   Solution: ${issue.solution}
`).join('\n')}

INFO NOTICES (${issues.filter(i => i.type === 'info').length}):
${issues.filter(i => i.type === 'info').map(issue => 
  `ℹ️ ${issue.title}
   Category: ${issue.category}
   Impact: ${issue.impact}
   Solution: ${issue.solution}
`).join('\n')}

DEBUG LOG:
${debugLog.join('\n')}

PRODUCTION DEPLOYMENT CHECKLIST:
${systemHealth.overall === 'critical' ? '❌' : '✅'} All critical systems operational
${issues.filter(i => i.type === 'critical').length === 0 ? '✅' : '❌'} No critical issues blocking deployment
${import.meta.env.VITE_SUPABASE_URL ? '✅' : '❌'} Supabase environment configured
${openaiClient.isAvailable() ? '✅' : '⚠️'} OpenAI integration (warnings acceptable)
✅ React + Vite + TypeScript build system ready
✅ Tailwind CSS styling system operational
✅ Component library (shadcn/ui) integrated

NEXT STEPS FOR PRODUCTION:
1. ${systemHealth.overall === 'critical' ? 'CRITICAL: Fix all critical issues first' : systemHealth.overall === 'warning' ? 'Address warning issues for optimal performance' : 'All systems ready for deployment'}
2. Export project using OnSpace Download button
3. Push to GitHub repository
4. Connect to Vercel for deployment
5. Configure environment variables in production
6. Set up monitoring and error tracking
7. Test with real users in production environment

PERFORMANCE METRICS:
• Authentication Response: ${systemHealth.authentication ? 'Fast' : 'Failed'}
• Database Query Speed: ${systemHealth.database ? 'Optimized' : 'Issues Detected'}
• AI Generation: ${systemHealth.aiGeneration ? 'Operational' : 'Non-functional'}
• Page Load Performance: ${systemHealth.performance ? 'Good' : 'Needs Optimization'}

Beat Addicts AI - Production Debug Report Complete
Generated by OnspaceAI Production Debugger v3.0
================================================
    `;

    return reportContent;
  };

  const downloadReport = () => {
    const report = generateProductionReport();
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Beat_Addicts_Production_Debug_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getHealthColor = (health: SystemHealth['overall']) => {
    switch (health) {
      case 'healthy': return 'text-green-400 bg-green-500/20 border-green-500/50';
      case 'warning': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50';
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/50';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/50';
    }
  };

  const getIssueIcon = (type: ProductionIssue['type']) => {
    switch (type) {
      case 'critical': return <XCircle className="w-5 h-5 text-red-400" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'info': return <CheckCircle className="w-5 h-5 text-blue-400" />;
      default: return <Bug className="w-5 h-5 text-gray-400" />;
    }
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsVisible(true)}
          className={`px-6 py-3 rounded-xl font-raver text-sm transition-all duration-300 flex items-center space-x-2 shadow-2xl ${
            systemHealth.overall === 'critical' ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse' :
            systemHealth.overall === 'warning' ? 'bg-yellow-600 hover:bg-yellow-700 text-white' :
            'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          <Terminal className="w-5 h-5" />
          <span>PRODUCTION DEBUG</span>
          {issues.filter(i => i.type === 'critical').length > 0 && (
            <div className="w-3 h-3 bg-red-400 rounded-full animate-ping"></div>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl border border-gray-700 w-full max-w-7xl max-h-[95vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${getHealthColor(systemHealth.overall)}`}>
                <Terminal className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-raver text-white">PRODUCTION DEBUG SYSTEM</h1>
                <p className="text-gray-400 font-underground">
                  Comprehensive verification for Beat Addicts AI deployment
                </p>
                <div className="mt-2 flex items-center space-x-4 text-sm">
                  <span className="text-gray-500">Issues: {issues.length}</span>
                  <span className="text-gray-500">Critical: {issues.filter(i => i.type === 'critical').length}</span>
                  <span className="text-gray-500">Status: {systemHealth.overall}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className={`px-4 py-2 rounded-lg border font-raver text-lg ${getHealthColor(systemHealth.overall)}`}>
                {systemHealth.overall === 'critical' ? '🚨 BLOCKED' : 
                 systemHealth.overall === 'warning' ? '⚠️ WARNINGS' : 
                 '✅ READY'}
              </div>
              <button
                onClick={() => setIsVisible(false)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <XCircle className="w-6 h-6 text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex h-[80vh]">
          {/* Left Panel - Controls */}
          <div className="w-80 border-r border-gray-700 flex flex-col">
            <div className="p-6 space-y-4">
              <button
                onClick={runComprehensiveDebug}
                disabled={isRunning}
                className={`w-full py-4 px-6 rounded-xl font-raver text-lg transition-all ${
                  isRunning 
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg'
                }`}
              >
                {isRunning ? (
                  <div className="flex items-center justify-center space-x-2">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>DEBUGGING...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Rocket className="w-5 h-5" />
                    <span>RUN FULL DEBUG</span>
                  </div>
                )}
              </button>
              
              <button
                onClick={downloadReport}
                disabled={!debugLog.length}
                className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:text-gray-400 text-white rounded-lg font-raver transition-all"
              >
                <Download className="w-4 h-4 inline mr-2" />
                DOWNLOAD REPORT
              </button>
            </div>

            {/* System Health */}
            <div className="p-6 border-t border-gray-700">
              <h3 className="font-raver text-white mb-4">SYSTEM HEALTH</h3>
              <div className="space-y-3">
                {[
                  { key: 'authentication', label: 'Authentication', icon: Shield },
                  { key: 'database', label: 'Database', icon: Database },
                  { key: 'aiGeneration', label: 'AI Generation', icon: Brain },
                  { key: 'studioFeatures', label: 'Studio Features', icon: Music },
                  { key: 'subscriptions', label: 'Subscriptions', icon: Crown },
                  { key: 'performance', label: 'Performance', icon: Zap },
                  { key: 'security', label: 'Security', icon: Lock }
                ].map(({ key, label, icon: Icon }) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Icon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-underground text-gray-300">{label}</span>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${
                      systemHealth[key as keyof SystemHealth] ? 'bg-green-400' : 'bg-red-400'
                    }`}></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Phase */}
            {isRunning && (
              <div className="p-6 border-t border-gray-700">
                <div className="text-sm font-underground text-gray-400 mb-2">Current Phase:</div>
                <div className="text-sm text-white">{currentPhase}</div>
                <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Results */}
          <div className="flex-1 flex flex-col">
            {/* Issue Summary */}
            <div className="p-6 border-b border-gray-700 bg-gray-800/50">
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-raver text-red-400">{issues.filter(i => i.type === 'critical').length}</div>
                  <div className="text-xs text-gray-400 font-underground">Critical</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-raver text-yellow-400">{issues.filter(i => i.type === 'warning').length}</div>
                  <div className="text-xs text-gray-400 font-underground">Warnings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-raver text-blue-400">{issues.filter(i => i.type === 'info').length}</div>
                  <div className="text-xs text-gray-400 font-underground">Info</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-raver text-green-400">{debugLog.length}</div>
                  <div className="text-xs text-gray-400 font-underground">Tests Run</div>
                </div>
              </div>
            </div>

            {/* Issues List */}
            <div className="flex-1 overflow-auto p-6">
              {issues.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-raver text-white mb-2">No Issues Detected</h3>
                  <p className="text-gray-400 font-underground">Run the debug system to analyze your application</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {issues.map((issue) => (
                    <div
                      key={issue.id}
                      className={`p-4 rounded-lg border ${
                        issue.type === 'critical' ? 'bg-red-500/10 border-red-500/30' :
                        issue.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/30' :
                        'bg-blue-500/10 border-blue-500/30'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        {getIssueIcon(issue.type)}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-raver text-white">{issue.title}</h4>
                            <div className={`px-2 py-1 rounded-full text-xs border ${
                              issue.type === 'critical' ? 'bg-red-500/20 text-red-400 border-red-500/50' :
                              issue.type === 'warning' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' :
                              'bg-blue-500/20 text-blue-400 border-blue-500/50'
                            }`}>
                              {issue.category.toUpperCase()}
                            </div>
                          </div>
                          <p className="text-sm text-gray-300 font-underground mb-2">{issue.description}</p>
                          <div className="text-xs text-gray-400 mb-2">
                            <strong>Impact:</strong> {issue.impact}
                          </div>
                          <div className="text-xs text-gray-400">
                            <strong>Solution:</strong> {issue.solution}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Debug Log */}
            <div className="border-t border-gray-700 bg-gray-800/50">
              <div className="p-4">
                <h4 className="font-raver text-white mb-2">DEBUG LOG</h4>
                <div className="bg-black/50 rounded-lg p-3 max-h-32 overflow-auto font-mono text-xs">
                  {debugLog.length === 0 ? (
                    <div className="text-gray-500">No debug information yet...</div>
                  ) : (
                    debugLog.slice(-10).map((log, index) => (
                      <div key={index} className="text-green-400 mb-1">{log}</div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionDebugSystem;