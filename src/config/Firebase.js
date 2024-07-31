import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

console.log(import.meta.env,'all environment variables');

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_API_URL,
  authDomain: import.meta.env.VITE_APP_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_APP_PROJECTID,
  storageBucket: import.meta.env.VITE_APP_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_APP_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_APP_APPID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Enable offline persistence
enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.error('Persistence failed: Multiple tabs open');
    } else if (err.code === 'unimplemented') {
      console.error('Persistence is not available');
    }
  });

// Initialize Storage
const storage = getStorage(app);

export { app, db, storage };
