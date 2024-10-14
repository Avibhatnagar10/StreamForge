// app/settings/SettingsCard.js

"use client"; // Ensure this is included

import React from "react";
import { motion } from "framer-motion"; // Import framer-motion for animations

const SettingsCard = () => {
  return (
    <motion.div
      className="max-w-sm w-full p-6 bg-gray-800 shadow-lg rounded-lg border border-gray-600" // Dark card background
      initial={{ opacity: 0, scale: 0.8 }} // Initial animation state
      animate={{ opacity: 1, scale: 1 }} // Animation to apply when mounted
      transition={{ duration: 0.3 }} // Animation duration
    >
      <h2 className="text-2xl font-semibold text-white mb-4">Settings</h2> {/* White text for contrast */}

      <div className="mt-4">
        <label className="block text-gray-300 text-sm font-medium mb-2">Stream Quality</label>
        <select className="block w-full border border-gray-600 rounded-md p-2 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300">
          <option value="1080p">1080p</option>
          <option value="720p">720p</option>
          <option value="480p">480p</option>
        </select>
      </div>

      <div className="mt-4">
        <label className="block text-gray-300 text-sm font-medium mb-2">Email Notifications</label>
        <div className="flex items-center mb-2">
          <input type="checkbox" id="emailNotifications" className="mr-2" />
          <label htmlFor="emailNotifications" className="text-gray-200">Enable</label>
        </div>
      </div>

      <motion.button
        className="mt-6 w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 transform hover:scale-105"
        whileHover={{ scale: 1.05 }} // Scale animation on hover
        whileTap={{ scale: 0.95 }} // Scale down on tap
      >
        Save Settings
      </motion.button>
    </motion.div>
  );
};

export default SettingsCard;
