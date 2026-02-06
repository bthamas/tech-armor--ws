import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyA3yqDcBjrud7liFr_PdYFtb5_khX7NkPg",
    authDomain: "egyedi-ws.firebaseapp.com",
    projectId: "egyedi-ws",
    storageBucket: "egyedi-ws.firebasestorage.app",
    messagingSenderId: "693161953526",
    appId: "1:693161953526:web:32b302b02d54450688c4d7"
};

// Singleton pattern for Next.js (avoids re-initialization on hot reload)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
