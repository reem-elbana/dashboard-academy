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

  const getEarliestExpiry = (subscriptions) => {
    if (!subscriptions || subscriptions.length === 0) return null;
    const validSubs = subscriptions.filter(sub => sub.has_valid_subscription);
    if (validSubs.length === 0) return null;
    return validSubs.sort((a, b) => new Date(a.subscription_expires_at) - new Date(b.subscription_expires_at))[0];
  };

  const formatDate = (dateString) => {
    if (!dateString) return t("not_provided");
    return new Date(dateString).toLocaleDateString(
      i18n.language === 'ar' ? 'ar-EG' : 'en-US',
      { day: "numeric", month: "short", year: "numeric" }
    );
  };

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      setLoading(true);
      try {
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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-500 text-base">{t("loading")}...</p>
      </div>
    );
  }

  if (!userData) {
    return <p className="text-center py-12 text-red-400 font-medium">{t("fetch_error")}</p>;
  }

  return (
    <div className="min-h-screen bg-white py-10 px-4 flex justify-center">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-md border border-gray-200">
        {/* Header */}
        <div className="flex flex-col items-center pt-8 pb-6 border-b border-gray-100">
          <div className="w-20 h-20 rounded-full border-4 border-gray-300 overflow-hidden bg-gray-100 shadow-sm">
            <img
              src={userData.profile_image ? `https://generous-optimism-production-4492.up.railway.app/storage/${userData.profile_image}` : "https://via.placeholder.com/80"}
              alt={userData.name}
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-gray-900">{userData.name}</h2>
          <p className="text-gray-500 text-sm mt-1">{t("student_id")}</p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 px-6 pt-6">
          <InfoItem
            icon={
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
            label={t("email")}
            value={userData.email}
          />

          <InfoItem
            icon={
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            }
            label={t("phone")}
            value={userData.phone || t("not_provided")}
          />

          <InfoItem
            icon={
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
              </svg>
            }
            label={t("national_id")}
            value={userData.national_id || t("not_provided")}
          />

          <InfoItem
            icon={
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
            label={t("subscription_expires")}
            value={
              userData.category_subscriptions && userData.category_subscriptions.length > 0
                ? formatDate(userData.category_subscriptions[0].subscription_expires_at)
                : t("not_provided")
            }
          />
        </div>

        {/* Summary Boxes */}
        <div className="px-6 py-6 grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-gray-100">
          <div className="bg-blue-50 rounded-lg p-5 flex flex-col items-center">
            <p className="text-blue-700 font-semibold">{t("remaining_sessions")}</p>
            <p className="text-3xl font-bold mt-2 text-blue-900">
              {userData.category_subscriptions && userData.category_subscriptions.length > 0
                ? userData.category_subscriptions.reduce((total, sub) => total + sub.remaining_sessions, 0)
                : 0}
            </p>
          </div>

          <div className={`rounded-lg p-5 flex flex-col items-center ${
            userData.category_subscriptions && userData.category_subscriptions.some(sub => sub.has_valid_subscription)
              ? 'bg-green-50 text-green-800'
              : 'bg-red-50 text-red-800'
          }`}>
            <p className="font-semibold text-lg">
              {userData.category_subscriptions && userData.category_subscriptions.some(sub => sub.has_valid_subscription)
                ? t("subscription_active")
                : t("subscription_expired")}
            </p>
            <p className="mt-1 text-sm font-medium">
              {t("expires_on")}: {formatDate(getEarliestExpiry(userData.category_subscriptions)?.subscription_expires_at)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-md border border-gray-200">
      <div className="w-10 h-10 flex items-center justify-center rounded-md bg-blue-100 text-blue-600">
        {icon}
      </div>
      <div>
        <p className="text-gray-600 text-sm font-medium">{label}</p>
        <p className="text-gray-900 text-base">{value}</p>
      </div>
    </div>
  );
}
