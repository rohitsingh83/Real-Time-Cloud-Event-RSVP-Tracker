import { useState, useEffect, useMemo } from 'react';
import { subscribeToEventRSVPs } from '../services/rsvpService';
import { RSVP_STATUS } from '../config/constants';

/**
 * Custom React hook subscribing to live RSVP collections and computing live metrics
 */
export function useLiveRSVPStats(eventId, capacity = 100, currentUserId = null) {
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToEventRSVPs(eventId, (list) => {
      setRsvps(list);
      setLoading(false);
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [eventId]);

  const stats = useMemo(() => {
    let going = 0;
    let maybe = 0;
    let notGoing = 0;
    let waitlist = 0;
    let checkedIn = 0;
    let totalPlusOnes = 0;

    rsvps.forEach((r) => {
      const guests = r.guestsCount || 0;
      if (r.status === RSVP_STATUS.GOING) {
        going += 1 + guests;
        totalPlusOnes += guests;
        if (r.checkInStatus) checkedIn += 1;
      } else if (r.status === RSVP_STATUS.MAYBE) {
        maybe += 1;
      } else if (r.status === RSVP_STATUS.NOT_GOING) {
        notGoing += 1;
      } else if (r.status === RSVP_STATUS.WAITLISTED) {
        waitlist += 1;
      }
    });

    const cap = Math.max(1, capacity);
    const available = Math.max(0, cap - going);
    const utilizationPct = Math.min(100, Math.round((going / cap) * 100));
    const totalResponses = rsvps.length;

    const myRSVP = currentUserId ? rsvps.find(r => r.userId === currentUserId) || null : null;

    return {
      going,
      maybe,
      notGoing,
      waitlist,
      checkedIn,
      totalPlusOnes,
      totalResponses,
      available,
      utilizationPct,
      myRSVP,
      rsvps
    };
  }, [rsvps, capacity, currentUserId]);

  return { ...stats, loading };
}
