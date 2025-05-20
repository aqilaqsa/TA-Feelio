import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Context Providers
import { AuthProvider } from './context/AuthContext';

// Components
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Learn from './pages/Learn';
import Achievements from './pages/Achievements';
import Statistics from './pages/Statistics';
import Playground from './pages/Playground';
import PendampingDashboard from './pages/PendampingDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/learn" 
            element={
              <ProtectedRoute>
                <Learn />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/achievements" 
            element={
              <ProtectedRoute>
                <Achievements />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/statistics" 
            element={
              <ProtectedRoute> 
                <Statistics />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/playground" 
            element={
              <ProtectedRoute>
                <Playground />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/pendamping" 
            element={
              <ProtectedRoute>
                <PendampingDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
