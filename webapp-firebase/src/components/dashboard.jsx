import React, { useEffect, useState } from "react";
import { auth, db } from "../main";
import { onAuthStateChanged, deleteUser, signOut } from "firebase/auth";
import {
  doc,
  getDocs,
  collection,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";
import Generator from "./generator";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const q = query(
            collection(db, "students"),
            where("email", "==", currentUser.email),
          );
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            setStudentData(querySnapshot.docs[0].data());
          }
        } catch (error) {
          console.error("Error fetching student data:", error);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.replace("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleDelete = async () => {
    if (!studentData) return alert("No student data found to delete.");
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This cannot be undone.",
      )
    )
      return;

    try {
      const uniquePart = studentData.uniqueid.slice(-4);
      await deleteDoc(doc(db, "students", uniquePart));
      await deleteUser(auth.currentUser);
      alert("Your account and data have been deleted.");
      window.location.replace("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Error deleting account: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Loading dashboard...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600">
        Please log in to view your dashboard.
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto my-10 bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        {/* Left side: Schedule generator */}
        <div className="w-full lg:w-[65%] p-6 sm:p-8 bg-gradient-to-r from-[#d3f3ff]/40 to-[#fff0a5]/40 flex flex-col items-center justify-center text-center">
          <Generator
            classLevel={studentData?.class || "9"}
            userUid={user.uid}
          />
        </div>

        {/* Right side: Student info */}
        <div
          className={`w-full lg:w-[35%] p-6 sm:p-8 bg-gradient-to-l from-[#ebe045]/20 to-[#33cfff]/20 transform transition-transform duration-700 ease-in-out ${
            showDetails ? "translate-x-0" : "translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="lg:hidden mb-4 flex justify-center">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            >
              {showDetails ? "Hide Details" : "Show Details"}
            </button>
          </div>

          <div className={`${showDetails || "hidden lg:block"}`}>
            <h2 className="text-xl sm:text-2xl text-blue-900 font-semibold mb-6 text-center">
              Student Dashboard
            </h2>

            {studentData ? (
              <div className="space-y-3 text-sm sm:text-base text-gray-700">
                <div>
                  <strong>Full Name:</strong> {studentData.fullname}
                </div>
                <div>
                  <strong>Email:</strong> {studentData.email}
                </div>
                <div>
                  <strong>Phone:</strong> {studentData.phone}
                </div>
                <div>
                  <strong>Class:</strong> {studentData.class}
                </div>
                <div>
                  <strong>Unique ID:</strong> {studentData.uniqueid}
                </div>
                <div>
                  <strong>UID:</strong> {studentData.uid}
                </div>
                <div>
                  <strong>Zone:</strong> {studentData.zone}
                </div>

                <button
                  onClick={handleDelete}
                  className="w-full py-2 mt-6 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
                >
                  Delete Account
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full py-2 mt-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <p className="text-gray-500 text-center">
                No student data found.
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
