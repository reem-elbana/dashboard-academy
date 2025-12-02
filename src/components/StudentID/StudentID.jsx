import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";
import { useTranslation } from "react-i18next";
import i18n from './../../i18n/index';

export default function StudentID() {
  const { token } = useContext(AuthContext);
  const { t } = useTranslation();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper function to get earliest expiry date
  const getEarliestExpiry = (subscriptions) => {
    if (!subscriptions || subscriptions.length === 0) return null;
    const validSubs = subscriptions.filter(sub => sub.has_valid_subscription);
    if (validSubs.length === 0) return null;
    return validSubs.sort((a, b) => new Date(a.subscription_expires_at) - new Date(b.subscription_expires_at))[0];
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return t("not_provided");
    return new Date(dateString).toLocaleDateString(
      i18n.language === 'ar' ? 'ar-EG' : 'en-US',
      { day: "numeric", month: "long", year: "numeric" }
    );
  };

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // جلب بيانات المستخدم من dashboard
        const dashboardRes = await axios.get(
          "https://generous-optimism-production-4492.up.railway.app/api/subscriber/dashboard",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = dashboardRes.data?.data;
        setUserData(data.user);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>{t("loading")}...</p>
      </div>
    );
  }

  if (!userData) {
    return <p className="text-center py-12">{t("fetch_error")}</p>;
  }

  return (
    <div className="min-h-screen py-8 px-4">
      {/* بطاقة الطالب - نفس التصميم السابق المحسّن */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">

          <div className="relative p-10 ">
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
              <div className="w-28 h-28 rounded-full border-6 border-white shadow-2xl overflow-hidden bg-gray-200">
                <img
                  src={userData.profile_image ? `https://generous-optimism-production-4492.up.railway.app/storage/${userData.profile_image}` : "https://via.placeholder.com/100"}
                  alt={userData.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="text-center mt-16">
              <h2 className="text-2xl font-bold text-gray-900">{userData.name}</h2>
              <p className="text-gray-500 text-sm mt-1">{t("student_id")}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-500">{t("email")}</p>
                  <p className="font-medium text-gray-900">{userData.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-500">{t("phone")}</p>
                  <p className="font-medium text-gray-900">{userData.phone || t("not_provided")}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-500">{t("national_id")}</p>
                  <p className="font-medium text-gray-900">{userData.national_id || t("not_provided")}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-500">{t("subscription_expires")}</p>
                  <p className="font-medium text-gray-900">
                    {userData.category_subscriptions && userData.category_subscriptions.length > 0
                      ? new Date(userData.category_subscriptions[0].subscription_expires_at).toLocaleDateString(
                          i18n.language === 'ar' ? 'ar-EG' : 'en-US',
                          { day: "numeric", month: "long", year: "numeric" }
                        )
                      : t("not_provided")}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <p className="text-gray-600 text-sm font-medium">{t("remaining_sessions")}</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">
                  {userData.category_subscriptions && userData.category_subscriptions.length > 0
                    ? userData.category_subscriptions.reduce((total, sub) => total + sub.remaining_sessions, 0)
                    : 0}
                </p>
              </div>

              <div className={`rounded-xl p-6 border ${
                userData.category_subscriptions && userData.category_subscriptions.some(sub => sub.has_valid_subscription)
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}>
                <p className="text-sm font-medium text-gray-700">
                  {userData.category_subscriptions && userData.category_subscriptions.some(sub => sub.has_valid_subscription)
                    ? t("subscription_active")
                    : t("subscription_expired")}
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  {t("expires_on")}: {formatDate(getEarliestExpiry(userData.category_subscriptions)?.subscription_expires_at)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
