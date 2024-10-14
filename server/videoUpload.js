// /server/videoUpload.js

import { storage } from './firebaseAdmin.config.js';

export async function uploadVideoToFirebase(filePath, destination) {
  const bucket = storage.bucket();
  
  try {
    await bucket.upload(filePath, {
      destination: `videos/${destination}`,
    });
    console.log(`File uploaded successfully to videos/${destination}`);
    
    // Get public URL of the uploaded video
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/videos/${destination}`;
    return publicUrl;
  } catch (error) {
    console.error('Error uploading video:', error);
    throw error;
  }
}
