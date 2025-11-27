import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";

export default function EditUser() {
  const { token } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const user = location.state?.user;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    national_id: "",
    role: "subscriber",
    remaining_sessions: 0,
    subscription_expires_at: "",
    is_active: true,
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const roles = ["subscriber", "admin", "super_admin"];

  useEffect(() => {
    if (!user) {
      navigate("/admin/users");
      return;
    }
    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      national_id: user.national_id || "",
      role: user.role || "subscriber",
      remaining_sessions: user.remaining_sessions || 0,
      subscription_expires_at: user.subscription_expires_at
        ? user.subscription_expires_at.split("T")[0]
        : "",
      is_active: user.is_active ?? true,
    });
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const res = await axios.put(
        `https://generous-optimism-production-4492.up.railway.app/api/admin/users/${id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        setSuccessMsg("User updated successfully.");
      } else {
        setErrorMsg("Failed to update user.");
      }
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Failed to update user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center p-6">
      <div className="bg-white w-full max-w-xl p-6 rounded-2xl shadow-md border border-gray-200">
        <h2 className="text-2xl font-semibold mb-6 text-center text-green-700 tracking-tight">
          Update User
        </h2>

        {successMsg && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg text-center font-medium shadow-sm border border-green-300">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg text-center font-medium shadow-sm border border-red-300">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block mb-1 font-medium text-gray-800 text-base">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full p-3 border border-gray-300 rounded-lg text-base bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-400 outline-none transition"
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-1 font-medium text-gray-800 text-base">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full p-3 border border-gray-300 rounded-lg text-base bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-400 outline-none transition"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block mb-1 font-medium text-gray-800 text-base">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="text"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="w-full p-3 border border-gray-300 rounded-lg text-base bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-400 outline-none transition"
            />
          </div>

          <div>
            <label htmlFor="national_id" className="block mb-1 font-medium text-gray-800 text-base">
              National ID
            </label>
            <input
              id="national_id"
              name="national_id"
              type="text"
              required
              value={formData.national_id}
              onChange={handleChange}
              placeholder="National ID"
              className="w-full p-3 border border-gray-300 rounded-lg text-base bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-400 outline-none transition"
            />
          </div>

          <div>
            <label htmlFor="role" className="block mb-1 font-medium text-gray-800 text-base">
              Role
            </label>
            <select
              id="role"
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

          <div>
            <label
              htmlFor="remaining_sessions"
              className="block mb-1 font-medium text-gray-800 text-base"
            >
              Remaining Sessions
            </label>
            <input
              id="remaining_sessions"
              name="remaining_sessions"
              type="number"
              min="0"
              value={formData.remaining_sessions}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg text-base bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-400 outline-none transition"
            />
          </div>

          <div>
            <label
              htmlFor="subscription_expires_at"
              className="block mb-1 font-medium text-gray-800 text-base"
            >
              Subscription Expires At
            </label>
            <input
              id="subscription_expires_at"
              name="subscription_expires_at"
              type="date"
              value={formData.subscription_expires_at}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg text-base bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-400 outline-none transition"
            />
          </div>

          <label className="inline-flex items-center mb-6 cursor-pointer select-none">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="mr-2 w-5 h-5 text-green-600 focus:ring-green-400 border-gray-300 rounded"
            />
            <span className="text-gray-800 font-medium">Active User</span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 shadow"
          >
            {loading ? "Updating..." : "Update User"}
          </button>
        </form>
      </div>
    </div>
  );
}
