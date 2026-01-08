// lib/firebase.js
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // 1. On importe le module Auth

const firebaseConfig = {
  apiKey: "AIzaSyBqgItuHnWB_CUc4go4SI-EpOtsvbGEXO0",
  authDomain: "service-auto-angre.firebaseapp.com",
  projectId: "service-auto-angre",
  storageBucket: "service-auto-angre.firebasestorage.app",
  messagingSenderId: "258771440362",
  appId: "1:258771440362:web:33109dfa4fd44db8463d93",
  measurementId: "G-BEC18FLXZZ"
};

// Initialisation de l'App (évite les doublons)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// 2. On initialise les services
const db = getFirestore(app);
const auth = getAuth(app); // 3. On crée l'instance auth

// 4. On EXPORTE les deux pour que les pages puissent les utiliser
export { db, auth };