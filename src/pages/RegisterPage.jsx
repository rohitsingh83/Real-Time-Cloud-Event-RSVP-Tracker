import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Shield, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { USER_ROLES } from '../config/constants';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(USER_ROLES.ATTENDEE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(email, password, displayName, role);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md glass-panel-elevated rounded-3xl p-8 border border-zinc-700/80 shadow-2xl space-y-6">
        
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mx-auto mb-2">
            <UserPlus className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Create Cloud Account</h2>
          <p className="text-xs text-zinc-400">Join CloudRSVP to organize events or manage your attendance</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/60 border border-rose-500/40 rounded-xl text-xs text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Jordan Smith"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700/80 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

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

          {/* Account Role Radio */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-2">Account Role</label>
            <div className="grid grid-cols-2 gap-3">
              <label className={`p-3 rounded-xl border flex flex-col items-center gap-1 cursor-pointer transition-all ${
                role === USER_ROLES.ATTENDEE 
                  ? 'bg-indigo-600/10 border-indigo-500 text-white' 
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400'
              }`}>
                <input
                  type="radio"
                  name="role"
                  value={USER_ROLES.ATTENDEE}
                  checked={role === USER_ROLES.ATTENDEE}
                  onChange={() => setRole(USER_ROLES.ATTENDEE)}
                  className="sr-only"
                />
                <User className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-semibold">Attendee</span>
                <span className="text-[10px] text-zinc-500 text-center">RSVP & explore</span>
              </label>

              <label className={`p-3 rounded-xl border flex flex-col items-center gap-1 cursor-pointer transition-all ${
                role === USER_ROLES.ORGANIZER 
                  ? 'bg-indigo-600/10 border-indigo-500 text-white' 
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400'
              }`}>
                <input
                  type="radio"
                  name="role"
                  value={USER_ROLES.ORGANIZER}
                  checked={role === USER_ROLES.ORGANIZER}
                  onChange={() => setRole(USER_ROLES.ORGANIZER)}
                  className="sr-only"
                />
                <Shield className="w-4 h-4 text-violet-400" />
                <span className="text-xs font-semibold">Organizer</span>
                <span className="text-[10px] text-zinc-500 text-center">Host & manage</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-colors shadow-lg shadow-indigo-600/30"
          >
            {loading ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>

        <div className="text-center text-xs text-zinc-400">
          Already registered?{' '}
          <Link to="/login" className="text-indigo-400 hover:underline font-semibold">
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
}
