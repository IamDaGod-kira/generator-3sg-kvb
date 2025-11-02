import React, { useState, useEffect } from "react";
import { auth, db } from "../main";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import Swal from "sweetalert2";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [uniqueId, setUniqueId] = useState("");
  const [userData, setUserData] = useState(null);

  // Detect login state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const q = query(
            collection(db, "students"),
            where("email", "==", currentUser.email),
          );
          const qs = await getDocs(q);
          if (!qs.empty) {
            const data = qs.docs[0].data();
            setUserData({ ...data, uid: currentUser.uid });
          } else {
            Swal.fire({
              icon: "warning",
              title: "No record found",
              text: "No Firestore record found for this email.",
              confirmButtonColor: "#2563eb",
            });
          }
        } catch (err) {
          Swal.fire({
            icon: "error",
            title: "Error fetching data",
            text: err.message,
            confirmButtonColor: "#2563eb",
          });
        }
      } else {
        setUserData(null);
      }
    });
    return () => unsub();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password || !uniqueId) {
      Swal.fire({
        icon: "warning",
        title: "Missing fields",
        text: "Please fill in all fields before logging in.",
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      const docId = uniqueId.slice(-4);
      const docRef = doc(db, "students", docId);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        const data = snap.data();
        setUserData({ ...data, uid: auth.currentUser.uid });
        Swal.fire({
          icon: "success",
          title: "Login successful!",
          text: `Welcome back, ${data.name || "Student"}!`,
          confirmButtonColor: "#2563eb",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Unique ID not found",
          text: "No Firestore record found for this Unique ID.",
          confirmButtonColor: "#2563eb",
        });
      }
    } catch (err) {
      console.error("Login error:", err);
      Swal.fire({
        icon: "error",
        title: "Login failed",
        text: "Invalid credentials or user not found.",
        confirmButtonColor: "#2563eb",
      });
    }
  };

  const handleLogout = async () => {
    const confirmLogout = await Swal.fire({
      icon: "question",
      title: "Log out?",
      text: "Are you sure you want to log out?",
      showCancelButton: true,
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
    });

    if (confirmLogout.isConfirmed) {
      await signOut(auth);
      setUserData(null);
      Swal.fire({
        icon: "success",
        title: "Logged out",
        text: "You have been successfully logged out.",
        confirmButtonColor: "#2563eb",
      });
    }
  };

  if (userData) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-md w-full max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-800">
          Welcome, {userData.name || "Student"} 👋
        </h2>
        <div className="space-y-2 text-gray-700">
          <p>
            <strong>Email:</strong> {userData.email}
          </p>
          <p>
            <strong>Unique ID:</strong> {userData.uniqueid}
          </p>
          <p>
            <strong>UID:</strong> {userData.uid}
          </p>
          <p>
            <strong>Class:</strong> {userData.class || "Not set"}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="mt-6 w-full py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-md w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-800">
        Login
      </h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="Unique ID"
          value={uniqueId}
          onChange={(e) => setUniqueId(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded"
        >
          Login
        </button>
        <br />
        <br />
        <a
          href="/createacc"
          className="w-auto text-center bg-white text-blue-600 px-3 sm:px-4 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-blue-50 hover:shadow-md"
        >
          Create a new Account
        </a>
      </form>
    </div>
  );
}
