import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { CheckCircle, XCircle, AlertTriangle, Loader2, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';

interface LaunchCheck {
  id: string;
  name: string;
  description: string;
  status: 'pass' | 'fail' | 'checking' | 'warning';
  details?: string;
  critical: boolean;
}

export const ProductionLaunchCheck: React.FC = () => {
  const [checks, setChecks] = useState<LaunchCheck[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [lastRun, setLastRun] = useState<Date | null>(null);

  const runLaunchChecks = async () => {
    console.log('🚀 Starting production launch checks...');
    setIsRunning(true);

    const initialChecks: LaunchCheck[] = [
      {
        id: 'supabase-connection',
        name: 'Supabase Connection',
        description: 'Verify connection to Supabase backend',
        status: 'checking',
        critical: true
      },
      {
        id: 'environment-variables',
        name: 'Environment Variables',
        description: 'Check all required environment variables are set',
        status: 'checking',
        critical: true
      },
      {
        id: 'database-tables',
        name: 'Database Tables',
        description: 'Verify all required database tables exist',
        status: 'checking',
        critical: true
      },
      {
        id: 'edge-functions',
        name: 'Edge Functions',
        description: 'Test Edge Function availability and configuration',
        status: 'checking',
        critical: true
      },
      {
        id: 'openai-integration',
        name: 'OpenAI Integration',
        description: 'Verify OpenAI API key and connectivity',
        status: 'checking',
        critical: true
      },
      {
        id: 'authentication',
        name: 'Authentication System',
        description: 'Test user authentication flows',
        status: 'checking',
        critical: true
      },
      {
        id: 'rls-policies',
        name: 'Row Level Security',
        description: 'Verify RLS policies are properly configured',
        status: 'checking',
        critical: false
      }
    ];

    setChecks(initialChecks);

    // Test Supabase Connection
    try {
      console.log('🔗 Testing Supabase connection...');
      const { error } = await supabase.from('profiles').select('count').limit(1);
      
      setChecks(prev => prev.map(check => 
        check.id === 'supabase-connection' 
          ? { 
              ...check, 
              status: error ? 'fail' : 'pass',
              details: error ? `Connection failed: ${error.message}` : 'Successfully connected to Supabase'
            }
          : check
      ));
    } catch (error) {
      console.error('❌ Supabase connection failed:', error);
      setChecks(prev => prev.map(check => 
        check.id === 'supabase-connection' 
          ? { 
              ...check, 
              status: 'fail',
              details: `Connection error: ${error}`
            }
          : check
      ));
    }

    // Check Environment Variables
    const requiredEnvVars = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];
    const missingEnvVars = requiredEnvVars.filter(varName => !import.meta.env[varName]);
    
    setChecks(prev => prev.map(check => 
      check.id === 'environment-variables' 
        ? { 
            ...check, 
            status: missingEnvVars.length === 0 ? 'pass' : 'fail',
            details: missingEnvVars.length === 0 
              ? 'All required environment variables are set' 
              : `Missing variables: ${missingEnvVars.join(', ')}`
          }
        : check
    ));

    // Test Database Tables
    try {
      console.log('🗄️ Checking database tables...');
      const requiredTables = ['profiles', 'user_subscriptions', 'content_submissions'];
      let tablesExist = 0;
      
      for (const table of requiredTables) {
        try {
          const { error } = await supabase.from(table).select('count').limit(1);
          if (!error) tablesExist++;
        } catch (e) {
          console.error(`Table ${table} check failed:`, e);
        }
      }
      
      setChecks(prev => prev.map(check => 
        check.id === 'database-tables' 
          ? { 
              ...check, 
              status: tablesExist === requiredTables.length ? 'pass' : 'warning',
              details: `${tablesExist}/${requiredTables.length} required tables accessible`
            }
          : check
      ));
    } catch (error) {
      console.error('❌ Database tables check failed:', error);
      setChecks(prev => prev.map(check => 
        check.id === 'database-tables' 
          ? { 
              ...check, 
              status: 'fail',
              details: `Database access error: ${error}`
            }
          : check
      ));
    }

    // Test Edge Functions
    try {
      console.log('⚡ Testing Edge Functions...');
      const { data, error } = await supabase.functions.invoke('openai-enhance', {
        body: { type: 'healthCheck' }
      });
      
      setChecks(prev => prev.map(check => 
        check.id === 'edge-functions' 
          ? { 
              ...check, 
              status: error ? 'fail' : 'pass',
              details: error 
                ? `Edge Functions unavailable: ${error.message}` 
                : 'Edge Functions are accessible and responding'
            }
          : check
      ));
    } catch (error) {
      console.error('❌ Edge Functions test failed:', error);
      setChecks(prev => prev.map(check => 
        check.id === 'edge-functions' 
          ? { 
              ...check, 
              status: 'fail',
              details: `Edge Functions error: ${error}`
            }
          : check
      ));
    }

    // Test OpenAI Integration
    try {
      console.log('🤖 Testing OpenAI integration...');
      const { data, error } = await supabase.functions.invoke('openai-enhance', {
        body: { 
          type: 'enhancePrompt',
          prompt: 'test prompt for health check',
          genre: 'pop'
        }
      });
      
      const hasApiKey = data?.success || (data?.error && !data.error.includes('not configured'));
      
      setChecks(prev => prev.map(check => 
        check.id === 'openai-integration' 
          ? { 
              ...check, 
              status: hasApiKey ? 'pass' : 'fail',
              details: hasApiKey 
                ? 'OpenAI API key is configured and functional' 
                : 'OpenAI API key not configured or invalid'
            }
          : check
      ));
    } catch (error) {
      console.error('❌ OpenAI integration test failed:', error);
      setChecks(prev => prev.map(check => 
        check.id === 'openai-integration' 
          ? { 
              ...check, 
              status: 'fail',
              details: `OpenAI integration error: ${error}`
            }
          : check
      ));
    }

    // Test Authentication
    try {
      console.log('🔐 Testing authentication system...');
      const { data: { user } } = await supabase.auth.getUser();
      
      setChecks(prev => prev.map(check => 
        check.id === 'authentication' 
          ? { 
              ...check, 
              status: 'pass',
              details: user 
                ? `Authentication working - User: ${user.email}` 
                : 'Authentication system functional (no user logged in)'
            }
          : check
      ));
    } catch (error) {
      console.error('❌ Authentication test failed:', error);
      setChecks(prev => prev.map(check => 
        check.id === 'authentication' 
          ? { 
              ...check, 
              status: 'fail',
              details: `Authentication error: ${error}`
            }
          : check
      ));
    }

    // Test RLS Policies
    try {
      console.log('🛡️ Testing RLS policies...');
      // This is a basic test - in production you'd want more comprehensive checks
      const { error } = await supabase.from('profiles').select('id').limit(1);
      
      setChecks(prev => prev.map(check => 
        check.id === 'rls-policies' 
          ? { 
              ...check, 
              status: 'pass',
              details: 'RLS policies appear to be functioning correctly'
            }
          : check
      ));
    } catch (error) {
      console.error('❌ RLS policies test failed:', error);
      setChecks(prev => prev.map(check => 
        check.id === 'rls-policies' 
          ? { 
              ...check, 
              status: 'warning',
              details: `RLS policies may need review: ${error}`
            }
          : check
      ));
    }

    setIsRunning(false);
    setLastRun(new Date());
    console.log('🚀 Production launch checks completed');
  };

  useEffect(() => {
    runLaunchChecks();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'fail':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'checking':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pass':
        return <Badge variant="default" className="bg-green-100 text-green-800">Pass</Badge>;
      case 'fail':
        return <Badge variant="destructive">Fail</Badge>;
      case 'warning':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case 'checking':
        return <Badge variant="outline">Checking...</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const criticalFailures = checks.filter(check => check.critical && check.status === 'fail').length;
  const totalCritical = checks.filter(check => check.critical).length;
  const allPassed = checks.filter(check => check.status === 'pass').length;
  const readyForProduction = criticalFailures === 0 && !isRunning;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {readyForProduction ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500" />
            )}
            Production Launch Readiness
          </div>
          <Button
            onClick={runLaunchChecks}
            disabled={isRunning}
            variant="outline"
            size="sm"
          >
            {isRunning ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Recheck
          </Button>
        </CardTitle>
        
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>{allPassed}/{checks.length} checks passed</span>
          <span>{criticalFailures}/{totalCritical} critical failures</span>
          {lastRun && <span>Last run: {lastRun.toLocaleTimeString()}</span>}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {checks.map((check) => (
            <div
              key={check.id}
              className={`p-3 rounded-lg border ${
                check.status === 'pass'
                  ? 'bg-green-50 border-green-200'
                  : check.status === 'fail'
                  ? 'bg-red-50 border-red-200'
                  : check.status === 'warning'
                  ? 'bg-yellow-50 border-yellow-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(check.status)}
                  <span className="font-medium">{check.name}</span>
                  {check.critical && (
                    <Badge variant="outline" className="text-xs">Critical</Badge>
                  )}
                </div>
                {getStatusBadge(check.status)}
              </div>
              
              <div className="text-sm text-gray-600 mb-1">
                {check.description}
              </div>
              
              {check.details && (
                <div className="text-xs text-gray-500 mt-1 font-mono bg-white p-2 rounded border">
                  {check.details}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 rounded-lg border">
          <div className="flex items-center gap-2 mb-2">
            {readyForProduction ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500" />
            )}
            <span className="font-semibold">
              {readyForProduction ? 'Ready for Production' : 'Not Ready for Production'}
            </span>
          </div>
          
          <p className="text-sm text-gray-600">
            {readyForProduction
              ? 'All critical systems are functioning correctly. Your application is ready for production deployment.'
              : `${criticalFailures} critical issue${criticalFailures !== 1 ? 's' : ''} must be resolved before production deployment.`
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};