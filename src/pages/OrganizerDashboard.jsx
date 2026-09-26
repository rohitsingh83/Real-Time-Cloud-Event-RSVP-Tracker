import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Megaphone, QrCode, PlusCircle, 
  ExternalLink, Share2, Radio, RefreshCw 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getEvents } from '../services/eventService';
import { useLiveRSVPStats } from '../hooks/useLiveRSVPStats';
import LiveCounterBadge from '../components/organizer/LiveCounterBadge';
import AnalyticsCharts from '../components/organizer/AnalyticsCharts';
import GuestListTable from '../components/organizer/GuestListTable';
import BroadcastModal from '../components/organizer/BroadcastModal';
import ShareModal from '../components/event/ShareModal';
import { useAuth } from '../context/AuthContext';

export default function OrganizerDashboard() {
  const { currentUser } = useAuth();
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [broadcastOpen, setBroadcastOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    getEvents().then((list) => {
      setEvents(list);
      if (list.length > 0 && !selectedEventId) {
        setSelectedEventId(list[0].eventId);
      }
    });
  }, [refreshKey]);

  const activeEvent = events.find(e => e.eventId === selectedEventId) || events[0] || null;
  const stats = useLiveRSVPStats(selectedEventId, activeEvent?.capacity || 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      
      {/* Top Header & Event Switcher */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold text-white">Organizer Command Center</h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time telemetry, concurrent attendance counters, and live venue check-in controls.
          </p>
        </div>

        {/* Event Select Dropdown & Actions */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {events.length > 0 && (
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="bg-zinc-900 border border-zinc-700/80 rounded-xl px-3.5 py-2 text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
            >
              {events.map(ev => (
                <option key={ev.eventId} value={ev.eventId}>
                  {ev.title} ({ev.currentGoing}/{ev.capacity})
                </option>
              ))}
            </select>
          )}

          <button
            onClick={() => setBroadcastOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-indigo-600/20"
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>Broadcast</span>
          </button>

          <button
            onClick={() => setShareOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>QR & Invite</span>
          </button>

          <Link
            to="/kiosk"
            className="px-3.5 py-2 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-emerald-600/20"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Door Kiosk</span>
          </Link>

          {activeEvent && (
            <Link
              to={`/event/${activeEvent.eventId}`}
              target="_blank"
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white border border-zinc-700 transition-colors"
              title="View Public Landing Page"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>

      {/* Live Counter Telemetry Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <LiveCounterBadge
          label="Going (Headcount)"
          value={stats.going}
          subtext={`/ ${activeEvent?.capacity || 100}`}
          color="emerald"
        />

        <LiveCounterBadge
          label="Maybe"
          value={stats.maybe}
          color="amber"
        />

        <LiveCounterBadge
          label="Waitlisted"
          value={stats.waitlist}
          color="rose"
        />

        <LiveCounterBadge
          label="Can't Go"
          value={stats.notGoing}
          color="indigo"
        />

        <LiveCounterBadge
          label="Checked In"
          value={stats.checkedIn}
          subtext={`of ${stats.going}`}
          color="emerald"
        />

        <LiveCounterBadge
          label="Capacity Fill"
          value={`${stats.utilizationPct}%`}
          subtext={`${stats.available} left`}
          color="indigo"
        />
      </div>

      {/* Analytics Charts & AI Turnout Prediction */}
      <AnalyticsCharts
        event={activeEvent}
        stats={stats}
      />

      {/* Guest Management Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Live Attendee Ledger</h3>
          <span className="text-xs text-zinc-400 font-mono">
            {stats.rsvps.length} Total Registered Records
          </span>
        </div>

        <GuestListTable
          eventId={selectedEventId}
          rsvps={stats.rsvps}
          onListRefresh={() => setRefreshKey(k => k + 1)}
        />
      </div>

      {/* Modals */}
      <BroadcastModal
        eventId={selectedEventId}
        isOpen={broadcastOpen}
        onClose={() => setBroadcastOpen(false)}
        onBroadcastSuccess={() => setRefreshKey(k => k + 1)}
      />

      <ShareModal
        event={activeEvent}
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
      />

    </div>
  );
}
