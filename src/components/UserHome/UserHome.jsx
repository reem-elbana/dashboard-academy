import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";
import { useTranslation } from "react-i18next";

export default function UserHome() {
  const { token } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { t } = useTranslation();

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  };
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "https://generous-optimism-production-4492.up.railway.app/api/subscriber/dashboard",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setData(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [token]);

  if (loading) return <p className="text-center mt-10">{t("loading")}...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  const { user, stats, current_week_sessions, recent_attendances, recommendations } = data || {};


  return (
    <div className="min-h-screen bg-gray-50">

      {/* Main Content – with top padding */}
      <main className="pt-10 pb-12 max-w-7xl mx-auto px-6">

        {/* Welcome + Quick Stats */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-gray-900">
            {t("welcome_back")}, <span className="text-green-600">{user?.name.split(" ")[0]}</span>
          </h2>
          <p className="text-gray-600 mt-1">{t("account_summary")}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <p className="text-sm font-medium text-gray-600">{t("remaining_sessions")}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.remaining_sessions || 0}</p>
            <p className="text-xs text-green-600 mt-2">{t("weekly_change")} +2</p>
          </div>
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <p className="text-sm font-medium text-gray-600">{t("total_attendances")}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{recent_attendances?.length || 0}</p>
            <p className="text-xs text-gray-500 mt-2">{t("this_month")}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <p className="text-sm font-medium text-gray-600">{t("profile_completion")}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.profile_completion}%</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-700"
                style={{ width: `${stats?.profile_completion || 0}%` }}
              ></div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <p className="text-sm font-medium text-gray-600">{t("subscription_status")}</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{stats?.has_valid_subscription ? t("active") : t("inactive")}</p>
            <p className="text-xs text-gray-500 mt-2">
              {t("expires")}: {new Date(stats?.subscription_expires_at).toLocaleDateString("en-GB")}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Current Week Sessions */}
          <div className="lg:col-span-2 space-y-8">

            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">{t("this_weeks_sessions")}</h3>
              </div>
              <div className="p-6">
                {current_week_sessions?.length > 0 ? (
                  <div className="space-y-4">
                    {current_week_sessions.map((cls) => (
                      <div key={cls.id} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
                        <div>
                          <p className="font-medium text-gray-900">{cls.name}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(cls.date).toLocaleDateString("en-GB", { weekday: 'long', month: 'short', day: 'numeric' })} 
                            {" • "} {formatTime(cls.date)}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {cls.remaining_sessions} {t("left")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-12">{t("no_sessions")}</p>
                )}
              </div>
            </div>

            {/* Recent Attendances */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">{t("recent_attendances")}</h3>
              </div>
              <div className="p-6">
                {recent_attendances?.length > 0 ? (
                  <div className="space-y-4">
                    {recent_attendances.slice(0, 5).map((att) => (
                      <div key={att.id} className="flex items-center justify-between py-3">
                        <div>
                          <p className="font-medium text-gray-900">{att.name}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(att.date).toLocaleDateString("en-GB")} at {formatTime(att.date)}
                          </p>
                        </div>
                        <span className="text-green-600 text-2xl">✓</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-12">{t("no_attendance_records")}</p>
                )}
              </div>
            </div>

          </div>

          {/* Recommendations / Alerts */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t("notifications")}</h3>
            <div className="space-y-4">
              {recommendations?.length > 0 ? (
                recommendations.map((rec, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-lg border ${
                      rec.priority === "high" 
                        ? "bg-red-50 border-red-300" 
                        : rec.priority === "medium"
                        ? "bg-amber-50 border-amber-300"
                        : "bg-green-50 border-green-300"
                    }`}
                  >
                    <p className="font-medium text-gray-900">{rec.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{rec.message}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">{t("no_notifications")}</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}