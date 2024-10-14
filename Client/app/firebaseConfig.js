import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBmAsaKuBf6pAQAnX1gRAKGJag15ZIjuMI",
  authDomain: "streamforge-atw80.firebaseapp.com",
  projectId: "streamforge-atw80",
  storageBucket: "streamforge-atw80.appspot.com",
  messagingSenderId: "16132538424",
  appId: "1:16132538424:web:2f72ad6dc3809b34e8e6cd",
  measurementId: "G-ZHDGF5T7YQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

// Set the persistence to 'local' so the user remains signed in
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log('Persistence set to local. User will remain signed in.');
  })
  .catch((error) => {
    console.error('Error setting persistence:', error);
  });

export { auth, provider, db };
