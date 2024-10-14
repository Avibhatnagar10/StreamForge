"use client"; // Use this to make the component a client component

import React from "react";
import { auth } from "../firebaseConfig"; // Import auth
import { useAuthState } from "react-firebase-hooks/auth"; // Import useAuthState for easy auth state handling
import { useRouter } from "next/navigation"; // Import useRouter for navigation

const UserProfile = () => {
  const [user] = useAuthState(auth); // Get the current user
  const router = useRouter(); // Create a router instance for navigation

  // Function to navigate to the home page
  const handleReturnHome = () => {
    router.push("/"); // Navigate to the home page
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {user ? (
        <div className="bg-gray-900 p-8 rounded-xl shadow-2xl transform transition-all duration-500 hover:scale-105 w-full max-w-md">
          <div className="flex flex-col items-center">
            {/* Profile Picture */}
            <div className="relative mb-6">
              {user.photoURL ? (
                <img
                  src={user.photoURL} // Display Google profile picture
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-lg transition-transform duration-500 transform hover:scale-110 hover:border-blue-400"
                />
              ) : (
                <div className="flex items-center justify-center w-32 h-32 rounded-full border-4 border-dashed border-gray-700 text-gray-500">
                  <span className="text-lg">No Image</span>
                </div>
              )}
            </div>

            {/* User Info */}
            <h1 className="text-3xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 animate-pulse">
              {user.displayName || "User"}
            </h1>
            <p className="text-gray-400 text-lg mb-4">Email: {user.email}</p>
            <p className="text-gray-500 text-sm">User ID: {user.uid}</p>

            {/* Buttons */}
            <div className="flex justify-center mt-6 space-x-4">
              <button
                onClick={handleReturnHome}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none"
              >
                Home
              </button>
              <button
                onClick={() => console.log("Edit Profile")}
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      ) : (
        <h1 className="text-2xl font-semibold">Please sign in to view your profile</h1>
      )}
    </div>
  );
};

export default UserProfile;
