import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, requireOrganizer = false }) {
  const { currentUser, isOrganizer, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-mono text-zinc-400">Verifying Cloud Session...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (requireOrganizer && !isOrganizer) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="glass-panel-elevated p-8 rounded-2xl max-w-md text-center border border-zinc-700">
          <h2 className="text-xl font-bold text-white mb-2">Organizer Privilege Required</h2>
          <p className="text-sm text-zinc-400 mb-6">
            This command center is reserved for event hosts. Use the role switcher in the top right to switch to <strong className="text-indigo-400">Alex Rivers (Organizer)</strong> to access this view.
          </p>
          <a
            href="/"
            className="inline-block px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-colors"
          >
            Return to Explore
          </a>
        </div>
      </div>
    );
  }

  return children;
}
