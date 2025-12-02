import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function CreateTrainingSession() {
  const { t } = useTranslation();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration_minutes: "",
    session_date: "",
    start_time: "",
    end_time: "",
    location: "",
    max_participants: "",
    category_id: "",
    qr_duration_minutes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const baseUrl = "https://generous-optimism-production-4492.up.railway.app/api";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    // تحويل بعض القيم من string لـ int
    const payload = {
      ...formData,
      duration_minutes: Number(formData.duration_minutes),
      max_participants: Number(formData.max_participants),
      category_id: Number(formData.category_id),
      qr_duration_minutes: Number(formData.qr_duration_minutes),
    };

    try {
      const res = await axios.post(`${baseUrl}/admin/training-sessions`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.data.success) {
        setSuccessMessage(res.data.message || t("session_created_success"));
        setFormData({
          title: "",
          description: "",
          duration_minutes: "",
          session_date: "",
          start_time: "",
          end_time: "",
          location: "",
          max_participants: "",
          category_id: "",
          qr_duration_minutes: "",
        });
        // navigate(`/training-sessions/${res.data.data.id}`);
      } else {
        setError(t("failed_create_session"));
      }
    } catch (err) {
      setError(err.response?.data?.message || t("error_create_session"));
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">{t("create_training_session")}</h2>

      {error && <p className="mb-4 text-red-600 font-semibold">{error}</p>}
      {successMessage && <p className="mb-4 text-green-600 font-semibold">{successMessage}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1" htmlFor="title">{t("title")} *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block font-medium mb-1" htmlFor="description">{t("description")}</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1" htmlFor="duration_minutes">{t("duration_minutes")} *</label>
            <input
              type="number"
              id="duration_minutes"
              name="duration_minutes"
              value={formData.duration_minutes}
              onChange={handleChange}
              required
              min={1}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block font-medium mb-1" htmlFor="qr_duration_minutes">{t("qr_duration_minutes")}</label>
            <input
              type="number"
              id="qr_duration_minutes"
              name="qr_duration_minutes"
              value={formData.qr_duration_minutes}
              onChange={handleChange}
              min={0}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1" htmlFor="session_date">{t("session_date")} *</label>
            <input
              type="date"
              id="session_date"
              name="session_date"
              value={formData.session_date}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block font-medium mb-1" htmlFor="location">{t("location")}</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1" htmlFor="start_time">{t("start_time")} *</label>
            <input
              type="time"
              id="start_time"
              name="start_time"
              value={formData.start_time}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block font-medium mb-1" htmlFor="end_time">{t("end_time")} *</label>
            <input
              type="time"
              id="end_time"
              name="end_time"
              value={formData.end_time}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1" htmlFor="max_participants">{t("max_participants")}</label>
            <input
              type="number"
              id="max_participants"
              name="max_participants"
              value={formData.max_participants}
              onChange={handleChange}
              min={0}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block font-medium mb-1" htmlFor="category_id">{t("category_id")} *</label>
            <input
              type="number"
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              required
              min={1}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full mt-4 py-2 font-semibold rounded ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          {loading ? t("creating") : t("create_session")}
        </button>
      </form>
    </div>
  );
}
