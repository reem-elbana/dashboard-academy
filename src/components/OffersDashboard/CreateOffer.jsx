import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";
import { useTranslation } from "react-i18next";
import "../../i18n";

export default function CreateOffer() {
  const { token } = useContext(AuthContext);
  const { t } = useTranslation();

  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    original_price: "",
    discounted_price: "",
    discount_percentage: "",
    starts_at: "",
    expires_at: "",
    max_uses: "",
    is_active: false,
    category_id: "",
  });

  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    axios
      .get(
        "https://generous-optimism-production-4492.up.railway.app/api/admin/categories",
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => setCategories(res.data.categories || []))
      .catch(() => setError(t("failed_load_categories")));
  }, [token, t]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setError(t("please_upload_image"));
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const fd = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key === "is_active") {
          fd.append(key, formData.is_active ? "1" : "0");
        } else {
          fd.append(key, formData[key]);
        }
      });

      fd.append("image", image);

      await axios.post(
        "https://generous-optimism-production-4492.up.railway.app/api/admin/offers",
        fd,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccessMsg(t("offer_created_success"));
      setFormData({
        title: "",
        description: "",
        original_price: "",
        discounted_price: "",
        discount_percentage: "",
        starts_at: "",
        expires_at: "",
        max_uses: "",
        is_active: false,
        category_id: "",
      });
      setImage(null);
    } catch (err) {
      console.log(err.response?.data);
      const msg = err.response?.data?.message || t("unexpected_error");
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        {t("create_new_offer")}
      </h2>

      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded mb-4 text-center">
          {error}
        </div>
      )}
      {successMsg && (
        <div className="p-3 bg-green-100 text-green-700 rounded mb-4 text-center">
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          type="text"
          placeholder={t("offer_title")}
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <textarea
          name="description"
          placeholder={t("description")}
          value={formData.description}
          onChange={handleChange}
          required
          rows={3}
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <div className="grid grid-cols-2 gap-3">
          <input
            name="original_price"
            type="number"
            placeholder={t("original_price")}
            value={formData.original_price}
            onChange={handleChange}
            required
            className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            name="discounted_price"
            type="number"
            placeholder={t("discounted_price")}
            value={formData.discounted_price}
            onChange={handleChange}
            required
            className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <input
          name="discount_percentage"
          type="number"
          placeholder={t("discount_percentage")}
          value={formData.discount_percentage}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <div className="grid grid-cols-2 gap-3">
          <input
            name="starts_at"
            type="date"
            value={formData.starts_at}
            onChange={handleChange}
            required
            className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            name="expires_at"
            type="date"
            value={formData.expires_at}
            onChange={handleChange}
            required
            className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <input
          name="max_uses"
          type="number"
          placeholder={t("max_uses")}
          value={formData.max_uses}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <select
          name="category_id"
          value={formData.category_id}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">{t("select_category")}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_active"
            checked={formData.is_active}
            onChange={handleChange}
            className="w-4 h-4"
          />
          <span className="select-none">{t("activate_offer")}</span>
        </label>

        <div>
          <label className="font-semibold block mb-1">{t("offer_image")}</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            required
            className="w-full"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-forsan-green text-white py-2 rounded hover:bg-forsan-green-dark transition"
        >
          {loading ? t("submitting") : t("create_offer")}
        </button>
      </form>
    </div>
  );
}
