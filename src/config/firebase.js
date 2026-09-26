import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDemoKeyMockCloudProject12345678",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "cloud-rsvp-tracker.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "cloud-rsvp-tracker",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "cloud-rsvp-tracker.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1029384756",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1029384756:web:9876543210abcdef",
};

// Check if actual valid project ID is supplied
export const isConfigured = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY && 
  !import.meta.env.VITE_FIREBASE_API_KEY.includes('Dummy') &&
  !import.meta.env.VITE_FIREBASE_API_KEY.includes('Mock')
);

let app;
let auth;
let db;

try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.warn("Firebase initialization warning (fallback to simulated cloud layer):", error);
}

export const googleProvider = new GoogleAuthProvider();
export { app, auth, db };
