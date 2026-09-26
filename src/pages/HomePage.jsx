import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Calendar, Search, Filter, ShieldCheck, Radio, ArrowRight, Zap } from 'lucide-react';
import { getEvents } from '../services/eventService';
import EventCard from '../components/event/EventCard';
import { EVENT_CATEGORIES } from '../config/constants';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const { isOrganizer } = useAuth();

  useEffect(() => {
    getEvents().then((data) => {
      setEvents(data);
      setLoading(false);
    });
  }, []);

  const filteredEvents = events.filter((e) => {
    const matchesSearch = (e.title || '').toLowerCase().includes(search.toLowerCase()) ||
                          (e.description || '').toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || e.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen space-y-16 pb-20">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 overflow-hidden">
        
        {/* Ambient Gradient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-violet-500/20 to-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-700/80 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-mono font-medium text-zinc-300">
              Zero-Latency Cloud RSVP Synchronization
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Plan, Invite, and Track RSVPs <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">
              in Genuine Real-Time
            </span>
          </h1>

          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Eliminate spreadsheets and WhatsApp chaos. Powered by distributed cloud transactions, atomic capacity locking, live WebSocket updates, and frictionless QR check-ins.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {isOrganizer ? (
              <Link
                to="/create-event"
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/30 flex items-center gap-2 transition-all hover:scale-105"
              >
                <Sparkles className="w-4 h-4" />
                <span>Create New Event</span>
              </Link>
            ) : null}

            <Link
              to="/dashboard"
              className="px-6 py-3 rounded-xl bg-zinc-800/90 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 font-semibold text-sm flex items-center gap-2 transition-all"
            >
              <span>Live Organizer Dashboard</span>
              <ArrowRight className="w-4 h-4 text-indigo-400" />
            </Link>
          </div>

          {/* Quick Technical Highlights Bar */}
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-left">
              <span className="text-xs font-mono text-indigo-400 font-bold block">100% Free Tier</span>
              <span className="text-[11px] text-zinc-400">Firebase & Vercel deployable</span>
            </div>
            <div className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-left">
              <span className="text-xs font-mono text-emerald-400 font-bold block">ACID Safe</span>
              <span className="text-[11px] text-zinc-400">Atomic capacity transactions</span>
            </div>
            <div className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-left">
              <span className="text-xs font-mono text-amber-400 font-bold block">FIFO Waitlist</span>
              <span className="text-[11px] text-zinc-400">Automatic promotion on cancel</span>
            </div>
            <div className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-left">
              <span className="text-xs font-mono text-violet-400 font-bold block">QR Verification</span>
              <span className="text-[11px] text-zinc-400">Contactless venue check-in</span>
            </div>
          </div>

        </div>
      </section>

      {/* Events Directory */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Search & Filter Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
          <div>
            <h2 className="text-xl font-bold text-white">Upcoming Cloud Events</h2>
            <p className="text-xs text-zinc-400">Live capacity counts stream automatically without page reload</p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-700/80 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-zinc-900 border border-zinc-700/80 text-xs text-zinc-200 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
              >
                <option value="ALL">All Categories</option>
                {EVENT_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-zinc-900/60 animate-pulse border border-zinc-800"></div>
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="py-20 text-center space-y-3 glass-panel rounded-3xl border border-zinc-800">
            <Calendar className="w-10 h-10 text-zinc-500 mx-auto" />
            <h3 className="text-base font-semibold text-white">No Events Found</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Try adjusting your search filters or create a new event as Organizer.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((evt) => (
              <EventCard key={evt.eventId} event={evt} />
            ))}
          </div>
        )}

      </section>

    </div>
  );
}
