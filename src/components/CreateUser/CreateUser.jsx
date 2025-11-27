import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";

export default function CreateUser() {
  const { token } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    national_id: "",
    role: "subscriber",
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const roles = ["subscriber", "admin", "super_admin"];

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const res = await axios.post(
        "https://generous-optimism-production-4492.up.railway.app/api/admin/users",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        setSuccessMsg("User created successfully");
        setFormData({
          name: "",
          email: "",
          phone: "",
          national_id: "",
          role: "subscriber",
        });
      } else {
        setErrorMsg("An error occurred while creating the user");
      }
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message || "An error occurred while creating the user"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-20 p-6 flex justify-center items-center">
      <div className="bg-white w-full max-w-xl p-6 rounded-2xl shadow-md border border-gray-200">
        {/* Title */}
        <h2 className="text-2xl font-semibold mb-6 text-center text-green-700 tracking-tight">
          Create New User
        </h2>

        {/* Success Message */}
        {successMsg && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg text-center font-medium shadow-sm border border-green-300">
            {successMsg}
          </div>
        )}

        {/* Error Message */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg text-center font-medium shadow-sm border border-red-300">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Name */}
          <div>
            <label className="block mb-1 font-medium text-gray-800 text-base">Name</label>
            <input
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg text-base bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-400 outline-none transition"
              placeholder="Enter name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-medium text-gray-800 text-base">Email</label>
            <input
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg text-base bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-400 outline-none transition"
              placeholder="Enter email"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block mb-1 font-medium text-gray-800 text-base">Phone Number</label>
            <input
              name="phone"
              type="text"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg text-base bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-400 outline-none transition"
              placeholder="Enter phone number"
            />
          </div>

          {/* National ID */}
          <div>
            <label className="block mb-1 font-medium text-gray-800 text-base">National ID</label>
            <input
              name="national_id"
              type="text"
              required
              value={formData.national_id}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg text-base bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-400 outline-none transition"
              placeholder="Enter national ID"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block mb-1 font-medium text-gray-800 text-base">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg text-base bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-400 outline-none transition"
            >
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r === "subscriber"
                    ? "Subscriber"
                    : r === "admin"
                    ? "Admin"
                    : "Super Admin"}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white text-base font-semibold py-3 rounded-lg transition disabled:opacity-50 shadow"
          >
            {loading ? "Creating..." : "Create User"}
          </button>
        </form>
      </div>
    </div>
  );
}
