import { useState, useEffect } from "react";
import { auth } from "../../main";
import { onAuthStateChanged } from "firebase/auth";
import { User } from "lucide-react";

export default function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#9D4A4B] text-[gold] shadow-md font-['Libertinus_Serif_Display']">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          {/* Left side: logo and title */}
          <div className="flex flex-col sm:flex-row sm:items-center text-center sm:text-left w-full sm:w-auto">
            <img
              src="https://upload.wikimedia.org/wikipedia/en/thumb/b/ba/KVS_SVG_logo.svg/1100px-KVS_SVG_logo.svg.png"
              alt="KVS Logo"
              className="h-10 sm:h-14 mx-auto sm:mx-0"
            />
            <h1 className="text-lg sm:text-2xl font-bold text-white leading-tight mt-2 sm:mt-0 sm:ml-3">
              P.M. Shri Kendriya Vidyalaya Sangathan
            </h1>
          </div>

          {/* Right side: buttons */}
          <div className="flex justify-center sm:justify-end items-center gap-2 mt-4 sm:mt-0">
            <a
              href="/companion"
              className="bg-green-400 text-green-700 px-3 sm:px-4 py-2 rounded-full font-bold transition hover:bg-white hover:shadow-md text-sm sm:text-base"
            >
              Get Mobile App
            </a>

            {user ? (
              <a
                href="/dashboard"
                className="bg-white text-blue-600 px-3 sm:px-4 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-blue-50 hover:shadow-md"
              >
                <User size={18} />
                <span className="hidden sm:inline">Dashboard</span>
              </a>
            ) : (
              <a
                href="/login"
                className="bg-white text-blue-500 px-3 sm:px-4 py-2 rounded-full font-bold transition hover:bg-[rgb(139,226,255)] hover:text-[rgb(0,81,255)] hover:shadow-md text-sm sm:text-base"
              >
                Login
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Spacer so content isn't hidden behind fixed header */}
      <div className="h-[200px] sm:h-[160px]"></div>

      {/* Navigation bar */}
      <div className="flex justify-center px-3">
        <nav className="flex flex-wrap justify-center gap-3 sm:gap-5 p-4 max-w-2xl bg-white rounded-lg shadow-md">
          <a
            href="https://baligunge.kvs.ac.in/"
            className="px-4 sm:px-6 py-2 sm:py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-white hover:text-green-600 transition"
          >
            Organising School
          </a>
          <a
            href="/dashboard"
            className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-white hover:text-blue-600 transition"
          >
            Dashboard
          </a>
          <a
            href="/"
            className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-800 text-white font-bold rounded-lg hover:bg-white hover:text-gray-800 transition"
          >
            Home
          </a>
        </nav>
      </div>
    </>
  );
}
