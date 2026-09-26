import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Calendar, Sparkles, PlusCircle, LayoutDashboard, QrCode, 
  UserCheck, LogOut, ChevronDown, Radio, ShieldCheck 
} from 'lucide-react';

export default function Navbar() {
  const { currentUser, isOrganizer, logout, switchDemoRole } = useAuth();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-zinc-800/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Cloud Status */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                CloudRSVP
              </span>
              <div className="flex items-center gap-1.5 -mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400">
                  Cloud Sync Active
                </span>
              </div>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'bg-zinc-800 text-white' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
            >
              Explore Events
            </Link>

            {isOrganizer && (
              <>
                <Link
                  to="/create-event"
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/create-event') 
                      ? 'bg-zinc-800 text-white' 
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                  }`}
                >
                  <PlusCircle className="w-4 h-4 text-indigo-400" />
                  Create Event
                </Link>
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/dashboard') 
                      ? 'bg-zinc-800 text-white' 
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-violet-400" />
                  Command Center
                </Link>
                <Link
                  to="/kiosk"
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/kiosk') 
                      ? 'bg-zinc-800 text-white' 
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-emerald-400" />
                  Door Kiosk
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* Right Section: 1-Click Demo Persona Switcher & User Profile */}
        <div className="flex items-center gap-3">
          
          {/* Quick Demo Persona Dropdown for Examiners/Testing */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-700/80 hover:border-indigo-500/50 text-xs font-medium text-zinc-300 transition-all shadow-inner"
              title="Click to simulate multiple users in real-time"
            >
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              <span className="hidden sm:inline font-mono">Role:</span>
              <span className="font-semibold text-white truncate max-w-[120px]">
                {currentUser?.displayName || 'Guest'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            {roleMenuOpen && (
              <div 
                className="absolute right-0 mt-2 w-64 glass-panel-elevated rounded-2xl p-2 shadow-2xl z-50 border border-zinc-700"
                onClick={() => setRoleMenuOpen(false)}
              >
                <div className="px-3 py-2 border-b border-zinc-800">
                  <p className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                    Simulate Multi-User Roles
                  </p>
                  <p className="text-xs text-zinc-300 mt-0.5">
                    Test live real-time sync across multiple tabs
                  </p>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => switchDemoRole('ORGANIZER')}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between hover:bg-zinc-800/70 transition-colors"
                  >
                    <div>
                      <div className="font-medium text-white flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                        Alex Rivers
                      </div>
                      <div className="text-[11px] text-zinc-400">Host & Organizer (Admin)</div>
                    </div>
                    {isOrganizer && <span className="text-[10px] text-indigo-400 font-bold">ACTIVE</span>}
                  </button>

                  <button
                    onClick={() => switchDemoRole('ATTENDEE_A')}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between hover:bg-zinc-800/70 transition-colors"
                  >
                    <div>
                      <div className="font-medium text-white flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                        Sarah Chen
                      </div>
                      <div className="text-[11px] text-zinc-400">Attendee A (Student/Dev)</div>
                    </div>
                    {currentUser?.uid === 'demo-user-201' && <span className="text-[10px] text-emerald-400 font-bold">ACTIVE</span>}
                  </button>

                  <button
                    onClick={() => switchDemoRole('ATTENDEE_B')}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between hover:bg-zinc-800/70 transition-colors"
                  >
                    <div>
                      <div className="font-medium text-white flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                        Marcus Vance
                      </div>
                      <div className="text-[11px] text-zinc-400">Attendee B (Contested Seat)</div>
                    </div>
                    {currentUser?.uid === 'demo-user-202' && <span className="text-[10px] text-amber-400 font-bold">ACTIVE</span>}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Avatar & Logout */}
          <div className="flex items-center gap-2">
            <img 
              src={currentUser?.avatar || currentUser?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'} 
              alt={currentUser?.displayName} 
              className="w-9 h-9 rounded-full ring-2 ring-zinc-700 object-cover"
            />
            <button
              onClick={logout}
              title="Sign Out"
              className="p-2 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-zinc-800/50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
