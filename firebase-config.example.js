// firebase-config.example.js
// RENAME this file to firebase-config.js after adding your own Firebase config
// Get these values from your Firebase console -> Project settings -> General -> Your apps (Web)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
// Do not commit real secrets to public repos. For GitHub Pages, it's OK to use client config, but restrict server rules in Firestore.
// Initialize in forum.js when present.
