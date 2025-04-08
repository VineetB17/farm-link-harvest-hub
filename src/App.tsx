
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Inventory from "./pages/Inventory";
import Marketplace from "./pages/Marketplace";
import Weather from "./pages/Weather";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Lending from "./pages/Lending";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useAuth();
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Main Layout component with auth-aware navbar
const Layout = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn, logout } = useAuth();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isLoggedIn={isLoggedIn} onLogout={logout} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

// Main App component with routes
const AppContent = () => {
  const { login, signup } = useAuth();
  
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLogin={login} />} />
        <Route path="/signup" element={<Signup onSignup={signup} />} />
        <Route path="/marketplace" element={<Marketplace />} />
        
        {/* Protected routes */}
        <Route path="/inventory" element={
          <ProtectedRoute>
            <Inventory />
          </ProtectedRoute>
        } />
        
        <Route path="/weather" element={
          <ProtectedRoute>
            <Weather />
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        
        <Route path="/lending" element={
          <ProtectedRoute>
            <Lending />
          </ProtectedRoute>
        } />
        
        {/* Not found route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
