import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthPage } from './components/auth/AuthPage';
import { Layout } from './components/dashboard/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { AttendeesPage } from './pages/AttendeesPage';
import { RsvpsPage } from './pages/RsvpsPage';
import { TablesPage } from './pages/TablesPage';
import { SettingsPage } from './pages/SettingsPage';
import { LandingPage } from './pages/LandingPage';
import { PreviewPage } from './pages/PreviewPage';
import { PublicSitePage } from './pages/PublicSitePage';
import { PublicSite } from './pages/PublicSite';
import { SongRecommendationsPage } from './pages/SongRecommendationsPage';
import { RemindersPage } from './pages/RemindersPage';
import { RequireLandingPage } from './components/auth/RequireLandingPage';
import { trackPageView } from './lib/analytics';
import ExampleBurdeosPage from './pages/examples/ExampleBurdeosPage';
import ExampleEsmeraldaPage from './pages/examples/ExampleEsmeraldaPage';
import ExampleMinimalistaPage from './pages/examples/ExampleMinimalistaPage';
import ExampleDeluxeJadePage from './pages/examples/ExampleDeluxeJadePage';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const isPanel = window.location.hostname.startsWith('panel.');

  // Track page views
  React.useEffect(() => {
    trackPageView(window.location.pathname);
  }, [window.location.pathname]);

  return (
    <BrowserRouter>
      <Routes>
        {isPanel ? (
          // Panel routes
          <>
            <Route path="/auth" element={<AuthPage />} />
            <Route
              path="/"
              element={
                <RequireAuth>
                  <RequireLandingPage>
                    <Layout>
                      <DashboardPage />
                    </Layout>
                  </RequireLandingPage>
                </RequireAuth>
              }
            />
            <Route
              path="/attendees"
              element={
                <RequireAuth>
                  <RequireLandingPage>
                    <Layout>
                      <AttendeesPage />
                    </Layout>
                  </RequireLandingPage>
                </RequireAuth>
              }
            />
            <Route
              path="/rsvps"
              element={
                <RequireAuth>
                  <RequireLandingPage>
                    <Layout>
                      <RsvpsPage />
                    </Layout>
                  </RequireLandingPage>
                </RequireAuth>
              }
            />
            <Route
              path="/reminders"
              element={
                <RequireAuth>
                  <RequireLandingPage>
                    <Layout>
                      <RemindersPage />
                    </Layout>
                  </RequireLandingPage>
                </RequireAuth>
              }
            />
            <Route
              path="/tables"
              element={
                <RequireAuth>
                  <RequireLandingPage>
                    <Layout>
                      <TablesPage />
                    </Layout>
                  </RequireLandingPage>
                </RequireAuth>
              }
            />
            <Route
              path="/settings"
              element={
                <RequireAuth>
                  <Layout>
                    <SettingsPage />
                  </Layout>
                </RequireAuth>
              }
            />
            <Route
              path="/landing"
              element={
                <RequireAuth>
                  <Layout>
                    <LandingPage />
                  </Layout>
                </RequireAuth>
              }
            />
            <Route
              path="/songs"
              element={
                <RequireAuth>
                  <RequireLandingPage>
                    <Layout>
                      <SongRecommendationsPage />
                    </Layout>
                  </RequireLandingPage>
                </RequireAuth>
              }
            />
            <Route
              path="/preview/:userId"
              element={
                <RequireAuth>
                  <RequireLandingPage>
                    <PreviewPage />
                  </RequireLandingPage>
                </RequireAuth>
              }
            />
            <Route path="/lp" element={<PublicSite />} />
            <Route path="/ejemplo/burdeos" element={<ExampleBurdeosPage />} />
            <Route path="/ejemplo/esmeralda" element={<ExampleEsmeraldaPage />} />
            <Route path="/ejemplo/minimalista" element={<ExampleMinimalistaPage />} />
            <Route path="/ejemplo/deluxe-jade" element={<ExampleDeluxeJadePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          // Public site routes
          <>
            <Route path="/" element={<PublicSite />} />
            <Route path="/invitacion/:slug" element={<PublicSitePage />} />
            <Route path="/ejemplo/burdeos" element={<ExampleBurdeosPage />} />
            <Route path="/ejemplo/esmeralda" element={<ExampleEsmeraldaPage />} />
            <Route path="/ejemplo/minimalista" element={<ExampleMinimalistaPage />} />
            <Route path="/ejemplo/deluxe-jade" element={<ExampleDeluxeJadePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <Toaster 
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }} 
      />
    </AuthProvider>
  );
}

export default App;