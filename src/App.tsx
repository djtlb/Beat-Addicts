import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { Toaster } from './components/ui/toaster';
import Layout from './components/Layout';
import LoginForm from './components/LoginForm';
import LoadingSpinner from './components/LoadingSpinner';
import PremiumGate from './components/PremiumGate';

// Pages
import Dashboard from './pages/Dashboard';
import Generate from './pages/Generate';
import Studio from './pages/Studio';
import DrumAndBassDemo from './pages/DrumAndBassDemo';
import StemSplitter from './pages/StemSplitter';
import LyricsFlow from './pages/LyricsFlow';
import Harmonies from './pages/Harmonies';
import Library from './pages/Library';
import Profile from './pages/Profile';
import Pricing from './pages/Pricing';
import Admin from './pages/Admin';
import ProductionReadiness from './pages/ProductionReadiness';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function AppContent() {
  const { user, loading, isAdmin } = useAuth();

  console.log('🚀 Beat Addicts AI App loading...', {
    user: user?.email,
    loading,
    isAdmin: isAdmin?.()
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/generate" element={<Generate />} />
        <Route 
          path="/studio" 
          element={
            <PremiumGate feature="Studio" requiredTier="studio">
              <Studio />
            </PremiumGate>
          } 
        />
        <Route path="/demo-dnb" element={<DrumAndBassDemo />} />
        <Route path="/stem-splitter" element={<StemSplitter />} />
        <Route path="/lyrics-flow" element={<LyricsFlow />} />
        <Route path="/harmonies" element={<Harmonies />} />
        <Route path="/library" element={<Library />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/pricing" element={<Pricing />} />
        
        {/* Admin Routes */}
        {isAdmin && isAdmin() && (
          <>
            <Route path="/admin" element={<Admin />} />
            <Route path="/production-readiness" element={<ProductionReadiness />} />
          </>
        )}
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
            <AppContent />
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;