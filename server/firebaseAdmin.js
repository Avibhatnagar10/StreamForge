// /server/firebaseAdmin.config.js

import admin from "firebase-admin";
import serviceAccount from "./path-to-your-service-account-key.json"; // Download from Firebase Console

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "your-project-id.appspot.com", // Your storage bucket
  });
}

const db = admin.firestore();
const storage = admin.storage();

export { db, storage };
