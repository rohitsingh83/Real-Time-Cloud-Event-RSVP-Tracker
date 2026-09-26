import { useState, useEffect } from 'react';
import { subscribeToEvent, getEventById } from '../services/eventService';

/**
 * Custom React hook subscribing to a single event document in real-time
 */
export function useLiveEvent(eventId) {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!eventId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // Initial fetch
    getEventById(eventId)
      .then((data) => {
        if (data) setEvent(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

    // Real-time listener subscription
    const unsubscribe = subscribeToEvent(eventId, (updatedEvent) => {
      setEvent(updatedEvent);
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [eventId]);

  return { event, loading, error };
}
