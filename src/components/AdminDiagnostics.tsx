import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw, 
  Settings, 
  User,
  Database,
  Shield,
  Wrench,
  AlertCircle,
  Zap,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { 
  diagnoseUserAdminStatus, 
  checkAndFixCurrentUserAdmin,
  emergencyGrantAdminAccess,
  checkAdminUsersTable,
  addToAdminUsersTable,
  UserDiagnostics 
} from '../lib/adminUtils';

const AdminDiagnostics = () => {
  const { user, isAdmin, refreshUserData, forceRefresh } = useAuth();
  const [diagnostics, setDiagnostics] = useState<UserDiagnostics | null>(null);
  const [loading, setLoading] = useState(false);
  const [fixing, setFixing] = useState(false);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [adminTableCheck, setAdminTableCheck] = useState<boolean | null>(null);

  const runDiagnostics = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const result = await diagnoseUserAdminStatus(user.id);
      setDiagnostics(result);
      
      // Also check admin_users table
      const adminTableResult = await checkAdminUsersTable(user.email!);
      setAdminTableCheck(adminTableResult);
    } catch (error) {
      console.error('Error running diagnostics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fixAdminStatus = async () => {
    setFixing(true);
    try {
      const success = await checkAndFixCurrentUserAdmin();
      if (success) {
        console.log('✅ Admin status fixed successfully');
        // Refresh diagnostics
        await runDiagnostics();
        // Refresh auth context
        await refreshUserData();
        // Force a complete refresh
        setTimeout(() => {
          forceRefresh();
        }, 1000);
      }
    } catch (error) {
      console.error('Error fixing admin status:', error);
    } finally {
      setFixing(false);
    }
  };

  const emergencyRestore = async () => {
    setEmergencyMode(true);
    try {
      // First, add to admin_users table if not already there
      if (user?.email && !adminTableCheck) {
        await addToAdminUsersTable(user.email);
      }
      
      // Then grant emergency admin access
      const success = await emergencyGrantAdminAccess();
      if (success) {
        console.log('🚨 Emergency admin restore successful');
        // Refresh everything
        await runDiagnostics();
        await refreshUserData();
        setTimeout(() => {
          forceRefresh();
          window.location.reload(); // Force complete page reload
        }, 1500);
      }
    } catch (error) {
      console.error('Emergency restore failed:', error);
    } finally {
      setEmergencyMode(false);
    }
  };

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="w-5 h-5 text-green-400" />
    ) : (
      <AlertTriangle className="w-5 h-5 text-red-400" />
    );
  };

  const getRecommendationText = (action: string) => {
    switch (action) {
      case 'create_profile':
        return 'Create missing user profile with admin privileges';
      case 'set_admin_flag':
        return 'Set admin flag in user profile';
      case 'sync_profile_from_auth':
        return 'Sync profile admin status from auth metadata';
      case 'sync_auth_from_profile':
        return 'Sync auth metadata from profile admin status';
      default:
        return 'No action needed - admin status is correct';
    }
  };

  return (
    <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Settings className="w-6 h-6 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Admin Status Diagnostics</h3>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={runDiagnostics}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Diagnose</span>
          </button>
          {diagnostics && diagnostics.recommendedAction !== 'none' && (
            <button
              onClick={fixAdminStatus}
              disabled={fixing}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              <Wrench className={`w-4 h-4 ${fixing ? 'animate-pulse' : ''}`} />
              <span>Fix Issues</span>
            </button>
          )}
          <button
            onClick={emergencyRestore}
            disabled={emergencyMode}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2"
          >
            <Zap className={`w-4 h-4 ${emergencyMode ? 'animate-pulse' : ''}`} />
            <span>Emergency Restore</span>
          </button>
        </div>
      </div>

      {/* Current Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <User className="w-6 h-6 text-blue-400" />
            <div>
              <p className="font-medium text-white">Current User</p>
              <p className="text-sm text-gray-400">{user?.email}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Shield className="w-6 h-6 text-purple-400" />
            <div>
              <p className="font-medium text-white">Admin Status</p>
              <p className={`text-sm ${isAdmin() ? 'text-green-400' : 'text-red-400'}`}>
                {isAdmin() ? 'Administrator' : 'Regular User'}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Database className="w-6 h-6 text-cyan-400" />
            <div>
              <p className="font-medium text-white">Database</p>
              <p className="text-sm text-cyan-400">Connected</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <UserPlus className="w-6 h-6 text-yellow-400" />
            <div>
              <p className="font-medium text-white">Admin Table</p>
              <p className={`text-sm ${
                adminTableCheck === null ? 'text-gray-400' :
                adminTableCheck ? 'text-green-400' : 'text-red-400'
              }`}>
                {adminTableCheck === null ? 'Not Checked' :
                 adminTableCheck ? 'In Admin List' : 'Not in Admin List'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Restore Info */}
      <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
          <div>
            <h4 className="font-medium text-red-300 mb-1">Emergency Admin Restore</h4>
            <p className="text-red-200 text-sm mb-2">
              If you've lost admin access, use the "Emergency Restore" button. This will:
            </p>
            <ul className="text-red-200 text-sm space-y-1 ml-4">
              <li>• Add your email to the admin_users table</li>
              <li>• Set is_admin=true in your profile</li>
              <li>• Force refresh the authentication context</li>
              <li>• Reload the page to apply changes</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Diagnostics Results */}
      {diagnostics && (
        <div className="space-y-4">
          <h4 className="text-md font-semibold text-white">Diagnostic Results</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                <span className="text-gray-300">Profile Exists</span>
                {getStatusIcon(diagnostics.profileExists)}
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                <span className="text-gray-300">Admin in Profile</span>
                {getStatusIcon(diagnostics.isAdminInProfile)}
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                <span className="text-gray-300">Admin in Auth Metadata</span>
                {getStatusIcon(diagnostics.isAdminInAuthMetadata)}
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                <span className="text-gray-300">In Admin Users Table</span>
                {getStatusIcon(adminTableCheck || false)}
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="p-3 bg-gray-800/30 rounded-lg">
                <p className="text-sm text-gray-400 mb-1">User ID</p>
                <p className="text-xs font-mono text-white break-all">{diagnostics.userId}</p>
              </div>
              <div className="p-3 bg-gray-800/30 rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Email</p>
                <p className="text-sm text-white">{diagnostics.email}</p>
              </div>
              <div className="p-3 bg-gray-800/30 rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Errors</p>
                <p className="text-xs text-red-400">
                  {diagnostics.errors.length > 0 ? diagnostics.errors.join(', ') : 'None'}
                </p>
              </div>
            </div>
          </div>

          {/* Recommendation */}
          {diagnostics.recommendedAction !== 'none' && (
            <div className="p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-300">Recommended Action</p>
                  <p className="text-sm text-yellow-200">
                    {getRecommendationText(diagnostics.recommendedAction)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Profile Data */}
          {diagnostics.profileData && (
            <div className="p-4 bg-gray-800/30 rounded-lg">
              <p className="text-sm text-gray-400 mb-2">Raw Profile Data</p>
              <pre className="text-xs text-gray-300 overflow-x-auto">
                {JSON.stringify(diagnostics.profileData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {loading && (
        <div className="text-center py-8">
          <RefreshCw className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-2" />
          <p className="text-gray-400">Running diagnostics...</p>
        </div>
      )}

      {fixing && (
        <div className="text-center py-8">
          <Wrench className="w-8 h-8 text-green-400 animate-pulse mx-auto mb-2" />
          <p className="text-gray-400">Fixing admin status issues...</p>
        </div>
      )}

      {emergencyMode && (
        <div className="text-center py-8">
          <Zap className="w-8 h-8 text-red-400 animate-pulse mx-auto mb-2" />
          <p className="text-gray-400">Emergency restore in progress...</p>
          <p className="text-sm text-gray-500 mt-2">Page will reload automatically when complete</p>
        </div>
      )}
    </div>
  );
};

export default AdminDiagnostics;