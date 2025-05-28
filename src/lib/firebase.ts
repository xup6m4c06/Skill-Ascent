
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Check if the essential API key is present
if (!firebaseConfig.apiKey) {
  console.error(
    "Firebase API Key is missing. " +
    "Please ensure that NEXT_PUBLIC_FIREBASE_API_KEY (and other NEXT_PUBLIC_FIREBASE_... variables) " +
    "are set in your .env file with the credentials from your Firebase project console. " +
    "The app will not function correctly without these."
  );
}

// Initialize Firebase
// Check if all required config values are present before initializing
const app = 
  firebaseConfig.apiKey && 
  firebaseConfig.authDomain && 
  firebaseConfig.projectId 
    ? (!getApps().length ? initializeApp(firebaseConfig) : getApp()) 
    : null;

// Conditionally initialize Auth and Firestore if app was initialized
const auth = app ? getAuth(app) : null;
const db = app ? getFirestore(app) : null;

// If app couldn't be initialized, export nulls or throw an error,
// so the rest of the app knows Firebase isn't available.
// For now, auth and db could be null, and consuming code should handle this.
// A more robust solution might involve a global state or context to indicate Firebase readiness.

export { app, auth, db };
