import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Check, HelpCircle, X, Sparkles, UserPlus, AlertCircle, Loader2 } from 'lucide-react';
import { RSVP_STATUS } from '../../config/constants';
import { submitRSVPWithTransaction } from '../../services/rsvpService';
import { useAuth } from '../../context/AuthContext';

export default function RSVPActionBar({ event, myRSVP, onRSVPUpdated }) {
  const { currentUser } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [guestsCount, setGuestsCount] = useState(myRSVP?.guestsCount || 0);
  const [feedback, setFeedback] = useState(null);

  const activeStatus = myRSVP?.status || null;
  const isCapacityFull = (event?.currentGoing || 0) >= (event?.capacity || 100);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.8 },
        colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899'],
      });
    } catch (err) {
      console.log('Confetti effect:', err);
    }
  };

  const handleRSVP = async (targetStatus) => {
    if (!currentUser) {
      setFeedback({ type: 'error', message: 'Please sign in or select a demo user to RSVP.' });
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await submitRSVPWithTransaction({
        eventId: event.eventId,
        user: currentUser,
        newStatus: targetStatus,
        guestsCount: targetStatus === RSVP_STATUS.GOING ? guestsCount : 0,
        token: myRSVP?.token || null,
      });

      if (targetStatus === RSVP_STATUS.GOING) {
        triggerConfetti();
      }

      if (res.waitlistMessage) {
        setFeedback({ type: 'warning', message: res.waitlistMessage });
      } else {
        setFeedback({ 
          type: 'success', 
          message: `RSVP updated to ${res.finalStatus}! Cloud state synchronized.` 
        });
      }

      if (onRSVPUpdated) onRSVPUpdated(res);
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to update RSVP.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-3">
      {/* Toast Notification */}
      {feedback && (
        <div className={`p-3 rounded-xl text-xs flex items-center justify-between border ${
          feedback.type === 'success' 
            ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200' 
            : feedback.type === 'warning'
            ? 'bg-amber-950/80 border-amber-500/40 text-amber-200'
            : 'bg-rose-950/80 border-rose-500/40 text-rose-200'
        }`}>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-zinc-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Action Controls */}
      <div className="p-3 rounded-2xl glass-panel-elevated border border-zinc-700/80 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Plus-ones selector for GOING */}
        <div className="flex items-center gap-2 text-xs text-zinc-300 w-full sm:w-auto justify-between sm:justify-start">
          <span className="flex items-center gap-1.5 font-medium">
            <UserPlus className="w-4 h-4 text-indigo-400" />
            Bringing Guests (+1s):
          </span>
          <select
            value={guestsCount}
            onChange={(e) => setGuestsCount(parseInt(e.target.value, 10))}
            disabled={submitting}
            className="bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
          >
            <option value={0}>Just me</option>
            <option value={1}>+1 Guest</option>
            <option value={2}>+2 Guests</option>
            <option value={3}>+3 Guests</option>
          </select>
        </div>

        {/* The 3 RSVP State Buttons */}
        <div className="grid grid-cols-3 gap-2 w-full sm:w-auto">
          
          {/* GOING BUTTON */}
          <button
            onClick={() => handleRSVP(RSVP_STATUS.GOING)}
            disabled={submitting}
            className={`px-4 py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all duration-200 ${
              activeStatus === RSVP_STATUS.GOING
                ? 'bg-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-400 font-bold scale-[1.02]'
                : activeStatus === RSVP_STATUS.WAITLISTED
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-zinc-800/90 text-zinc-200 hover:bg-emerald-600 hover:text-white border border-zinc-700'
            }`}
          >
            {submitting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : activeStatus === RSVP_STATUS.GOING ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Going</span>
              </>
            ) : activeStatus === RSVP_STATUS.WAITLISTED ? (
              <span>Waitlisted</span>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isCapacityFull ? 'Waitlist' : 'Going'}</span>
              </>
            )}
          </button>

          {/* MAYBE BUTTON */}
          <button
            onClick={() => handleRSVP(RSVP_STATUS.MAYBE)}
            disabled={submitting}
            className={`px-4 py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all duration-200 ${
              activeStatus === RSVP_STATUS.MAYBE
                ? 'bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/30 ring-2 ring-amber-400 font-bold scale-[1.02]'
                : 'bg-zinc-800/90 text-zinc-200 hover:bg-amber-600/80 hover:text-white border border-zinc-700'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Maybe</span>
          </button>

          {/* NOT GOING BUTTON */}
          <button
            onClick={() => handleRSVP(RSVP_STATUS.NOT_GOING)}
            disabled={submitting}
            className={`px-4 py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all duration-200 ${
              activeStatus === RSVP_STATUS.NOT_GOING
                ? 'bg-zinc-200 text-zinc-950 shadow-md ring-2 ring-white font-bold'
                : 'bg-zinc-800/90 text-zinc-400 hover:bg-zinc-700 hover:text-white border border-zinc-700'
            }`}
          >
            <X className="w-3.5 h-3.5" />
            <span>Can't Go</span>
          </button>

        </div>
      </div>
    </div>
  );
}
