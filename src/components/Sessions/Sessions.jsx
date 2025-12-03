import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";
import { useTranslation } from "react-i18next";
import i18n from './../../i18n/index';

export default function sessions() {
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
