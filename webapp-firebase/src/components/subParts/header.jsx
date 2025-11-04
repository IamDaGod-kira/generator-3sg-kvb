import { useState, useEffect } from "react";
import { auth, db } from "../../main";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { User } from "lucide-react";

export default function Header() {
  const options = ["Dumdum", "Santragachi", "Ballygunge", "Saltlake"];
  const [selected, setSelected] = useState(null);
  const [current, setCurrent] = useState(options[0]);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          // find the student's uniqueid field in their doc
          const studentQuery = query(
            collection(db, "students"),
            where("uid", "==", currentUser.uid),
          );
          const snapshot = await getDocs(studentQuery);

          if (!snapshot.empty) {
            const studentData = snapshot.docs[0].data();
            const uniqueId = studentData.uniqueid || currentUser.uid.slice(-4);
            const docId = uniqueId.slice(-4); // last 4 digits for document name

            const userRef = doc(db, "students", docId);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists() && userSnap.data().zone) {
              const userZone = userSnap.data().zone;
              setSelected(userZone);
              setCurrent(userZone);
              localStorage.setItem("zone", userZone);
            } else {
              const localZone = localStorage.getItem("zone");
              if (localZone) {
                await setDoc(userRef, { zone: localZone }, { merge: true });
              }
            }
          } else {
            const localZone = localStorage.getItem("zone");
            if (localZone) {
              const fallbackId = currentUser.uid.slice(-4);
              await setDoc(
                doc(db, "students", fallbackId),
                { zone: localZone },
                { merge: true },
              );
            }
          }
        } catch (err) {
          console.error("Error syncing zone:", err);
        }
      } else {
        setSelected(null);
        const localZone = localStorage.getItem("zone");
        if (localZone) setSelected(localZone);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (selected || user) return;

    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        const nextIndex = (index + 1) % options.length;
        setIndex(nextIndex);
        setCurrent(options[nextIndex]);
        setFade(true);
      }, 300);
    }, 2000);

    return () => clearInterval(interval);
  }, [index, selected, user]);

  const handleZoneSelect = async (option) => {
    setSelected(option);
    setCurrent(option);
    setOpen(false);
    localStorage.setItem("zone", option);

    if (user) {
      try {
        const studentQuery = query(
          collection(db, "students"),
          where("uid", "==", user.uid),
        );
        const snapshot = await getDocs(studentQuery);

        let docId;
        if (!snapshot.empty) {
          const studentData = snapshot.docs[0].data();
          docId = (studentData.uniqueid || user.uid).slice(-4);
        } else {
          docId = user.uid.slice(-4);
        }

        const userRef = doc(db, "students", docId);
        await setDoc(userRef, { zone: option }, { merge: true });
      } catch (err) {
        console.error("Error saving zone:", err);
      }
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#9D4A4B] text-[gold] shadow-md font-['Libertinus_Serif_Display']">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center text-center sm:text-left w-full sm:w-auto">
            <img
              src="https://upload.wikimedia.org/wikipedia/en/thumb/b/ba/KVS_SVG_logo.svg/1100px-KVS_SVG_logo.svg.png"
              alt="KVS Logo"
              className="h-10 sm:h-14 mx-auto sm:mx-0"
            />
            <h1 className="text-lg sm:text-2xl font-bold text-white leading-tight mt-2 sm:mt-0 sm:ml-3">
              P.M. Shri Kendriya Vidyalaya
              <br />
            </h1>

            <div className="relative mt-3 sm:mt-0 sm:ml-4 mx-auto sm:mx-0">
              <button
                onClick={() => setOpen(!open)}
                className={`inline-flex items-center justify-between px-3 py-1 rounded-md font-semibold transition ${
                  selected
                    ? "bg-[#f8f4f4] text-[#9D4A4B]"
                    : "bg-[#f8f4f4]/70 text-[#9D4A4B]/70 italic"
                }`}
              >
                <span
                  className={`transition-opacity duration-500 ${
                    fade ? "opacity-100" : "opacity-30"
                  }`}
                >
                  {selected || current}
                </span>
                <svg
                  className={`w-4 h-4 ml-2 transition-transform duration-200 ${
                    open ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {open && (
                <div className="absolute left-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                  {options.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleZoneSelect(option)}
                      className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-[#f5f5f5] transition"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center sm:justify-end items-center gap-2 mt-4 sm:mt-0">
            <a
              href="call.html"
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

      <div className="h-[200px] sm:h-[160px]"></div>

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
