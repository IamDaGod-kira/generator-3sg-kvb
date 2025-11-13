// firebase.js
import Constants from 'expo-constants';
import { initializeApp } from 'firebase/app';
import { getFirestore, initializeFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const env = (Constants.expoConfig && Constants.expoConfig.extra) || {};

if (!env.VITE_APIKEY || !env.VITE_PROJECTID) {
  console.warn('Firebase env variables appear missing. Check .env and app.config.js');
}

const firebaseConfig = {
  apiKey: env.VITE_APIKEY,
  authDomain: env.VITE_AUTHDOMAIN,
  projectId: env.VITE_PROJECTID,
  storageBucket: env.VITE_STORAGEBUCKET,
  messagingSenderId: env.VITE_MESSAGINGSENDERID,
  appId: env.VITE_APPID,
  measurementId: env.VITE_MEASUREMENTID,
};

const app = initializeApp(firebaseConfig);

// Mobile Firestore fix for some network environments
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false,
});

const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
