import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";
import { useTranslation } from "react-i18next";
import i18n from './../../i18n/index';

export default function StudentID() {
  const { token } = useContext(AuthContext);
  const { t } = useTranslation();

  const [userData, setUserData] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

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

        // جلب الحصص المتاحة
        const sessionsRes = await axios.get(
          "https://generous-optimism-production-4492.up.railway.app/api/subscriber/training-sessions",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setSessions(sessionsRes.data?.data?.available_sessions || []);

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
    <div className="  py-8 px-4">
  {/* بطاقة الطالب - نفس التصميم السابق المحسّن */}
  <div className="max-w-6xl mx-auto">
      {/* <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        
        <div className="relative p-10 ">
          <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
            <div className="w-28 h-28 rounded-full border-6 border-white shadow-2xl overflow-hidden bg-gray-200">
              <img
                src={`https://generous-optimism-production-4492.up.railway.app/storage/${userData.profile_image}`}
                alt={userData.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="text-center mt-16">
            <h2 className="text-2xl font-bold text-gray-900">{userData.name}</h2>
            <p className="text-gray-500 text-sm mt-1">{userData.role}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500">البريد الإلكتروني</p>
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
                <p className="text-gray-500">رقم الهاتف</p>
                <p className="font-medium text-gray-900">{userData.phone}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <p className="text-gray-600 text-sm font-medium">{t("remaining_sessions")}</p>
              <p className="text-4xl font-bold text-gray-900 mt-2">{userData.remaining_sessions}</p>
            </div>

            <div className={`rounded-xl p-6 border ${userData.has_valid_subscription ? 'bg-blue-50 border-blue-200' : 'bg-red-50 border-red-200'}`}>
              <p className="text-sm font-medium text-gray-700">
                {userData.has_valid_subscription ? "الاشتراك ساري" : "الاشتراك منتهي"}
              </p>
              <p className="text-xs text-gray-600 mt-2">
                انتهاء في: {new Date(userData.subscription_expires_at).toLocaleDateString("ar-EG", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div> */}

    {/* الجلسات المتاحة كـ Cards بدل الجدول */}
    {/* <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center md:text-right">
        {t("available_sessions")}
      </h2>

      {sessions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((item, index) => {
            const session = item.session;
            const date = new Date(item.date);

            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden group"
              >
                <div className="bg-gradient-to-br from-gray-700 to-gray-900 p-5 text-white">
                  <h3 className="text-lg font-bold leading-tight">{session.title}</h3>
                  <p className="text-sm opacity-90 mt-1">
                    {date.toLocaleDateString("ar-EG", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </p>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3 text-gray-700">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">
                      {session.start_time} - {session.end_time}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-700">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{session.location || "غير محدد"}</span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-700">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{session.duration_minutes || "-"} دقيقة</span>
                  </div>
                </div>

                <div className="px-6 pb-5">
                  <button className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors">
                    حجز الجلسة
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-gray-400 text-xl font-medium">
            {t("no_sessions_available")}
          </div>
          <p className="text-gray-500 mt-2">سيتم إشعارك فور توفر جلسات جديدة</p>
        </div>
      )}
    </div> */}
    <div className="mt-8">
  <h2 className="text-3xl font-bold mb-10 ">
    {t("Available_sessions")}
  </h2>

  {sessions.length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sessions.map((item, index) => {
        const session = item.session;
        const date = new Date(item.date);

        return (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden group"
          >
            {/* Header */}
            <div className="bg-gradient-to-br from-green-700 to-green-900 p-5 text-white">
              <h3 className="text-lg font-bold leading-tight">{session.title}</h3>
              <p className="text-sm opacity-90 mt-1">
                {date.toLocaleDateString(i18n.language, {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </p>
            </div>

            {/* Info */}
            <div className="p-6 space-y-4 text-gray-700">
              {/* Time */}
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-medium">
                  {session.start_time} - {session.end_time}
                </span>
              </div>

              {/* Location */}
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>{session.location || t("not_specified")}</span>
              </div>

              {/* Duration */}
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{session.duration_minutes || "-"} {t("minutes")}</span>
              </div>
            </div>

            {/* Button */}
            {/* <div className="px-6 pb-5">
              <button className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors">
                {t("book_session")}
              </button>
            </div> */}
          </div>
        );
      })}
    </div>
  ) : (
    <div className="text-center py-20">
      <div className="text-gray-400 text-xl font-medium">
        {t("no_sessions_available")}
      </div>
      <p className="text-gray-500 mt-2">{t("sessions_notification_message")}</p>
    </div>
  )}
</div>

  </div>
</div>
  );
}