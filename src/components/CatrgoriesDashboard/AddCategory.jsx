import React, { useState, useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";  // <-- استيراد useTranslation

export default function AddCategory() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const { t } = useTranslation();  // <-- الحصول على دالة الترجمة

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        "https://generous-optimism-production-4492.up.railway.app/api/admin/categories",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            description,
            image,
            is_active: isActive,
          }),
        }
      );

      const data = await res.json();

      if (res.ok && data.success) {
        alert(t("category_created_successfully"));  // ترجمة رسالة النجاح
        navigate("/admin/categories");
      } else {
        setError(data.message || t("failed_to_create_category")); // ترجمة رسالة الخطأ
      }
    } catch (err) {
      setError(t("error_occurred_while_creating_category")); // ترجمة رسالة الخطأ
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">{t("create_new_category")}</h2>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">{t("category_name")}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">{t("description")}</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">{t("image_url")}</label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder={t("image_placeholder")}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isActive}
            onChange={() => setIsActive(!isActive)}
            id="active"
          />
          <label htmlFor="active">{t("active")}</label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          {loading ? t("adding") : t("add_category")}
        </button>
      </form>
    </div>
  );
}
