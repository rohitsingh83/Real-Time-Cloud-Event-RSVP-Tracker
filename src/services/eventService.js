import { 
  collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, 
  query, where, orderBy, onSnapshot, serverTimestamp 
} from 'firebase/firestore';
import { db, isConfigured } from '../config/firebase';
import { EVENT_STATUS } from '../config/constants';

// BroadcastChannel for instant cross-tab real-time sync in local/demo environment
const eventChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window 
  ? new BroadcastChannel('cloud_rsvp_event_channel') 
  : null;

// Initial seed mock events for instant testing and presentation
const SEED_EVENTS = [
  {
    eventId: 'evt-cloud-summit-2026',
    organizerId: 'demo-org-101',
    organizerName: 'Alex Rivers',
    title: 'Cloud Native & Distributed Systems Summit 2026',
    description: 'Join cloud architects, SREs, and engineers to dive deep into serverless patterns, edge compute, high availability databases, and real-time event streaming.',
    category: 'Conference',
    bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
    eventDate: '2026-10-15',
    startTime: '10:00',
    endTime: '17:30',
    venue: 'Moscone Center, Tech Hall B & Virtual Stage',
    isVirtual: false,
    meetingLink: '',
    capacity: 50,
    currentGoing: 48,
    currentMaybe: 12,
    registrationDeadline: '2026-10-14T23:59',
    status: EVENT_STATUS.PUBLISHED,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    eventId: 'evt-ai-workshop-2026',
    organizerId: 'demo-org-101',
    organizerName: 'Alex Rivers',
    title: 'Hands-on Generative AI & Event-Driven Microservices',
    description: 'Intensive workshop building real-time AI agents, streaming vector pipelines, and reactive event-driven backends with zero latency.',
    category: 'Tech & AI',
    bannerUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&auto=format&fit=crop&q=80',
    eventDate: '2026-10-20',
    startTime: '14:00',
    endTime: '18:00',
    venue: 'Google Cloud Developer Space / YouTube Live',
    isVirtual: true,
    meetingLink: 'https://meet.google.com/xyz-demo-stream',
    capacity: 100,
    currentGoing: 32,
    currentMaybe: 8,
    registrationDeadline: '2026-10-19T23:59',
    status: EVENT_STATUS.PUBLISHED,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

// Helper to get local storage store
const getLocalStore = (key, defaultVal) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultVal;
  } catch {
    return defaultVal;
  }
};

const setLocalStore = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
    if (eventChannel) eventChannel.postMessage({ type: 'STORE_UPDATED', key });
  } catch (err) {
    console.error('Storage error:', err);
  }
};

// Initialize seed data if empty
if (typeof window !== 'undefined') {
  const existing = getLocalStore('cloud_events', null);
  if (!existing || existing.length === 0) {
    setLocalStore('cloud_events', SEED_EVENTS);
  }
}

/**
 * Create a new event
 */
export async function createEvent(eventData, user) {
  const eventId = `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const newEvent = {
    ...eventData,
    eventId,
    organizerId: user?.uid || 'demo-org-101',
    organizerName: user?.displayName || 'Event Host',
    currentGoing: 0,
    currentMaybe: 0,
    status: eventData.status || EVENT_STATUS.PUBLISHED,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (isConfigured && db) {
    try {
      await setDoc(doc(db, 'events', eventId), {
        ...newEvent,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return newEvent;
    } catch (err) {
      console.warn('Firestore write failed, falling back to local cloud store:', err);
    }
  }

  const events = getLocalStore('cloud_events', []);
  events.unshift(newEvent);
  setLocalStore('cloud_events', events);
  return newEvent;
}

/**
 * Get all published events
 */
export async function getEvents() {
  if (isConfigured && db) {
    try {
      const q = query(collection(db, 'events'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map(d => ({ eventId: d.id, ...d.data() }));
      }
    } catch (err) {
      console.warn('Firestore read error, using cache:', err);
    }
  }
  return getLocalStore('cloud_events', SEED_EVENTS);
}

/**
 * Get single event by ID
 */
export async function getEventById(eventId) {
  if (isConfigured && db) {
    try {
      const ref = doc(db, 'events', eventId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        return { eventId: snap.id, ...snap.data() };
      }
    } catch (err) {
      console.warn('Firestore fetch error:', err);
    }
  }
  const events = getLocalStore('cloud_events', SEED_EVENTS);
  return events.find(e => e.eventId === eventId) || null;
}

/**
 * Real-time event subscription (Cloud onSnapshot or multi-tab BroadcastChannel)
 */
export function subscribeToEvent(eventId, onUpdate) {
  if (isConfigured && db) {
    try {
      const unsub = onSnapshot(doc(db, 'events', eventId), (docSnap) => {
        if (docSnap.exists()) {
          onUpdate({ eventId: docSnap.id, ...docSnap.data() });
        }
      });
      return unsub;
    } catch (err) {
      console.warn('onSnapshot fallback:', err);
    }
  }

  // Cross-tab real-time listener fallback
  const handler = (evt) => {
    const events = getLocalStore('cloud_events', SEED_EVENTS);
    const target = events.find(e => e.eventId === eventId);
    if (target) onUpdate(target);
  };

  const initialEvents = getLocalStore('cloud_events', SEED_EVENTS);
  const found = initialEvents.find(e => e.eventId === eventId);
  if (found) onUpdate(found);

  if (eventChannel) {
    eventChannel.addEventListener('message', handler);
  }
  window.addEventListener('storage', handler);

  return () => {
    if (eventChannel) eventChannel.removeEventListener('message', handler);
    window.removeEventListener('storage', handler);
  };
}

/**
 * Update event details
 */
export async function updateEvent(eventId, updates) {
  if (isConfigured && db) {
    try {
      const ref = doc(db, 'events', eventId);
      await updateDoc(ref, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
      return true;
    } catch (err) {
      console.warn('Firestore update failed:', err);
    }
  }

  const events = getLocalStore('cloud_events', SEED_EVENTS);
  const idx = events.findIndex(e => e.eventId === eventId);
  if (idx !== -1) {
    events[idx] = { ...events[idx], ...updates, updatedAt: new Date().toISOString() };
    setLocalStore('cloud_events', events);
    return true;
  }
  return false;
}

/**
 * Cancel or Delete event
 */
export async function cancelEvent(eventId) {
  return updateEvent(eventId, { status: EVENT_STATUS.CANCELLED });
}
