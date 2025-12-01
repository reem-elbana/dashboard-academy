import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";

function QRManager() {
  const { token } = useContext(AuthContext);

  const [qrType, setQrType] = useState("profile");
  const [userId, setUserId] = useState("");
  const [profileQRList, setProfileQRList] = useState([]);

  const [sessionId, setSessionId] = useState("");
  const [duration, setDuration] = useState(120);
  const [attendanceQRList, setAttendanceQRList] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // -------------------------------
  // Generate Profile QR
  // -------------------------------
  const handleGenerateProfileQR = async () => {
    if (!userId) {
      setError("Please enter a User ID");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post(
        `https://generous-optimism-production-4492.up.railway.app/api/admin/generate-profile-qr/${userId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setProfileQRList((prev) => [response.data.data, ...prev]);
      } else {
        setError("Failed to generate Profile QR Code");
      }
    } catch (err) {
      setError("An error occurred: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------
  // Generate Attendance QR
  // -------------------------------
  const handleGenerateAttendanceQR = async () => {
    if (!sessionId) {
      setError("Please enter a Session ID");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post(
        `https://generous-optimism-production-4492.up.railway.app/api/admin/generate-attendance-qr/${sessionId}`,
        { duration_minutes: duration },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setAttendanceQRList((prev) => [response.data.data, ...prev]);
      } else {
        setError("Failed to generate Attendance QR Code");
      }
    } catch (err) {
      setError("An error occurred: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------
  // Delete QR Locally from UI
  // -------------------------------
  const handleDeleteQR = (index, type) => {
    if (type === "profile") {
      setProfileQRList((prev) => prev.filter((_, i) => i !== index));
    } else {
      setAttendanceQRList((prev) => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">QR Management</h1>
      <p className="text-gray-500 mb-8">
        Generate and manage QR codes for profiles and attendance
      </p>

      {error && (
        <div className="mb-5 bg-red-100 border border-red-400 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Top Controls */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-10">
        <button
          onClick={
            qrType === "profile"
              ? handleGenerateProfileQR
              : handleGenerateAttendanceQR
          }
          disabled={loading}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
        >
          Generate QR Code
        </button>

        <select
          value={qrType}
          onChange={(e) => setQrType(e.target.value)}
          className="px-4 py-3 border rounded-lg bg-white shadow-sm"
        >
          <option value="profile">Profile</option>
          <option value="attendance">Attendance</option>
        </select>
      </div>

      {/* Input Fields */}
      {qrType === "profile" && (
        <div className="max-w-sm mb-8">
          <label className="block mb-2 font-semibold text-gray-700">
            User ID:
          </label>
          <input
            type="number"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg"
          />
        </div>
      )}

      {qrType === "attendance" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-xl mb-8">
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Session ID:
            </label>
            <input
              type="number"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              QR Validity (minutes):
            </label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full px-4 py-3 border rounded-lg"
            />
          </div>
        </div>
      )}

      {/* QR Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile QR List */}
        {qrType === "profile" &&
          profileQRList.map((qr, index) => (
            <div
              key={index}
              className="bg-white p-5 rounded-xl shadow-md border relative"
            >
              {/* DELETE BUTTON */}
              <button
                onClick={() => handleDeleteQR(index, "profile")}
                className="absolute bottom-3 right-3 text-red-600 font-bold text-xl"
              >
                ×
              </button>

              <div className="text-right text-sm text-blue-500 font-semibold mb-2">
                Profile
              </div>

              <img
                src={qr.qr_code_url}
                className="w-40 mx-auto"
                alt="QR Code"
              />

              <div className="mt-4 text-center font-semibold text-gray-800">
                Profile of {qr.user.name}
              </div>

              <div className="text-center text-gray-500 text-sm mt-1">
                Expires at: {new Date(qr.expires_at).toLocaleDateString()}
              </div>
            </div>
          ))}

        {/* Attendance QR List */}
        {qrType === "attendance" &&
          attendanceQRList.map((qr, index) => (
            <div
              key={index}
              className="bg-white p-5 rounded-xl shadow-md border relative"
            >
              {/* DELETE BUTTON */}
              <button
                onClick={() => handleDeleteQR(index, "attendance")}
                className="absolute bottom-3 right-3 text-red-600 font-bold text-xl"
              >
                ×
              </button>

              <div className="text-right text-sm text-green-600 font-semibold mb-2">
                Attendance
              </div>

              <img
                src={qr.qr_code_url}
                className="w-40 mx-auto"
                alt="QR Code"
              />

              <div className="mt-4 text-center font-semibold text-gray-800">
                {qr.session_name || `Session ${qr.session_id}`}
              </div>

              <div className="text-center text-gray-500 text-sm mt-1">
                Expires at: {new Date(qr.expires_at).toLocaleDateString()}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default QRManager;
