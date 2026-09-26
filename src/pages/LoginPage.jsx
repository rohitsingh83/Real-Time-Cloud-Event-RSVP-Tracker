import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Sparkles, ShieldCheck, UserCheck, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DEMO_USERS } from '../config/constants';

export default function LoginPage() {
  const { login, switchDemoRole } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (roleKey) => {
    switchDemoRole(roleKey);
    navigate('/');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md glass-panel-elevated rounded-3xl p-8 border border-zinc-700/80 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mx-auto mb-2">
            <LogIn className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Sign in to CloudRSVP</h2>
          <p className="text-xs text-zinc-400">Access your events, live dashboards, and ticket passes</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/60 border border-rose-500/40 rounded-xl text-xs text-rose-300">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">Email Address</label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700/80 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700/80 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-colors shadow-lg shadow-indigo-600/30"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* 1-Click Evaluation / Demo Login */}
        <div className="pt-4 border-t border-zinc-800 space-y-2">
          <p className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider text-center">
            Examiner & Student Quick Simulation
          </p>
          <div className="grid grid-cols-1 gap-2 pt-1">
            <button
              onClick={() => handleQuickLogin('ORGANIZER')}
              className="w-full py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-indigo-500/30 text-xs text-indigo-300 font-medium flex items-center justify-between transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                Sign in as Alex (Organizer)
              </span>
              <span className="text-[10px] font-mono text-zinc-500">Host Mode</span>
            </button>

            <button
              onClick={() => handleQuickLogin('ATTENDEE_A')}
              className="w-full py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-emerald-500/30 text-xs text-emerald-300 font-medium flex items-center justify-between transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                Sign in as Sarah (Attendee A)
              </span>
              <span className="text-[10px] font-mono text-zinc-500">Live RSVP</span>
            </button>

            <button
              onClick={() => handleQuickLogin('ATTENDEE_B')}
              className="w-full py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-amber-500/30 text-xs text-amber-300 font-medium flex items-center justify-between transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                Sign in as Marcus (Attendee B)
              </span>
              <span className="text-[10px] font-mono text-zinc-500">Contest Seat</span>
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-zinc-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-400 hover:underline font-semibold">
            Create an account
          </Link>
        </div>

      </div>
    </div>
  );
}
