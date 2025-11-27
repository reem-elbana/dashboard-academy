import React, { useState, useEffect } from "react";
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
  const { t } = useTranslation();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(
          "https://generous-optimism-production-4492.up.railway.app/api/me",
          { headers: { "Authorization": `Bearer ${token}` } }
        );
        const result = await res.json();
        setUser(result.data);
        setFormData({
          name: result.data.name,
          email: result.data.email,
          phone: result.data.phone,
          national_id: result.data.national_id
        });
        setProfileImagePreview(result.data.profile_image || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
      setProfileImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

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
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");
      setUser(data.data);
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUploadImage = async () => {
    if (!selectedImage) return;
    setImageSaving(true);
    setImageSuccess(null);
    try {
      const formPayload = new FormData();
      formPayload.append("profile_image", selectedImage);

      const res = await fetch(
        "https://generous-optimism-production-4492.up.railway.app/api/profile/image",
        {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}` },
          body: formPayload
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Image upload failed");
      setUser((prev) => ({ ...prev, profile_image: data.data.profile_image }));
      setImageSuccess("Profile image updated successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setImageSaving(false);
    }
  };

  if (loading) return <div className="text-center mt-20">Loading...</div>;

  return (
<div className=" py-10">

  <div className="max-w-7xl mx-auto px-6   ">

    
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 md:p-10">

      <div className="grid md:grid-cols-3 gap-10">

        {/* الصورة + رفع */}
        <div className="text-center md:text-left">
          <img
            src={profileImagePreview || user?.profile_image || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-36 h-36 rounded-full object-cover border-4 border-gray-300 mx-auto md:mx-0"
          />

          <div className="mt-6 space-y-3">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-emerald-600 file:text-white file:text-sm hover:file:bg-emerald-700"
            />
            <button
              onClick={handleUploadImage}
              disabled={imageSaving}
              className="w-full py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-60 transition"
            >
              {imageSaving ? t("uploading") : t("upload_image")}
            </button>
            {imageSuccess && <p className="text-green-600 text-sm">{imageSuccess}</p>}
          </div>
        </div>

        {/* الحقول القابلة للتعديل */}
        <div className="md:col-span-2 space-y-6">
          <div className="grid sm:grid-cols-2 gap-5">
            {["name", "email", "phone", "national_id"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {t(field.replace("_", " "))}
                </label>
                <input
                  type={field === "email" ? "email" : "text"}
                  name={field}
                  value={formData[field] || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 transition"
                />
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 ">
            <button
              onClick={handleSaveData}
              disabled={saving}
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold rounded-lg transition"
            >
              {saving ? t("saving") : t("save_changes")}
            </button>
            {success && <span className="text-green-600 font-medium">{success}</span>}
            {error && <span className="text-red-600 font-medium">{error}</span>}
          </div>
        </div>
      </div>

      {/* معلومات للقراءة فقط */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("account_info")}</h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
          <div>
            <p className="text-gray-600">{t("role")}</p>
            <p className="font-semibold text-gray-900">{user?.role || "-"}</p>
          </div>
          <div>
            <p className="text-gray-600">{t("remaining_sessions")}</p>
            <p className="font-bold text-emerald-600 text-xl">{user?.remaining_sessions || 0}</p>
          </div>
          <div>
            <p className="text-gray-600">{t("subscription_expires")}</p>
            <p className="font-semibold text-gray-900">
              {user?.subscription_expires_at ? new Date(user.subscription_expires_at).toLocaleDateString("ar-EG") : "-"}
            </p>
          </div>
          <div>
            <p className="text-gray-600">{t("account_status")}</p>
            <p className={`font-semibold ${user?.is_active ? "text-green-600" : "text-red-600"}`}>
              {user?.is_active ? t("active") : t("inactive")}
            </p>
          </div>
          <div>
            <p className="text-gray-600">{t("last_login")}</p>
            <p className="font-semibold text-gray-900">
              {user?.last_login_at ? new Date(user.last_login_at).toLocaleString("ar-EG") : "-"}
            </p>
          </div>
          <div>
            <p className="text-gray-600">{t("valid_subscription")}</p>
            <p className={`font-semibold ${user?.has_valid_subscription ? "text-green-600" : "text-gray-500"}`}>
              {user?.has_valid_subscription ? t("yes") : t("no")}
            </p>
          </div>
        </div>
      </div>

    </div>
  </div>
</div>

  );
}

const Info = ({ label, value, valueColor }) => (
  <div className="p-4 bg-indigo-50 rounded-lg">
    <h3 className="font-semibold text-indigo-700 mb-1">{label}</h3>
    <p className={valueColor ? `font-medium text-${valueColor}-600` : ""}>{value}</p>
  </div>
);