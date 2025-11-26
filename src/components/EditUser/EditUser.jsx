import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";

export default function EditUser() {
  const { token } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams(); // user id from URL params


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

  // لما الصفحة تحمل، نتحقق من وجود بيانات المستخدم، لو مافيش نرجع لصفحة المستخدمين
  useEffect(() => {
    if (!user) {
      // لو مفيش بيانات مستخدم، نرجع لقائمة المستخدمين
      navigate("/admin/users");
      return;
    }

    // عبي الفورم بالبيانات اللي جت من صفحة UsersList
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
      setErrorMsg(
        error.response?.data?.message || "Failed to update user."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-center">Update User</h2>

      {successMsg && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{errorMsg}</div>
      )}

      <form onSubmit={handleSubmit}>
        <label className="block mb-1 font-semibold" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={formData.name}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
          placeholder="Name"
        />

        <label className="block mb-1 font-semibold" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
          placeholder="Email"
        />

        <label className="block mb-1 font-semibold" htmlFor="phone">
          Phone
        </label>
        <input
          id="phone"
          name="phone"
          type="text"
          required
          value={formData.phone}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
          placeholder="Phone"
        />

        <label className="block mb-1 font-semibold" htmlFor="national_id">
          National ID
        </label>
        <input
          id="national_id"
          name="national_id"
          type="text"
          required
          value={formData.national_id}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
          placeholder="National ID"
        />

        <label className="block mb-1 font-semibold" htmlFor="role">
          Role
        </label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
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

        <label className="block mb-1 font-semibold" htmlFor="remaining_sessions">
          Remaining Sessions
        </label>
        <input
          id="remaining_sessions"
          name="remaining_sessions"
          type="number"
          min="0"
          value={formData.remaining_sessions}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
        />

        <label className="block mb-1 font-semibold" htmlFor="subscription_expires_at">
          Subscription Expires At
        </label>
        <input
          id="subscription_expires_at"
          name="subscription_expires_at"
          type="date"
          value={formData.subscription_expires_at}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
        />

        <label className="inline-flex items-center mb-6">
          <input
            type="checkbox"
            name="is_active"
            checked={formData.is_active}
            onChange={handleChange}
            className="mr-2"
          />
          Active User
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded transition disabled:opacity-60"
        >
          {loading ? "Updating..." : "Update User"}
        </button>
      </form>
    </div>
  );
}
