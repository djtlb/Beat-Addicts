import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';
import LoginForm from './components/LoginForm';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Dashboard from './pages/Dashboard';
import DrumAndBassDemo from './pages/DrumAndBassDemo';
import Generate from './pages/Generate';
import Harmonies from './pages/Harmonies';
import Library from './pages/Library';
import LyricsFlow from './pages/LyricsFlow';
import Profile from './pages/Profile';
import StemSplitter from './pages/StemSplitter';

function AppContent() {
  const { user, loading } = useAuth();

  console.log('AppContent rendered, user:', user?.email, 'loading:', loading);

  // Show loading state with timeout fallback
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Beat Addicts AI</h2>
            <p className="text-muted-foreground">Loading your music studio...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/generate" element={<Generate />} />
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
  console.log('App component rendered');

  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
