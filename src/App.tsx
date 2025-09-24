import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import LoginForm from './components/LoginForm';
import PremiumGate from './components/PremiumGate';
import { useAuth } from './hooks/useAuth';
import Dashboard from './pages/Dashboard';
import DrumAndBassDemo from './pages/DrumAndBassDemo';
import Generate from './pages/Generate';
import Harmonies from './pages/Harmonies';
import Index from './pages/Index';
import Library from './pages/Library';
import LyricsFlow from './pages/LyricsFlow';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import RadioReadyGenerator from './pages/RadioReadyGenerator';
import StemSplitter from './pages/StemSplitter';

function AppContent() {
  const { user, loading } = useAuth();

  console.log('AppContent rendered, user:', user?.email, 'loading:', loading);

  // TEMPORARY: Bypass auth for debugging
  // if (loading) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center">
  //       <div className="text-center space-y-4">
  //         <LoadingSpinner size="lg" />
  //         <div>
  //           <h2 className="text-xl font-semibold text-foreground mb-2">Beat Addicts AI</h2>
  //           <p className="text-muted-foreground">Loading your music studio...</p>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  // if (!user) {
  //   return <LoginForm />;
  // }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/generate" element={<Generate />} />
          <Route path="/radio-ready" element={<RadioReadyGenerator />} />
          <Route path="/demo-dnb" element={<DrumAndBassDemo />} />
          <Route path="/stem-splitter" element={<StemSplitter />} />
          <Route path="/lyrics-flow" element={<LyricsFlow />} />
          <Route path="/harmonies" element={<Harmonies />} />
          <Route path="/library" element={<Library />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Layout>
    </div>
  );
}

function App() {
  const { user, loading, subscription } = useAuth();

  // Show loading spinner while auth is initializing
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your music studio...</p>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!user) {
    return <LoginForm />;
  }

  // Show premium gate if user doesn't have access
  if (!subscription || subscription.subscription_tier === 'free') {
    return <PremiumGate requiredTier="pro" showUpgrade={true}>{null}</PremiumGate>;
  }

  // Main app content
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/generate" element={<Generate />} />
        <Route path="/radio-ready" element={<RadioReadyGenerator />} />
        <Route path="/harmonies" element={<Harmonies />} />
        <Route path="/lyrics-flow" element={<LyricsFlow />} />
        <Route path="/stem-splitter" element={<StemSplitter />} />
        <Route path="/library" element={<Library />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

export default App;
