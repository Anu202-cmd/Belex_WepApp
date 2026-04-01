import * as React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { LandingPage } from "./pages/LandingPage";
import { JobSearch } from "./pages/JobSearch";
import { JobDetails } from "./pages/JobDetails";
import { Dashboard } from "./pages/Dashboard";
import { JobAlerts } from "./pages/JobAlerts";
import { Signup } from "./pages/Signup";
import { Schools } from "./pages/Schools";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { TeacherProfile } from "./pages/TeacherProfile";
import { Pricing } from "./pages/Pricing";
import { PrivacyPolicy, TermsOfService, CookiePolicy } from "./pages/Legal";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Toaster } from "sonner";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
}

function AppContent() {
  const location = useLocation();
  const hideNavFooter = ["/signup", "/login"].includes(location.pathname);

  return (
    <div className="flex min-h-screen flex-col">
      {!hideNavFooter && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/jobs" element={<JobSearch />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/alerts" 
            element={
              <ProtectedRoute>
                <JobAlerts />
              </ProtectedRoute>
            } 
          />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Signup />} /> {/* Reuse signup for demo */}
          <Route path="/schools" element={<Schools />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/cookies" element={<CookiePolicy />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <TeacherProfile />
              </ProtectedRoute>
            } 
          />
          <Route path="/post-job" element={<Signup />} />
        </Routes>
      </main>
      {!hideNavFooter && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Toaster position="top-center" richColors />
          <AppContent />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}
