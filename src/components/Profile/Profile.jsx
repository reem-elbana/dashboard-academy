import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [formData, setFormData] = useState({});
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [qrLoginSuccess, setQrLoginSuccess] = useState(null); // إضافة متغير جديد

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageSaving, setImageSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [imageSuccess, setImageSuccess] = useState(null);

  const fileInputRef = useRef(null);
  const { t } = useTranslation();
  const token = localStorage.getItem("token");

  // QR Login Logic - أضف هذا في البداية
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const qrToken = urlParams.get('token');
    const login = urlParams.get('login');

    if (qrToken && login === 'qr') {
      fetch("https://generous-optimism-production-4492.up.railway.app/api/verify-qr-token?token=" + qrToken)
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            localStorage.setItem("token", data.data.token);
            localStorage.setItem("user", JSON.stringify(data.data.user));
            localStorage.setItem("role", data.data.user.role || "subscriber");

            // Dispatch custom event to update AuthContext
            window.dispatchEvent(new Event("authChange"));

            window.history.replaceState({}, document.title, window.location.pathname);
            
            setUser(data.data.user);
            setFormData({
              name: data.data.user.name || "",
              email: data.data.user.email || "",
              phone: data.data.user.phone || "",
              national_id: data.data.user.national_id || "",
            });
            setProfileImagePreview(data.data.user.profile_image || null);
            
            setQrLoginSuccess("تم تسجيل الدخول بنجاح عبر QR Code!");
            setTimeout(() => setQrLoginSuccess(null), 5000);
          }
        })
        .catch(error => console.error('QR login error:', error));
    }
  }, []);

  // جلب بيانات المستخدم
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("https://generous-optimism-production-4492.up.railway.app/api/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await res.json();
        if (result.data) {
          setUser(result.data);
          setFormData({
            name: result.data.name || "",
            email: result.data.email || "",
            phone: result.data.phone || "",
            national_id: result.data.national_id || "",
          });
          setProfileImagePreview(result.data.profile_image || null);

          // Check if first login
          if (result.data.is_first_login) {
            navigate('/set-initial-password');
          }
        }
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };
    if (token) fetchUser();
  }, [token]);

  // جلب dashboard
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("https://generous-optimism-production-4492.up.railway.app/api/subscriber/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await res.json();
        if (result.success) {
          const enrichedSessions = result.data.current_week_sessions.map((s) => ({
            ...s,
            attended: s.attended || false,
            missed: s.missed || false,
          }));
          setDashboardData({ ...result.data, current_week_sessions: enrichedSessions });
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchDashboard();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
      setImageSuccess(null);
      setError(null);
    }
  };

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

      const res = await fetch("https://generous-optimism-production-4492.up.railway.app/api/profile/image", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formPayload,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");

      // تحديث user فقط بعد النجاح
      setUser((prev) => ({ ...prev, profile_image: data.data.profile_image }));
      setProfileImagePreview(data.data.profile_image);
      localStorage.setItem("profile_image", data.data.profile_image);
      setImageSuccess(t("profile_image_updated") || "تم رفع الصورة بنجاح");
      setSelectedImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setError(err.message || "فشل رفع الصورة");
    } finally {
      setImageSaving(false);
    }
  };

  const handleSaveData = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("https://generous-optimism-production-4492.up.railway.app/api/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      // تحديث user بعد حفظ الفورم فقط
      setUser(data.data);
      setSuccess(t("profile_updated_success") || "تم حفظ التغييرات");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center mt-20 text-lg">{t("loading") || "جاري التحميل..."}</div>;

  return (
    
    
      
    <div className="min-h-screen py-6 px-4">

{qrLoginSuccess && (
        <div className="max-w-6xl mx-auto mb-4">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <div className="flex items-center">
              <i className="fas fa-check-circle mr-2"></i>
              {qrLoginSuccess}
            </div>
          </div>
        </div>
      )}
      <div className="max-w-6xl mx-auto">
    <div className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="p-5 md:p-7">
            {/* Profile + Form */}
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="text-center lg:text-left relative inline-block">
              <div className="w-36 h-36 rounded-full p-1 mx-auto lg:mx-0 bg-gradient-to-tr from-green-400 to-green-600 animate-pulse-slow shadow-xl">

                  <img
                    src={profileImagePreview || "https://via.placeholder.com/100"}
                  className="w-full h-full rounded-full object-cover shadow-lg"
                  />
              {/* <div className="absolute inset-0 rounded-full shadow-xl blur-2xl opacity-40 bg-green-400 -z-10 animate-ping-slow"></div> */}
                </div>
            <div className="mt-6 space-y-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                className="block w-full text-xs text-gray-600 file:mr-2 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-gradient-to-r file:from-green-500 file:to-green-700 file:text-white hover:file:from-green-600 hover:file:to-green-800 cursor-pointer transition"
                  />
                  <button
                    onClick={handleUploadImage}
                    disabled={imageSaving}
                className="w-[50%] py-2 text-sm font-semibold bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white rounded-full shadow-md hover:shadow-xl disabled:opacity-50 transition transform hover:scale-105"
                  >
                    {imageSaving ? t("uploading") : t("upload_image")}
                  </button>
                  
                  {imageSuccess && <p className="text-sm text-gray-600 text-start">{imageSuccess}</p>}
                </div>
              </div>

              {/* Form Fields */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid sm:grid-cols-2 gap-5">
                  {["name", "email", "phone", "national_id"].map((field) => (
                    <div key={field} className="space-y-1">
                      <label className="block text-sm font-semibold text-gray-700">{t(field)}</label>
                      <input
                        type={field === "email" ? "email" : "text"}
                        name={field}
                        value={formData[field] || ""}
                        onChange={handleChange}
                    className="w-full px-4 py-2 text-sm bg-white/80 border border-gray-300 rounded-2xl shadow-inner focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                        placeholder={t(field)}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleSaveData}
                    disabled={saving}
                className="px-6 py-2 text-sm font-semibold bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white rounded-2xl shadow-md hover:shadow-xl disabled:opacity-50 transition transform hover:scale-105"
                  >
                    {saving ? t("saving") : t("save_changes")}
                  </button>
                  {success && <span className="text-xs text-gray-600">{success}</span>}
                  {error && <span className="text-xs text-red-600">{error}</span>}
                </div>
              </div>
            </div>

            {/* Account Info */}
            {user && (
              <div className="mt-7 pt-6 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{t("Account_info")}</h2>
            <div className="grid grid-col-3 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div
                    onClick={() => navigate('/user/student-id')}
                    className="p-4 bg-blue-50 rounded-lg border shadow-md border-blue-200 hover:bg-blue-100 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                      </svg>
                      <p className="text-xs font-medium text-blue-600">{t("student_id")}</p>
                    </div>
                    <p className="text-sm font-semibold mt-0.5 text-blue-900">{t("view_card")}</p>
                  </div>
                  {[
                    { label: t("subscription_expires"), value: user.stats?.subscription_expires_at ? new Date(user.stats.subscription_expires_at).toLocaleDateString("en-US") : "-" },
                    { label: t("account_status"), value: user.is_active ? t("active") : t("inactive") },
                    { label: t("last_login"), value: user.last_login_at ? new Date(user.last_login_at).toLocaleString("en-US") : "-" },
                    { label: t("valid_subscription"), value: user.stats?.has_valid_subscription ? t("yes") : t("no") },
                  ].map((item, idx) => (
                <div key={idx} className="p-6 bg-white/60 backdrop-blur-lg rounded-2xl border border-gray-200 shadow-md hover:shadow-xl transition transform hover:scale-105">
                      <p className="text-xs font-medium text-gray-500">{item.label}</p>
                      <p className="text-sm font-semibold mt-0.5 text-gray-900">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Dashboard */}
            {/* {dashboardData && (
              <div className="mt-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
                  <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
                    <p className="text-sm font-medium text-red-500">{t("remaining_sessions")}</p>
                    <p className="text-2xl font-bold text-red-500 mt-2">{dashboardData.stats.remaining_sessions}</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
                    <p className="text-sm font-medium text-gray-600">{t("total_attendances")}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{dashboardData.stats.total_attendances}</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
                    <p className="text-sm font-medium text-gray-600">{t("profile_completion")}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{dashboardData.stats.profile_completion}%</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
                    <p className="text-sm font-medium text-gray-600">{t("subscription_status")}</p>
                    <p className="text-2xl font-bold text-green-600 mt-2">{dashboardData.stats.has_valid_subscription ? t("active") : t("inactive")}</p>
                  </div>
                </div>
              </div>
            )} */}
 {dashboardData && (
          <div className="mt-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {[
                { label: t("remaining_sessions"), value: dashboardData.stats.remaining_sessions, color: "red", icon: "🕒" },
                { label: t("total_attendances"), value: dashboardData.stats.total_attendances, color: "gray", icon: "📅" },
                { label: t("profile_completion"), value: dashboardData.stats.profile_completion + "%", color: "gray", icon: "✅" },
                { label: t("subscription_status"), value: dashboardData.stats.has_valid_subscription ? t("active") : t("inactive"), color: "green", icon: "💳" },
              ].map((card, idx) => (
                <div key={idx} className="bg-white/60 backdrop-blur-lg rounded-full border border-gray-200 shadow-md hover:shadow-xl p-3 flex flex-col items-center justify-center transition transform hover:scale-105">
                  <div className="text-4xl mb-2 animate-pulse">{card.icon}</div>
                  <p className={`text-sm font-medium text-${card.color}-500`}>{card.label}</p>
                  <p className={`text-2xl font-bold mt-1 text-${card.color}-600`}>{card.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
          </div>
        </div>
      </div>
    </div>
  );
}
