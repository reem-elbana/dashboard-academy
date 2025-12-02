import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";
import { useTranslation } from "react-i18next";

export default function CreateUser() {
  const { token } = useContext(AuthContext);
  const { t } = useTranslation();

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
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setSuccessMsg(t("user_created_successfully"));
        setFormData({
          name: "",
          email: "",
          phone: "",
          national_id: "",
          role: "subscriber",
        });
      } else {
        setErrorMsg(t("failed_to_create_user"));
      }
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message || t("failed_to_create_user")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-20 p-6 flex justify-center items-center">
      <div className="bg-white w-full max-w-xl p-6 rounded-2xl shadow-md border border-gray-200">

        <h2 className="text-2xl font-semibold mb-6 text-center text-green-700 tracking-tight">
          {t("create_new_user")}
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
            <label className="block mb-1 font-medium text-gray-800 text-base">{t("name")}</label>
            <input
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg text-base bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-400 outline-none transition"
              placeholder={t("enter_name")}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-800 text-base">{t("email")}</label>
            <input
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg text-base bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-400 outline-none transition"
              placeholder={t("enter_email")}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-800 text-base">{t("phone")}</label>
            <input
              name="phone"
              type="text"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg text-base bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-400 outline-none transition"
              placeholder={t("enter_phone")}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-800 text-base">{t("national_id")}</label>
            <input
              name="national_id"
              type="text"
              required
              value={formData.national_id}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg text-base bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-400 outline-none transition"
              placeholder={t("enter_national_id")}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-800 text-base">{t("role")}</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg text-base bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-400 outline-none transition"
            >
              {roles.map((r) => (
                <option key={r} value={r}>
                  {t(r)}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white text-base font-semibold py-3 rounded-lg transition disabled:opacity-50 shadow"
          >
            {loading ? t("creating") : t("create_user")}
          </button>
        </form>
      </div>
    </div>
  );
}
