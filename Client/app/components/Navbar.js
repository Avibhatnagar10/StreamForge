"use client"; // Use this if you're using useState in any components

import React, { useState, useEffect, useRef } from "react";
import { auth, provider } from "../firebaseConfig";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleStreamToggle = () => {
    console.log("Stream started/stopped");
  };

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      console.log("User signed in:", result.user);
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  const handleHomeRedirect = () => {
    router.push("/");
  };

  const handleProfileRedirect = () => {
    router.push("/userprofile");
  };

  const handleSettingsRedirect = () => {
    router.push("/settings");
  };

  const handleLogout = async () => {
    await auth.signOut();
    setUser(null);
    console.log("User signed out");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  return (
    <nav className="flex justify-between items-center p-4">
      <h1
        className="text-3xl font-bold text-white cursor-pointer tracking-wide transition-transform duration-300 ease-in-out hover:scale-110"
        onClick={handleHomeRedirect}
      >
        StreamForge
      </h1>
      <div className="flex items-center space-x-6">
        <button
          className="text-sm font-medium text-white bg-transparent px-5 py-3 rounded-md 
          hover:bg-gray-700 hover:bg-opacity-50 hover:border-gray-700 transition duration-300 ease-in-out 
          focus:outline-none focus:ring-2 focus:ring-gray-500"
          onClick={handleStreamToggle}
        >
          Start Live Stream
        </button>

        <button
          className="text-sm font-medium text-white bg-transparent px-5 py-3 rounded-md 
          hover:bg-gray-700 hover:bg-opacity-50 hover:border-gray-700 transition duration-300 ease-in-out 
          focus:outline-none focus:ring-2 focus:ring-gray-500"
          onClick={() => alert("Contact us at info@streamforge.com")}
        >
          Contact Us
        </button>

        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              className="text-sm font-medium text-white px-4 py-2 hover:underline focus:outline-none"
              onClick={toggleDropdown}
            >
              {user.displayName || "Profile"}
            </button>
            <div
              className={`absolute right-0 mt-2 w-48 bg-opacity-90 bg-gray-800 border border-gray-700 shadow-lg rounded-md 
              transition-all duration-500 ease-in-out transform origin-top ${
                dropdownOpen
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
              }`}
            >
              <button
                className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:bg-opacity-50 transition duration-300"
                onClick={handleProfileRedirect}
              >
                User Profile
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:bg-opacity-50 transition duration-300"
                onClick={handleSettingsRedirect}
              >
                Settings
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-red-500 hover:bg-red-600 hover:bg-opacity-50 transition duration-300"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <button
            className="text-sm font-medium text-white bg-transparent px-5 py-3 rounded-md 
            hover:bg-gray-700 hover:bg-opacity-50 hover:border-gray-700 transition duration-300 ease-in-out 
            focus:outline-none focus:ring-2 focus:ring-gray-500"
            onClick={handleLogin}
          >
            Sign in
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
