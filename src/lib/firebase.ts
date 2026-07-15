import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDoSn4fXnr8jQt05IHop3mNcrwZhC0znh4",
  authDomain: "abhash-c842c.firebaseapp.com",
  projectId: "abhash-c842c",
  storageBucket: "abhash-c842c.firebasestorage.app",
  messagingSenderId: "410369770703",
  appId: "1:410369770703:web:52219a09131191eb6a23ba",
  measurementId: "G-S34TBVPFVV"
};

// Initialize Firebase only if it hasn't been initialized yet
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore & Storage
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
