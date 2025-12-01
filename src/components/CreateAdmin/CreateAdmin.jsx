import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";

export default function CreateAdmin() {
  const { token, role } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "admin",
    password: "",
    password_confirmation: "",
  });

  const [responseMsg, setResponseMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (role !== "super-admin") {
      setErrorMsg("You are not authorized to create a new admin.");
      setResponseMsg("");
      return;
    }

    try {
      const res = await axios.post(
        "https://generous-optimism-production-4492.up.railway.app/api/super-admin/create-admin",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        setResponseMsg(res.data.message);
        setErrorMsg("");
        setFormData({
          name: "",
          email: "",
          phone: "",
          role: "admin",
          password: "",
          password_confirmation: "",
        });
      }
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message || "Error occurred while creating admin."
      );
      setResponseMsg("");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md font-sans">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        Create New Admin
      </h2>

      {responseMsg && (
        <p className="text-green-600 mb-4 text-center font-medium">{responseMsg}</p>
      )}
      {errorMsg && (
        <p className="text-red-600 mb-4 text-center font-medium">{errorMsg}</p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
          className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
          className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Hidden role input */}
        <input type="hidden" name="role" value="admin" />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="password"
          name="password_confirmation"
          placeholder="Confirm Password"
          value={formData.password_confirmation}
          onChange={handleChange}
          required
          className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          type="submit"
          className="mt-2 bg-green-600 hover:bg-green-700 transition-colors text-white font-semibold py-3 rounded-md shadow"
        >
          Create Admin
        </button>
      </form>
    </div>
  );
}
