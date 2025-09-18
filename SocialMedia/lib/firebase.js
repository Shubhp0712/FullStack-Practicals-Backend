// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC72xLjQ0EfQfEoG6clrSy5ttzd4Kck3vA",
  authDomain: "socialmedia-198d4.firebaseapp.com",
  projectId: "socialmedia-198d4",
  storageBucket: "socialmedia-198d4.firebasestorage.app",
  messagingSenderId: "695409960314",
  appId: "1:695409960314:web:12544d1d8d9145759922c3",
  measurementId: "G-2S915SKLX3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics (only on client side)
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}
export { analytics };

// Auth providers
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Auth functions
export const signInWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};
export const logOut = () => signOut(auth);

export default app;
