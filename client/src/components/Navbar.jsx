import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { Menu, X, User } from "lucide-react"; // Optional: Icons

export default function Navbar({ toggleSidebar }) {
  const { currentUser } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    setDropdownOpen(false);
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white relative">
      {/* Left: Menu icon */}
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="p-1 rounded hover:bg-gray-700">
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-bold">Study Room</h1>
      </div>

      {/* Right: Auth buttons or Account info */}
      <div className="relative">
        {!currentUser ? (
          <Link to="/auth" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">
            Login / Signup
          </Link>
        ) : (
          <div className="relative">
            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2">
              <User size={20} />
              <span className="hidden sm:inline">{currentUser.email}</span>
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-lg w-48 z-10">
                <div className="p-4 border-b border-gray-200">
                  <p className="text-sm truncate">{currentUser.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
