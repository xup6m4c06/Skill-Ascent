
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfigValues = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const requiredKeys: (keyof typeof firebaseConfigValues)[] = ['apiKey', 'authDomain', 'projectId'];
let allRequiredKeysPresent = true;
const missingOrEmptyKeys: string[] = [];

for (const key of requiredKeys) {
  const value = firebaseConfigValues[key];
  if (!value || typeof value !== 'string' || value.trim() === "") {
    allRequiredKeysPresent = false;
    // Construct the expected .env variable name
    let envVarName = 'NEXT_PUBLIC_FIREBASE_';
    if (key === 'apiKey') envVarName += 'API_KEY';
    else if (key === 'authDomain') envVarName += 'AUTH_DOMAIN';
    else if (key === 'projectId') envVarName += 'PROJECT_ID';
    // Add other keys if they become strictly required for initialization
    missingOrEmptyKeys.push(envVarName);
  }
}

if (!allRequiredKeysPresent) {
  console.error(
    "Firebase configuration is incomplete. " +
    "The following critical environment variables are missing or empty in your .env file: " +
    missingOrEmptyKeys.join(', ') + ". " +
    "Please ensure these NEXT_PUBLIC_FIREBASE_... variables are correctly set " +
    "with the credentials from your Firebase project console. " +
    "The app will not function correctly without these."
  );
}

// Initialize Firebase only if all critical keys are present and seem valid
const app = allRequiredKeysPresent
  ? (!getApps().length ? initializeApp(firebaseConfigValues) : getApp())
  : null;

// Conditionally initialize Auth and Firestore if app was initialized
const auth = app ? getAuth(app) : null;
const db = app ? getFirestore(app) : null;

if (allRequiredKeysPresent && app && !auth) {
    // This case might occur if initializeApp succeeded with the provided config,
    // but getAuth(app) failed, which could lead to "auth/configuration-not-found".
    // This suggests the values, though present, might be incorrect for auth services.
    console.warn(
        "Firebase app was initialized, but Firebase Auth could not be. " +
        "This often means that while basic config keys (apiKey, authDomain, projectId) " +
        "were present, one of them might be incorrect or not recognized by Firebase Authentication. " +
        "Please double-check these values in your .env file against your Firebase project settings."
    );
}


export { app, auth, db };

