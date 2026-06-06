import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import SolarResourceIntelligence from './pages/SolarResourceIntelligence';
import GenerationDashboard from './pages/GenerationDashboard';
import AerosolImpact from './pages/AerosolImpact';
import SolarMap from './pages/SolarMap';
import SolarParks from './pages/SolarParks';
import AboutUs from './pages/AboutUs';
import Feedback from './pages/Feedback';
import Settings from './pages/Settings';
import DashboardLayout from './components/DashboardLayout';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Dashboard Routes */}
            <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/solar-resource-intelligence" element={<SolarResourceIntelligence />} />
              <Route path="/generation-dashboard" element={<GenerationDashboard />} />
              <Route path="/aerosol-impact" element={<AerosolImpact />} />
              <Route path="/solar-map" element={<SolarMap />} />
              <Route path="/solar-parks" element={<SolarParks />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/settings" element={<Settings />} />
              
              {/* Legacy Redirects */}
              <Route path="/ghi-analytics" element={<Navigate to="/solar-resource-intelligence" replace />} />
              <Route path="/generation" element={<Navigate to="/generation-dashboard" replace />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </SettingsProvider>
  );
}

export default App;
