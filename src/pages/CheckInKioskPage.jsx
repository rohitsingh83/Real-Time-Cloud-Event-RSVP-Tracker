import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, QrCode, CheckCircle, Users, ShieldCheck } from 'lucide-react';
import { getEvents } from '../services/eventService';
import { useLiveRSVPStats } from '../hooks/useLiveRSVPStats';
import CheckInScanner from '../components/organizer/CheckInScanner';

export default function CheckInKioskPage() {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [recentCheckIns, setRecentCheckIns] = useState([]);

  useEffect(() => {
    getEvents().then((list) => {
      setEvents(list);
      if (list.length > 0) setSelectedEventId(list[0].eventId);
    });
  }, []);

  const activeEvent = events.find(e => e.eventId === selectedEventId) || events[0];
  const stats = useLiveRSVPStats(selectedEventId, activeEvent?.capacity || 100);

  const handleCheckInComplete = (attendee) => {
    setRecentCheckIns((prev) => [
      {
        ...attendee,
        checkInTime: new Date().toLocaleTimeString(),
      },
      ...prev.slice(0, 4),
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 pb-20">
      
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Command Center</span>
        </Link>

        {events.length > 0 && (
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="bg-zinc-900 border border-zinc-700/80 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none font-semibold"
          >
            {events.map((e) => (
              <option key={e.eventId} value={e.eventId}>
                {e.title}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Hero Overview */}
      <div className="glass-panel p-6 rounded-3xl border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest block">
            On-Site Venue Terminal
          </span>
          <h1 className="text-2xl font-extrabold text-white mt-0.5">
            {activeEvent?.title || 'Event Check-In Kiosk'}
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time badge validation and QR ticket scanner for door staff.
          </p>
        </div>

        {/* Headcount Stat Pill */}
        <div className="glass-pill px-4 py-2.5 rounded-2xl border border-emerald-500/30 flex items-center gap-3 shrink-0">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-zinc-400">Checked In</span>
            <p className="text-lg font-extrabold text-emerald-400 font-mono leading-none">
              {stats.checkedIn} / {stats.going}
            </p>
          </div>
        </div>
      </div>

      {/* The Scanner Terminal */}
      <CheckInScanner
        eventId={selectedEventId}
        onCheckInComplete={handleCheckInComplete}
      />

      {/* Recent Check-Ins Activity Stream */}
      {recentCheckIns.length > 0 && (
        <div className="glass-panel p-6 rounded-3xl border border-zinc-800 space-y-3">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Recent Gate Check-Ins</span>
          </h3>

          <div className="divide-y divide-zinc-800/60 text-xs">
            {recentCheckIns.map((person, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={person.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                    alt={person.userName}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <div>
                    <span className="font-semibold text-white">{person.userName}</span>
                    <span className="text-zinc-400 text-[11px] ml-2 font-mono">
                      (Token: {person.token})
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px] text-emerald-400">
                  <span>Badge +{person.guestsCount || 0}</span>
                  <span className="text-zinc-500">•</span>
                  <span>{person.checkInTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
