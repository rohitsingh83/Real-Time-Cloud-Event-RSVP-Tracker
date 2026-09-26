import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

import HomePage from './pages/HomePage';
import EventDetailsPage from './pages/EventDetailsPage';
import TokenRSVPPage from './pages/TokenRSVPPage';
import CreateEventPage from './pages/CreateEventPage';
import OrganizerDashboard from './pages/OrganizerDashboard';
import CheckInKioskPage from './pages/CheckInKioskPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-[#09090b] text-zinc-100 selection:bg-indigo-500/30 selection:text-indigo-200">
          <Navbar />
          
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/event/:id" element={<EventDetailsPage />} />
              <Route path="/rsvp" element={<TokenRSVPPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected Organizer & Staff Routes */}
              <Route
                path="/create-event"
                element={
                  <ProtectedRoute requireOrganizer={true}>
                    <CreateEventPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute requireOrganizer={true}>
                    <OrganizerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/kiosk"
                element={
                  <ProtectedRoute requireOrganizer={true}>
                    <CheckInKioskPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>

          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}
