// firebase.js
import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  initializeFirestore 
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import {
  VITE_APIKEY,
  VITE_APPID,
  VITE_AUTHDOMAIN,
  VITE_MEASUREMENTID,
  VITE_MESSAGINGSENDERID,
  VITE_PROJECTID,
  VITE_STORAGEBUCKET
} from "@env";

// --- Optional sanity check ---
if (
  !VITE_APIKEY ||
  !VITE_APPID ||
  !VITE_AUTHDOMAIN ||
  !VITE_PROJECTID ||
  !VITE_STORAGEBUCKET
) {
  console.warn(
    "⚠️ Missing one or more Firebase environment variables. Check your .env file and babel.config.js setup."
  );
}

const firebaseConfig = {
  apiKey: VITE_APIKEY,
  authDomain: VITE_AUTHDOMAIN,
  projectId: VITE_PROJECTID,
  storageBucket: VITE_STORAGEBUCKET,
  messagingSenderId: VITE_MESSAGINGSENDERID,
  appId: VITE_APPID,
  measurementId: VITE_MEASUREMENTID,
};

// --- Initialize Firebase ---
const app = initializeApp(firebaseConfig);

// --- Fix: Firestore mobile long-polling mode for RN ---
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false,
});

// --- Auth and Storage ---
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
