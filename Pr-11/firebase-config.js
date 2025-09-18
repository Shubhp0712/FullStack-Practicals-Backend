// Firebase Configuration and Initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDnDIYJyi0YzIJ83skdm3QFVnWZHJuZcxU",
    authDomain: "social-media-app-d78de.firebaseapp.com",
    projectId: "social-media-app-d78de",
    storageBucket: "social-media-app-d78de.firebasestorage.app",
    messagingSenderId: "991225486140",
    appId: "1:991225486140:web:8aeaafc12924e67b53dc39",
    measurementId: "G-RXW8BBTVWG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Configure Google Provider
googleProvider.addScope('profile');
googleProvider.addScope('email');

// Initialize Analytics (optional)
let analytics = null;
try {
    analytics = getAnalytics(app);
} catch (error) {
    console.log('Analytics not available:', error);
}

export { analytics };

// Export the app for any additional usage
export default app;

console.log('Firebase initialized successfully');