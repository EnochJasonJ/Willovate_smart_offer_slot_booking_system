import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import OfferListing from './pages/OfferListing';
import OfferDetail from './pages/OfferDetail';
import BookingConfirmation from './pages/BookingConfirmation';
import MyBookings from './pages/MyBookings';
import AdminLogin from './pages/AdminLogin';
import AdminRegister from './pages/AdminRegister';
import AdminDashboard from './pages/AdminDashboard';
import AdminOffers from './pages/AdminOffers';
import CreateOffer from './pages/CreateOffer';
import AdminBusiness from './pages/AdminBusiness';
import AdminBookings from './pages/AdminBookings';
import { authService } from './services/authService';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Simple Auth Guard
const ProtectedRoute = ({ children, role }: { children: React.ReactNode, role?: 'Admin' | 'Customer' }) => {
  const token = localStorage.getItem('token');
  const user = authService.getCurrentUser();
  
  if (!token || !user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<OfferListing />} />
          <Route path="/offers/:id" element={<OfferDetail />} />
          <Route path="/confirmation" element={<BookingConfirmation />} />
          <Route 
            path="/my-bookings" 
            element={
              <ProtectedRoute role="Customer">
                <MyBookings />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute role="Admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/offers" 
            element={
              <ProtectedRoute role="Admin">
                <AdminOffers />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/offers/create" 
            element={
              <ProtectedRoute role="Admin">
                <CreateOffer />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/business" 
            element={
              <ProtectedRoute role="Admin">
                <AdminBusiness />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/bookings" 
            element={
              <ProtectedRoute role="Admin">
                <AdminBookings />
              </ProtectedRoute>
            } 
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
