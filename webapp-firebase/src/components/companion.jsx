import React, { useState } from "react";
import { db } from "../main";
import { doc, getDoc } from "firebase/firestore";
import { QRCodeCanvas } from "qrcode.react";

export default function Companion() {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [uniqueId, setUniqueId] = useState("");
  const [showQR, setShowQR] = useState(false);

  // Fetch basic student info by last 4 digits
  const handleFetchUser = async (e) => {
    e.preventDefault();
    if (!uniqueId.trim()) return alert("Enter your full Unique ID first.");

    const shortId = uniqueId.trim().slice(-4);
    setLoading(true);

    try {
      const ref = doc(db, "students", shortId);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        setUserData({
          fullname: data.fullname || "Unknown",
          email: data.email || "N/A",
          password: data.password || "N/A",
          phone: data.phone || "N/A",
          class: data.class || "N/A",
          shortId: shortId,
        });
        setShowQR(false);
        alert(`Account found for ID ending with ${shortId}.`);
      } else {
        alert(`No student found for ID ending with ${shortId}.`);
      }
    } catch (err) {
      console.error("Error fetching user:", err);
      alert("Error fetching data. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  // Generate lightweight QR reference
  const handleGenerateQR = () => {
    if (!userData) return alert("Load account details first.");

    // Simple secure payload
    const qrPayload = {
      uid: userData.shortId,
      email: userData.email,
      name: userData.fullname,
      type: "student_ref",
      timestamp: new Date().toISOString(),
    };

    setUserData((prev) => ({ ...prev, qrPayload }));
    setShowQR(true);
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-inherit font-sans px-4 sm:px-6">
      <div className="bg-white w-full max-w-md sm:max-w-lg lg:max-w-xl p-6 sm:p-8 rounded-2xl shadow-xl">
        <h2 className="text-center mb-6 text-sky-700 text-xl sm:text-2xl font-bold tracking-wide">
          Companion App QR Access
        </h2>

        <form onSubmit={handleFetchUser} className="space-y-4">
          <input
            type="text"
            value={uniqueId}
            onChange={(e) => setUniqueId(e.target.value)}
            placeholder="Enter your full Unique ID"
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 bg-gradient-to-r from-[#2575fc] to-[#6a11cb] text-white font-bold rounded-lg shadow-md hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Fetching..." : "Fetch Account"}
          </button>
        </form>

        {userData && !showQR && (
          <div className="mt-6 text-center space-y-2">
            <p className="font-semibold text-gray-700">
              Name: {userData.fullname}
            </p>
            <p className="text-gray-600 text-sm">Email: {userData.email}</p>
            <p className="text-gray-600 text-sm">Class: {userData.class}</p>

            <button
              onClick={handleGenerateQR}
              className="w-full mt-4 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition"
            >
              Generate QR Code
            </button>
          </div>
        )}

        {showQR && userData.qrPayload && (
          <div className="flex flex-col items-center mt-6">
            <QRCodeCanvas
              value={JSON.stringify(userData.qrPayload)}
              size={230}
              includeMargin={true}
            />
            <p className="text-gray-600 mt-3 text-sm text-center">
              Scan this QR in the mobile companion app to link your account.
              <br />
              <span className="text-red-600 font-semibold">
                ⚠ Do not share this QR code with anyone.
              </span>
            </p>
          </div>
        )}

        <div className="mt-8 text-center">
          <a
            href="https://your-download-link.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block py-3 px-6 bg-blue-700 text-white rounded-lg font-semibold shadow-md hover:bg-blue-800 transition"
          >
            Download Companion App
          </a>
        </div>
      </div>
    </main>
  );
}
