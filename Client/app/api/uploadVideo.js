// /client/pages/api/uploadVideo.js

import { uploadVideoToFirebase } from '../../../server/videoUpload';
import { saveVideoMetadata } from '../../../server/metadataHandler';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { filePath, destination, userId } = req.body;

    try {
      // Upload video to Firebase Storage
      const videoUrl = await uploadVideoToFirebase(filePath, destination);
      
      // Save metadata in Firestore
      const metadataId = await saveVideoMetadata(videoUrl, userId);

      res.status(200).json({ success: true, videoUrl, metadataId });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
