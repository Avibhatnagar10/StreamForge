// /server/metadataHandler.js

import { db } from './firebaseAdmin.config.js';

export async function saveVideoMetadata(videoUrl, userId) {
  try {
    const docRef = await db.collection('videos').add({
      userId: userId,
      videoUrl: videoUrl,
      createdAt: new Date().toISOString(),
      status: 'scheduled',  // Or 'uploaded'
    });
    console.log('Video metadata saved with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving video metadata:', error);
    throw error;
  }
}
