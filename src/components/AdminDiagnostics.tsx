import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  RefreshCw, 
  Settings, 
  Database,
  User,
  Crown,
  Zap,
  Activity
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { 
  diagnoseUserAdminStatus, 
  setupFullAdminAccess, 
  emergencyGrantAdminAccess,
  checkAndFixCurrentUserAdmin,
  type UserDiagnostics 
} from '../lib/adminUtils';

const AdminDiagnostics = () => {
  const { user, isAdmin, refreshUserData, forceRefresh, adminStatus } = useAuth();
  const [diagnostics, setDiagnostics] = useState<UserDiagnostics | null>(null);
  const [loading, setLoading] = useState(false);
  const [fixing, setFixing] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  console.log('🔧 AdminDiagnostics rendered - User:', user?.email, 'Admin Status:', adminStatus);

  const runDiagnostics = async () => {
    if (!user) return;

    setLoading(true);
    try {
      console.log('🔍 Running comprehensive diagnostics...');
      const result = await diagnoseUserAdminStatus(user.id);
      setDiagnostics(result);
      setLastCheck(new Date());
      console.log('📊 Diagnostics complete:', result);
    } catch (error) {
      console.error('❌ Diagnostics error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fixAdminAccess = async () => {
    if (!user) return;

    setFixing(true);
    try {
      console.log('🛠️ Attempting to fix admin access...');
      
      // First try the smart fix
      const smartFixResult = await checkAndFixCurrentUserAdmin();
      console.log('🔧 Smart fix result:', smartFixResult);
      
      if (!smartFixResult) {
        // If smart fix fails, try emergency grant
        console.log('🚨 Smart fix failed, trying emergency grant...');
        const emergencyResult = await emergencyGrantAdminAccess();
        console.log('🚨 Emergency grant result:', emergencyResult);
      }

      // Refresh everything
      await refreshUserData();
      forceRefresh();
      
      // Wait a bit then re-run diagnostics
      setTimeout(() => {
        runDiagnostics();
      }, 1000);
      
    } catch (error) {
      console.error('❌ Fix admin access error:', error);
    } finally {
      setFixing(false);
    }
  };

  const setupCompleteAdmin = async () => {
    if (!user) return;

    setFixing(true);
    try {
      console.log('🛡️ Setting up complete admin access...');
      const result = await setupFullAdminAccess(user.id, user.email!);
      console.log('🛡️ Complete setup result:', result);
      
      // Refresh everything
      await refreshUserData();
      forceRefresh();
      
      // Re-run diagnostics
      setTimeout(() => {
        runDiagnostics();
      }, 1000);
      
    } catch (error) {
      console.error('❌ Complete admin setup error:', error);
    } finally {
      setFixing(false);
    }
  };

  useEffect(() => {
    if (user) {
      runDiagnostics();
    }
  }, [user]);

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="w-5 h-5 text-green-400" />
    ) : (
      <XCircle className="w-5 h-5 text-red-400" />
    );
  };

  const getOverallStatus = () => {
    if (!diagnostics) return 'unknown';
    
    const adminByAnyMethod = diagnostics.isHardcodedAdmin || 
                           diagnostics.isAdminInProfile || 
                           diagnostics.isInAdminUsersTable;
    
    if (adminByAnyMethod && diagnostics.hasStudioSubscription) return 'healthy';
    if (adminByAnyMethod) return 'partial';
    return 'no-access';
  };

  const currentAdminStatus = isAdmin();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-purple-400" />
            <div>
              <h3 className="text-xl font-bold text-white">Admin Status Diagnostics</h3>
              <p className="text-gray-400">Comprehensive admin privilege analysis</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={runDiagnostics}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {lastCheck && (
          <p className="text-sm text-gray-400 mb-4">
            Last check: {lastCheck.toLocaleTimeString()}
          </p>
        )}

        {/* Current Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg border ${
            currentAdminStatus 
              ? 'bg-green-500/20 border-green-500/30' 
              : 'bg-red-500/20 border-red-500/30'
          }`}>
            <div className="flex items-center space-x-3">
              {currentAdminStatus ? (
                <CheckCircle className="w-6 h-6 text-green-400" />
              ) : (
                <XCircle className="w-6 h-6 text-red-400" />
              )}
              <div>
                <p className="font-medium text-white">Current Status</p>
                <p className={`text-sm ${currentAdminStatus ? 'text-green-400' : 'text-red-400'}`}>
                  {currentAdminStatus ? 'Administrator' : 'No Admin Access'}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
            <div className="flex items-center space-x-3">
              <User className="w-6 h-6 text-blue-400" />
              <div>
                <p className="font-medium text-white">User Email</p>
                <p className="text-sm text-blue-400">{user?.email}</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-purple-500/20 border border-purple-500/30 rounded-lg">
            <div className="flex items-center space-x-3">
              <Activity className="w-6 h-6 text-purple-400" />
              <div>
                <p className="font-medium text-white">Overall Status</p>
                <p className="text-sm text-purple-400 capitalize">
                  {getOverallStatus().replace('-', ' ')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Admin Status from Hook */}
      <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          <span>Live Admin Status (useAuth Hook)</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
            {getStatusIcon(adminStatus.isHardcodedAdmin)}
            <div>
              <p className="text-sm font-medium text-white">Hardcoded Admin</p>
              <p className="text-xs text-gray-400">{adminStatus.isHardcodedAdmin ? 'Yes' : 'No'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
            {getStatusIcon(adminStatus.isProfileAdmin)}
            <div>
              <p className="text-sm font-medium text-white">Profile Admin</p>
              <p className="text-xs text-gray-400">{adminStatus.isProfileAdmin ? 'Yes' : 'No'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
            {getStatusIcon(adminStatus.isInAdminTable)}
            <div>
              <p className="text-sm font-medium text-white">Admin Table</p>
              <p className="text-xs text-gray-400">{adminStatus.isInAdminTable ? 'Yes' : 'No'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
            {getStatusIcon(adminStatus.finalAdminStatus)}
            <div>
              <p className="text-sm font-medium text-white">Final Status</p>
              <p className="text-xs text-gray-400">{adminStatus.finalAdminStatus ? 'Admin' : 'User'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Diagnostics */}
      {diagnostics && (
        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <Database className="w-5 h-5 text-blue-400" />
            <span>Database Diagnostics</span>
          </h4>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-white">Hardcoded Admin List</span>
                  {getStatusIcon(diagnostics.isHardcodedAdmin)}
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-white">Profile Admin Flag</span>
                  {getStatusIcon(diagnostics.isAdminInProfile)}
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-white">Admin Users Table</span>
                  {getStatusIcon(diagnostics.isInAdminUsersTable)}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-white">Profile Exists</span>
                  {getStatusIcon(diagnostics.profileExists)}
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-white">Studio Subscription</span>
                  {getStatusIcon(diagnostics.hasStudioSubscription)}
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-white">Auth Metadata Admin</span>
                  {getStatusIcon(diagnostics.isAdminInAuthMetadata)}
                </div>
              </div>
            </div>

            {/* Recommended Action */}
            {diagnostics.recommendedAction !== 'none' && (
              <div className="mt-6 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-6 h-6 text-yellow-400 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-yellow-300 mb-1">Recommended Action</h5>
                    <p className="text-yellow-200 text-sm mb-3">
                      Action needed: <code className="bg-yellow-900/30 px-2 py-1 rounded text-yellow-300">
                        {diagnostics.recommendedAction}
                      </code>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Errors */}
            {diagnostics.errors.length > 0 && (
              <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                <h5 className="font-medium text-red-300 mb-2">Errors Encountered</h5>
                <ul className="space-y-1">
                  {diagnostics.errors.map((error, index) => (
                    <li key={index} className="text-sm text-red-200">
                      • {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={fixAdminAccess}
          disabled={fixing || loading}
          className="flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg transition-colors"
        >
          <Settings className={`w-5 h-5 ${fixing ? 'animate-spin' : ''}`} />
          <span>{fixing ? 'Fixing...' : 'Auto-Fix Admin Access'}</span>
        </button>

        <button
          onClick={setupCompleteAdmin}
          disabled={fixing || loading}
          className="flex items-center space-x-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg transition-colors"
        >
          <Crown className="w-5 h-5" />
          <span>Complete Admin Setup</span>
        </button>

        <button
          onClick={() => {
            refreshUserData();
            forceRefresh();
            setTimeout(runDiagnostics, 500);
          }}
          disabled={loading}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh All</span>
        </button>
      </div>

      {/* Status Summary */}
      <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-lg p-4">
        <h5 className="font-medium text-white mb-2">💡 Quick Summary</h5>
        <div className="text-sm text-gray-300 space-y-1">
          <p>• <strong>Current Admin Status:</strong> {currentAdminStatus ? '✅ Active' : '❌ Inactive'}</p>
          <p>• <strong>User Email:</strong> {user?.email}</p>
          <p>• <strong>Hardcoded Admin:</strong> {adminStatus.isHardcodedAdmin ? '✅ Yes' : '❌ No'}</p>
          <p>• <strong>Database Admin:</strong> {adminStatus.isProfileAdmin ? '✅ Yes' : '❌ No'}</p>
          {!currentAdminStatus && (
            <p className="text-yellow-300 mt-2">
              👆 Use "Auto-Fix Admin Access" to resolve issues automatically.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDiagnostics;