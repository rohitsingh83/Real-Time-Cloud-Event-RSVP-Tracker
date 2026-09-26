import { collection, doc, setDoc, getDocs, onSnapshot, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db, isConfigured } from '../config/firebase';

const announcementChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel('cloud_announcement_channel')
  : null;

const SEED_ANNOUNCEMENTS = [
  {
    announcementId: 'ann-1',
    eventId: 'evt-cloud-summit-2026',
    title: 'Keynote Speaker Confirmed!',
    message: 'We are thrilled to announce that Dr. Jane Zhang will deliver the opening keynote on Planetary-Scale Databases.',
    priority: 'normal',
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
  },
  {
    announcementId: 'ann-2',
    eventId: 'evt-cloud-summit-2026',
    title: 'Venue Room Updated to Hall B',
    message: 'Due to overwhelming RSVP demand, we have upgraded to Tech Hall B. Parking passes are available in the lobby.',
    priority: 'urgent',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  }
];

const getLocalAnnouncements = () => {
  try {
    const raw = localStorage.getItem('cloud_announcements');
    return raw ? JSON.parse(raw) : SEED_ANNOUNCEMENTS;
  } catch {
    return SEED_ANNOUNCEMENTS;
  }
};

const setLocalAnnouncements = (ann) => {
  try {
    localStorage.setItem('cloud_announcements', JSON.stringify(ann));
    if (announcementChannel) announcementChannel.postMessage({ type: 'ANNOUNCEMENT_POSTED' });
  } catch (err) {
    console.error('Announcements storage error:', err);
  }
};

if (typeof window !== 'undefined' && !localStorage.getItem('cloud_announcements')) {
  setLocalAnnouncements(SEED_ANNOUNCEMENTS);
}

export async function broadcastAnnouncement(eventId, { title, message, priority = 'normal' }) {
  const announcementId = `ann-${Date.now()}`;
  const payload = {
    announcementId,
    eventId,
    title,
    message,
    priority,
    createdAt: new Date().toISOString(),
  };

  if (isConfigured && db) {
    try {
      const ref = doc(db, 'events', eventId, 'announcements', announcementId);
      await setDoc(ref, { ...payload, createdAt: serverTimestamp() });
      return payload;
    } catch (err) {
      console.warn('Firestore announcement error:', err);
    }
  }

  const list = getLocalAnnouncements();
  list.unshift(payload);
  setLocalAnnouncements(list);
  return payload;
}

export function subscribeToAnnouncements(eventId, callback) {
  if (isConfigured && db) {
    try {
      const q = query(collection(db, 'events', eventId, 'announcements'), orderBy('createdAt', 'desc'));
      return onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map(d => ({ announcementId: d.id, ...d.data() }));
        callback(items);
      });
    } catch (err) {
      console.warn('Firestore announcements listener error:', err);
    }
  }

  const handler = () => {
    const all = getLocalAnnouncements();
    callback(all.filter(a => a.eventId === eventId));
  };

  handler();

  if (announcementChannel) announcementChannel.addEventListener('message', handler);
  window.addEventListener('storage', handler);

  return () => {
    if (announcementChannel) announcementChannel.removeEventListener('message', handler);
    window.removeEventListener('storage', handler);
  };
}
