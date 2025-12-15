import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";  // استيراد

export default function CreateBanner() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const { t } = useTranslation(); // hook الترجمة

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    link: "",
    is_active: true,
    start_date: "",
    end_date: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

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
    setError(null);
    setMessage(null);

    try {
      const response = await axios.post(
        "https://generous-optimism-production-4492.up.railway.app/api/admin/banners",
        {
          title: formData.title,
          description: formData.description,
          image_url: formData.image_url,
          link: formData.link,
          is_active: formData.is_active,
          start_date: formData.start_date,
          end_date: formData.end_date,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setMessage(t("bannerCreatedSuccess"));
        setFormData({
          title: "",
          description: "",
          image_url: "",
          link: "",
          is_active: true,
          start_date: "",
          end_date: "",
        });
      } else {
        setError(t("failedToCreateBanner"));
      }
    } catch (err) {
      setError(err.response?.data?.message || t("anErrorOccurred"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md font-sans">
      <h2 className="text-center text-2xl font-semibold mb-6 text-gray-800">
        {t("createNewBanner")}
      </h2>

      {message && (
        <p className="text-center mb-4 text-green-600 font-medium">{message}</p>
      )}
      {error && (
        <p className="text-center mb-4 text-red-600 font-medium">{error}</p>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block mb-1 font-semibold text-gray-700"
          >
            {t("title")}:
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            placeholder={t("enterBannerTitle")}
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block mb-1 font-semibold text-gray-700"
          >
            {t("description")}:
          </label>
          <textarea
            id="description"
            name="description"
            required
            placeholder={t("enterDescription")}
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-y min-h-[80px]"
          />
        </div>

        <div>
          <label
            htmlFor="image_url"
            className="block mb-1 font-semibold text-gray-700"
          >
            {t("imageUrl")}:
          </label>
          <input
            id="image_url"
            name="image_url"
            type="url"
            required
            placeholder="https://example.com/image.jpg"
            value={formData.image_url}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label
            htmlFor="link"
            className="block mb-1 font-semibold text-gray-700"
          >
            {t("linkOptional")}:
          </label>
          <input
            id="link"
            name="link"
            type="url"
            placeholder="https://example.com"
            value={formData.link}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            id="is_active"
            name="is_active"
            type="checkbox"
            checked={formData.is_active}
            onChange={handleChange}
            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
          />
          <label htmlFor="is_active" className="font-semibold text-gray-700">
            {t("isActive")}
          </label>
        </div>

        <div>
          <label
            htmlFor="start_date"
            className="block mb-1 font-semibold text-gray-700"
          >
            {t("startDate")}:
          </label>
          <input
            id="start_date"
            name="start_date"
            type="date"
            value={formData.start_date}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label
            htmlFor="end_date"
            className="block mb-1 font-semibold text-gray-700"
          >
            {t("endDate")}:
          </label>
          <input
            id="end_date"
            name="end_date"
            type="date"
            value={formData.end_date}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 bg-forsan-dark hover:bg-blue-900 text-white py-3 rounded-md font-semibold  transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? t("creating") : t("createBanner")}
        </button>
      </form>

      <button
        type="button"
        onClick={() => navigate("/admin/banners")}
        className="mb-6 px-4 py-2  text-green-700 rounded-md transition mt-4 text-right"
      >
        &larr; {t("backToBanners")}
      </button>
    </div>
  );
}
