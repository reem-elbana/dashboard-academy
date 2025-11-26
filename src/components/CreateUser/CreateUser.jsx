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
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Create New User</h2>

        {successMsg && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{successMsg}</div>
        )}

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{errorMsg}</div>
        )}

        <form onSubmit={handleSubmit}>

          <label className="block mb-2 font-semibold" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full mb-4 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Enter name"
          />

          <label className="block mb-2 font-semibold" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full mb-4 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Enter email"
          />

          <label className="block mb-2 font-semibold" htmlFor="phone">
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            type="text"
            required
            value={formData.phone}
            onChange={handleChange}
            className="w-full mb-4 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Enter phone number"
          />

          <label className="block mb-2 font-semibold" htmlFor="national_id">
            National ID
          </label>
          <input
            id="national_id"
            name="national_id"
            type="text"
            required
            value={formData.national_id}
            onChange={handleChange}
            className="w-full mb-4 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Enter national ID"
          />

          <label className="block mb-2 font-semibold" htmlFor="role">
            Role
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full mb-6 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-md transition disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create User"}
          </button>
        </form>
      </div>
    </div>
  );
}
