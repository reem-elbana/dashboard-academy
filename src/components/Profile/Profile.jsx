import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageSaving, setImageSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [imageSuccess, setImageSuccess] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const fileInputRef = useRef(null);
  const { t } = useTranslation();
  const token = localStorage.getItem("token");

  // جلب بيانات المستخدم
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(
          "https://generous-optimism-production-4492.up.railway.app/api/me",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const result = await res.json();
        setUser(result.data);
        setFormData({
          name: result.data.name || "",
          email: result.data.email || "",
          phone: result.data.phone || "",
          national_id: result.data.national_id || "",
        });
        setProfileImagePreview(result.data.profile_image || null);
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchUser();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // اختيار الصورة (preview فقط)
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
      setImageSuccess(null);
      setError(null);
    }
  };

  // رفع الصورة (الطريقة الصحيحة 100%)
  const handleUploadImage = async () => {
    if (!selectedImage) {
      setError(t("please_select_image"));
      return;
    }

    setImageSaving(true);
    setImageSuccess(null);
    setError(null);

    try {
      const formPayload = new FormData();
      formPayload.append("profile_image", selectedImage);

      const res = await fetch(
        "https://generous-optimism-production-4492.up.railway.app/api/profile/image",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            // لا نضيف Content-Type أبدًا مع FormData
          },
          body: formPayload,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Upload failed");
      }

      const newImageUrl = data.data.profile_image;
      setUser((prev) => ({ ...prev, profile_image: newImageUrl }));
      setProfileImagePreview(newImageUrl);
      localStorage.setItem("profile_image", newImageUrl);
      setImageSuccess(t("profile_image_updated") || "تم رفع الصورة بنجاح");

      // تنظيف الإنبوت عشان تقدر ترفع نفس الصورة تاني
      setSelectedImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "فشل رفع الصورة");
    } finally {
      setImageSaving(false);
    }
  };

  // حفظ البيانات النصية
  const handleSaveData = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(
        "https://generous-optimism-production-4492.up.railway.app/api/profile",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      setUser(data.data);
      setSuccess(t("profile_updated_success") || "تم حفظ التغييرات");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-20 text-lg">{t("loading") || "جاري التحميل..."}</div>;
  }

  return (
<div className="min-h-screen py-6 px-4">
  <div className="max-w-6xl mx-auto">
    <div className="bg-gray-100 rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="p-5 md:p-7">

        {/* Profile Image + Fields */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Profile Image */}
          <div className="text-center lg:text-left">
            <div className="relative inline-block">
              <img
                src={profileImagePreview || "https://via.placeholder.com/100"}
                className="w-24 h-24 rounded-full object-cover border-3 border-white shadow-md shadow-green-600 mx-auto lg:mx-0"
              />
              <div className="absolute inset-0 rounded-full shadow-xl blur-xl -z-10 opacity-40"></div>
            </div>  

            <div className="mt-4 space-y-2.5">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="block w-full text-xs text-gray-600 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-green-600 file:text-white hover:file:bg-green-800 cursor-pointer"
              />
              <button
                onClick={handleUploadImage}
                disabled={imageSaving}
                className="w-52 py-2 text-sm font-medium bg-green-600 hover:bg-green-900 text-white rounded-lg disabled:opacity-50 transition"
              >
                {imageSaving ? t("uploading") : t("upload_image")}
              </button>
              {imageSuccess && (
                <p className="text-sm text-gray-600 text-start">{imageSuccess}</p>
              )}
            </div>
          </div>

          {/* Editable Fields */}
          <div className="lg:col-span-2 space-y-4">
            <div className="grid sm:grid-cols-2 gap-3.5">
              {["name", "email", "phone", "national_id"].map((field) => (
                <div key={field} className="space-y-1">
                  <label className="block text-sm font-semibold text-gray-700">
                    {t(field)}
                  </label>
                  <input
                    type={field === "email" ? "email" : "text"}
                    name={field}
                    value={formData[field] || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 transition"
                    placeholder={t(field)}
                  />
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleSaveData}
                disabled={saving}
                className="px-6 py-2 text-sm font-semibold bg-green-600 hover:bg-green-900 text-white rounded-lg disabled:opacity-50 transition"
              >
                {saving ? t("saving") : t("save_changes")}
              </button>
              {success && <span className="text-xs text-gray-600">{success}</span>}
              {error && <span className="text-xs text-red-600">{error}</span>}
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="mt-7 pt-6 border-t border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-4">{t("account_info")}</h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { label: t("user_id"), value: user?.id || "-" },
              { label: t("role"), value: user?.role || "-" },
              { label: t("remaining_sessions"), value: user?.remaining_sessions || 0 },
              { label: t("subscription_expires"), value: user?.subscription_expires_at ? new Date(user.subscription_expires_at).toLocaleDateString("en-US") : "-" },
              { label: t("account_status"), value: user?.is_active ? t("active") : t("inactive") },
              { label: t("last_login"), value: user?.last_login_at ? new Date(user.last_login_at).toLocaleString("en-US") : "-" },
              { label: t("valid_subscription"), value: user?.has_valid_subscription ? t("yes") : t("no") },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
              >
                <p className="text-xs font-medium text-gray-600">{item.label}</p>
                <p
                  className={`text-sm font-semibold mt-0.5 ${
                    item.label === t("remaining_sessions") ? "text-rose-600" : "text-gray-900"
                  }`}
                >
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  </div>
</div>

  );
}