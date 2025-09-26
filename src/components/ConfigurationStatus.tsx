import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { CheckCircle, XCircle, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { envValidator } from '../lib/envValidation';

export const ConfigurationStatus: React.FC = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [config, setConfig] = useState({
    supabaseUrl: '',
    supabaseKey: '',
    openaiKey: ''
  });

  useEffect(() => {
    // Check environment variables
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
    const openaiKey = import.meta.env.OPENAI_API_KEY || '';

    setConfig({
      supabaseUrl,
      supabaseKey,
      openaiKey
    });

    // Log environment status
    envValidator.logEnvironmentStatus();
  }, []);

  const maskValue = (value: string, showLength: number = 8) => {
    if (!value) return 'Not Set';
    if (!showDetails) {
      return value.substring(0, showLength) + '...***';
    }
    return value;
  };

  const getStatusIcon = (isValid: boolean) => {
    return isValid ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <XCircle className="w-4 h-4 text-red-500" />
    );
  };

  const getStatusBadge = (isValid: boolean) => {
    return isValid ? (
      <Badge variant="default" className="bg-green-100 text-green-800">Configured</Badge>
    ) : (
      <Badge variant="destructive">Missing</Badge>
    );
  };

  const supabaseConfigured = !!(config.supabaseUrl && config.supabaseKey);
  const openaiConfigured = !!config.openaiKey;
  const isValid = envValidator.isValid();
  const errors = envValidator.getErrors();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon(isValid)}
            Configuration Status
          </div>
          <Button
            onClick={() => setShowDetails(!showDetails)}
            variant="outline"
            size="sm"
          >
            {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showDetails ? 'Hide' : 'Show'} Details
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon(!!config.supabaseUrl)}
              <span>Supabase URL</span>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(!!config.supabaseUrl)}
              {showDetails && config.supabaseUrl && (
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {maskValue(config.supabaseUrl, 20)}
                </code>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon(!!config.supabaseKey)}
              <span>Supabase Anon Key</span>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(!!config.supabaseKey)}
              {showDetails && config.supabaseKey && (
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {maskValue(config.supabaseKey, 12)}
                </code>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon(openaiConfigured)}
              <span>OpenAI API Key</span>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(openaiConfigured)}
              {showDetails && config.openaiKey && (
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {maskValue(config.openaiKey, 8)}
                </code>
              )}
            </div>
          </div>
        </div>

        {errors.length > 0 && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="font-medium text-red-800">Configuration Issues</span>
            </div>
            <ul className="text-sm text-red-600 list-disc list-inside">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-2">Setup Instructions:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Click the green "Supabase" button in the top-right corner</li>
              <li>Connect your Supabase project to auto-configure variables</li>
              <li>Add the OpenAI API key using the secrets management</li>
              <li>Refresh the page to verify the connection</li>
            </ol>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="font-medium">Overall Status:</span>
            <div className="flex items-center gap-2">
              {getStatusIcon(isValid && supabaseConfigured)}
              <span className={isValid && supabaseConfigured ? 'text-green-600' : 'text-red-600'}>
                {isValid && supabaseConfigured ? 'Ready' : 'Needs Configuration'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};