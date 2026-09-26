import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Calendar, MapPin, CheckCircle, HelpCircle, XCircle, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getEventById } from '../services/eventService';
import { submitRSVPWithTransaction } from '../services/rsvpService';
import { RSVP_STATUS } from '../config/constants';
import CapacityBar from '../components/event/CapacityBar';

export default function TokenRSVPPage() {
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get('e');
  const token = searchParams.get('t');

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestsCount, setGuestsCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [statusResult, setStatusResult] = useState(null);

  useEffect(() => {
    if (eventId) {
      getEventById(eventId)
        .then((data) => setEvent(data))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [eventId]);

  const handleGuestRSVP = async (choice) => {
    if (!guestName.trim()) {
      alert('Please enter your name to confirm your RSVP.');
      return;
    }

    setSubmitting(true);
    try {
      const syntheticGuest = {
        uid: `token-guest-${token || Math.random().toString(36).substring(2, 8)}`,
        displayName: guestName,
        email: guestEmail || `${guestName.toLowerCase().replace(/\s+/g, '')}@guest.dev`,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      };

      const res = await submitRSVPWithTransaction({
        eventId,
        user: syntheticGuest,
        newStatus: choice,
        guestsCount: choice === RSVP_STATUS.GOING ? guestsCount : 0,
        token: token || 'INVITE-LINK',
      });

      if (choice === RSVP_STATUS.GOING) {
        confetti({ particleCount: 90, spread: 80, origin: { y: 0.7 } });
      }

      setStatusResult(res);
    } catch (err) {
      alert(err.message || 'Error recording RSVP');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <h2 className="text-xl font-bold text-white">Invalid Invitation Link</h2>
        <p className="text-xs text-zinc-400">The event or token is invalid or has expired.</p>
        <Link to="/" className="px-4 py-2 bg-indigo-600 rounded-xl text-xs font-semibold text-white">
          Explore Other Events
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-zinc-700/80 shadow-2xl space-y-6">
        
        {/* Event Header */}
        <div className="space-y-2 border-b border-zinc-800 pb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>VIP Invitation Pass</span>
          </div>

          <h2 className="text-2xl font-extrabold text-white">{event.title}</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">{event.description}</p>

          <div className="pt-2 flex items-center gap-4 text-xs text-zinc-300">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              {event.eventDate} ({event.startTime})
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              {event.isVirtual ? 'Virtual' : event.venue}
            </span>
          </div>
        </div>

        {/* Live Capacity Bar */}
        <CapacityBar currentGoing={event.currentGoing} capacity={event.capacity} />

        {/* RSVP Outcome Confirmation */}
        {statusResult ? (
          <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-700 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">Your RSVP is Recorded!</h3>
            <p className="text-xs text-zinc-400">
              Response recorded as: <strong className="text-emerald-400 font-mono">{statusResult.finalStatus}</strong>
            </p>
            {statusResult.rsvp?.token && (
              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 font-mono text-xs text-zinc-300">
                Ticket Access Token: <strong className="text-white">{statusResult.rsvp.token}</strong>
              </div>
            )}
            <Link
              to={`/event/${eventId}`}
              className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 mt-2"
            >
              <span>View Full Event Page</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            
            {/* Guest Details Input */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700/80 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">Your Email (for ticket pass & updates)</label>
                <input
                  type="email"
                  placeholder="e.g. alex@example.com"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700/80 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">Bringing Additional Guests (+1s)</label>
                <select
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(parseInt(e.target.value, 10))}
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700/80 rounded-xl text-xs text-white focus:outline-none font-mono"
                >
                  <option value={0}>Just me</option>
                  <option value={1}>+1 Guest</option>
                  <option value={2}>+2 Guests</option>
                  <option value={3}>+3 Guests</option>
                </select>
              </div>
            </div>

            {/* Quick RSVP Action Buttons */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              <button
                type="button"
                disabled={submitting}
                onClick={() => handleGuestRSVP(RSVP_STATUS.GOING)}
                className="py-3 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex flex-col items-center gap-1 transition-all shadow-lg shadow-emerald-600/30"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Going</span>
              </button>

              <button
                type="button"
                disabled={submitting}
                onClick={() => handleGuestRSVP(RSVP_STATUS.MAYBE)}
                className="py-3 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex flex-col items-center gap-1 transition-all shadow-lg shadow-amber-600/30"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Maybe</span>
              </button>

              <button
                type="button"
                disabled={submitting}
                onClick={() => handleGuestRSVP(RSVP_STATUS.NOT_GOING)}
                className="py-3 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs flex flex-col items-center gap-1 transition-all border border-zinc-700"
              >
                <XCircle className="w-4 h-4" />
                <span>Can't Go</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
