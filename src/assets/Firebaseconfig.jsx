import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";      // 🔥 Firestore
import { getAuth } from "firebase/auth";                // 🔐 Auth (si besoin)
import { getStorage } from "firebase/storage";          // 📦 Storage (si besoin)

const firebaseConfig = {
  apiKey: "AIzaSyCIhWFEi95EkB9gFin418B5RDDecUiO0sg",
  authDomain: "netflux-51a79.firebaseapp.com",
  projectId: "netflux-51a79",
  storageBucket: "netflux-51a79.appspot.com", 
  messagingSenderId: "883440937882",
  appId: "1:883440937882:web:90a3cdc1783817799fa823"
};

// Init Firebase
const app = initializeApp(firebaseConfig);

// Init services
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Export
export { db, auth, storage };