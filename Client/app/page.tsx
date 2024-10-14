// /client/pages/HomePage.tsx

"use client";

import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, User } from "firebase/auth";
import Navbar from "./components/Navbar"; // Adjust the import path if necessary
import "./globals.css"; // Import global styles
import { FaArrowRight, FaGoogle } from "react-icons/fa"; // Icon import
import { auth } from "./firebaseConfig"; // Firebase auth import
import { useRouter } from "next/navigation"; // Import useRouter for navigation

const HomePage = () => {
  // Explicitly set the user type to be either Firebase.User or null
  const [user, setUser] = useState<User | null>(null); 
  const [showCards, setShowCards] = useState(false);
  const [overflow, setOverflow] = useState("hidden"); // Initial overflow state is hidden
  const [showPopup, setShowPopup] = useState(false); // Track popup visibility
  const [popupVisible, setPopupVisible] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState(""); // To store welcome message
  const [margindo, setMargindo] = useState("mt-16");
  const router = useRouter(); // Initialize the router

  // Check user authentication status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null); // Set the user state (Firebase.User or null)
      if (currentUser) {
        const userName = currentUser.displayName || currentUser.email;
        const isNewUser = currentUser.metadata.creationTime === currentUser.metadata.lastSignInTime;
        setWelcomeMessage(isNewUser ? `Hello, ${userName}` : `Welcome back, ${userName}`);
        setMargindo('-mt-80');
        setPopupVisible(true); // Show popup with animation
        setShowPopup(true);

        // Automatically hide the popup after 5 seconds
        setTimeout(() => {
          setShowPopup(false); // Trigger exit animation
          setTimeout(() => setPopupVisible(false), 500); // Wait for animation to finish before hiding completely
        }, 1000); // Extended time to 5 seconds
      }
    });
    return () => unsubscribe();
  }, []);

  const handleGetStartedClick = () => {
    if (!user) {
      setPopupVisible(true); // Show sign-in popup if not signed in
      setShowPopup(true);
    } else {
      setShowCards(true); // Show cards if signed in
      setOverflow("auto");
      setTimeout(() => {
        const cardsSection = document.getElementById("cards-section");
        if (cardsSection) {
          cardsSection.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  };

  const handleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        setUser(result.user); // result.user is of type Firebase.User
        setShowPopup(false); // Trigger exit animation
        setTimeout(() => setPopupVisible(false), 500); // Hide popup after animation
        setShowCards(true);
      })
      .catch((error) => {
        console.error("Error signing in: ", error);
      });
  };

  const handleStartLiveStream = () => {
    if (user) {
      window.open("/livestreampage", "_blank"); // Open live stream in a new tab
    } else {
      alert("Please sign in to start a live stream.");
      setPopupVisible(true); // Show sign-in popup if not signed in
      setShowPopup(true);
    }
  };

  return (
    <div className={`relative h-screen overflow-y-${overflow} text-white hide-scrollbar background`}>
      <Navbar />
      {/* Navbar at the top */}

      {/* Centered content */}
      <div className="flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="text-5xl font-extrabold mb-8 tracking-wide transition-transform duration-300 transform hover:scale-110">
          <p className="streamforge text-8xl font-extrabold transition-transform duration-300 transform hover:scale-110">StreamForge</p> 
          <span className="text-2xl mt-4 block">Your Way, Your Stream, Your Platform</span>
        </h1>

        <button
          className="bg-white flex items-center justify-center px-8 py-3 border-4 border-blue-600 text-blue-900 rounded-full 
          hover:bg-blue-600 hover:text-white 
          transition duration-300 transform 
          hover:scale-105 shadow-lg shadow-blue-500/50 
          focus:ring-3 focus:ring-blue-300 focus:outline-none"
          aria-label="Get Started with StreamForge"
          onClick={handleGetStartedClick}
        >
          <span className="flex items-center">
            Get Started
            <FaArrowRight className="ml-2" /> {/* Arrow icon */}
          </span>
        </button>
      </div>

      {/* Cards Section */}
      {showCards && (
        <div id="cards-section" className="flex justify-center space-x-4 w-full mt-8 px-4 transition-opacity duration-500">
          <div className="card bg-black rounded-lg shadow-lg glow-card w-1/2 h-[70vh] p-8 flex flex-col items-center justify-center">
            <h2 className="card-title text-4xl mb-4">Record Your Stream</h2>
            <p className="card-text text-lg ">Connect with streamers and record the fun!</p>
            <button 
              className="button mt-4 px-6 py-3 text-lg font-extrabold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg relative overflow-hidden group"
              onClick={handleStartLiveStream} // Update to use navigation function
            >
              <span className="relative z-10">Record Now</span>
              <span className="absolute bottom-0 left-0 right-0 h-1 bg-blue-700 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300 transform group-hover:scale-110"></span>
            </button>
          </div>
          <div className="card bg-black rounded-lg shadow-lg glow-card w-1/2 h-[70vh] p-8 flex flex-col items-center justify-center">
            <h2 className="card-title text-4xl mb-4">Start Your Live Stream</h2>
            <p className="card-text text-lg">Begin your streaming journey with StreamForge.</p>
            <button className="button mt-4 px-6 py-3 text-lg font-extrabold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg relative overflow-hidden group">
              <span className="relative z-10">Start Live! 🔴</span>
              <span className="absolute bottom-0 left-0 right-0 h-1 bg-blue-700 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300 transform group-hover:scale-110"></span>
            </button>
          </div>
        </div>
      )}

      {/* Sign-In Popup */}
      {popupVisible && (
        <div className={`fixed inset-0 flex items-center justify-center ${margindo} bg-black bg-opacity-50`}>
          <div className={`bg-white rounded-lg p-8 shadow-lg transform transition-all duration-200 ${showPopup ? "animate-fade-in" : "animate-fade-out"} glow-popup`}>
            {user ? (
              <div className="text-center">
                <h2 className="text-2xl font-bold ">{welcomeMessage}</h2>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-4">Sign In Required</h2>
                <p className="mb-4">Please sign in to continue.</p>
                <button
                  onClick={handleSignIn}
                  className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                >
                  <FaGoogle className="mr-2" />
                  Sign In with Google
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
