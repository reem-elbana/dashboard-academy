import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";
import { useTranslation } from "react-i18next";

export default function AdminDashboard() {
  const { token } = useContext(AuthContext);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [stats, setStats] = useState(null);
  const [month, setMonth] = useState(null);
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get(
        "https://generous-optimism-production-4492.up.railway.app/api/admin/dashboard",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setStats(res.data.data.stats);
      setMonth(res.data.data.current_month);
      setAttendances(res.data.data.recent_attendances);
    } catch (err) {
      console.error("Dashboard Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading)
    return <p className="p-4 text-forsan-dark text-center">{t("loading")}</p>;

  if (!stats)
    return (
      <p className="p-4 text-red-600 text-center">
        {t("failed_to_load")}
      </p>
    );

  const progressData = [
    {
      label: t("subscription_rate"),
      percent: Math.min(
        (stats.total_subscribers / stats.total_users) * 100,
        100
      ),
      color: "bg-blue-500", // يمكن تغيير هذا اللون حسب رغبتك، أتركه أزرق هنا
    },
    {
      label: t("active_users"),
      percent: Math.min(
        (stats.active_users / stats.total_users) * 100,
        100
      ),
      color: "bg-forsan-green",
    },
    {
      label: t("expired_subscriptions"),
      percent: Math.min(
        (stats.expired_subscriptions / stats.total_subscribers) * 100,
        100
      ),
      color: "bg-red-500",
    },
    {
      label: t("sessions_activity"),
      percent: Math.min((stats.total_sessions / 100) * 100, 100),
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 px-4 sm:px-6 md:px-10 py-6 max-w-[1400px] mx-auto">

      <h1
        className={`text-3xl sm:text-4xl font-extrabold text-forsan-green mb-10 ${
          isRTL ? "text-right" : "text-left"
        }`}
      >
        {t("admin_dashboard")}
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard title={t("total_users")} value={stats.total_users} />
        <StatCard title={t("active_users")} value={stats.active_users} />
        <StatCard title={t("total_subscribers")} value={stats.total_subscribers} />
        <StatCard title={t("expired_subscriptions")} value={stats.expired_subscriptions} />

        <StatCard title={t("active_banners")} value={stats.active_banners} />
        <StatCard title={t("active_categories")} value={stats.active_categories} />
        <StatCard title={t("total_sessions")} value={stats.total_sessions} />
        <StatCard title={t("total_offers")} value={stats.total_offers} />
      </div>

      {/* Month Summary */}
      {month && (
        <div className="mt-10 bg-white rounded-3xl shadow-lg p-7 max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-forsan-green mb-6">
            {t("current_month_summary")}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-forsan-dark font-semibold text-lg">
            <div className="bg-[rgba(136,167,77,0.1)] rounded-xl p-5 shadow-inner">
              <p className="text-forsan-green text-3xl">{month.new_subscribers}</p>
              <p>{t("new_subscribers")}</p>
            </div>

            <div className="bg-[rgba(136,167,77,0.1)] rounded-xl p-5 shadow-inner">
              <p className="text-forsan-green text-3xl">{month.total_attendances_this_month}</p>
              <p>{t("total_attendances_this_month")}</p>
            </div>

            <div className="bg-[rgba(136,167,77,0.1)] rounded-xl p-5 shadow-inner">
              <p className="text-forsan-green text-3xl">{month.active_users_this_month}</p>
              <p>{t("active_users_this_month")}</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="mt-10 bg-white rounded-3xl shadow-lg p-7 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-forsan-green mb-6">
          {t("quick_statistics")}
        </h2>

        <div className="space-y-6">
          {progressData.map((item, index) => (
            <ProgressRow
              key={index}
              label={item.label}
              percent={item.percent.toFixed(0)}
              barColor={item.color}
            />
          ))}
        </div>
      </div>

      {/* Recent Attendance */}
      <div className="mt-10 bg-white rounded-3xl shadow-lg p-7 overflow-x-auto max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-forsan-green mb-4">
          {t("recent_attendance")}
        </h2>

        {attendances.length === 0 ? (
          <p className="text-gray-500 text-lg text-center">{t("no_attendance")}</p>
        ) : (
          <table className="w-full min-w-[650px] border-collapse">
            <thead>
              <tr className="text-left border-b bg-gray-100">
                <th className="p-3">{t("user")}</th>
                <th className="p-3">{t("session")}</th>
                <th className="p-3">{t("date")}</th>
              </tr>
            </thead>

            <tbody>
              {attendances.map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-3">{item.user_name}</td>
                  <td className="p-3">{item.session_name}</td>
                  <td className="p-3">{item.time?.split("T")[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 border hover:shadow-xl">
      <h3 className="text-forsan-dark font-semibold">{title}</h3>
      <p className="text-3xl font-extrabold text-forsan-green mt-2">{value}</p>
    </div>
  );
}

function ProgressRow({ label, percent, barColor }) {
  return (
    <div className="mb-6">
      <div className="flex justify-between mb-1">
        <p className="text-forsan-dark font-semibold">{label}</p>
        <p className="font-bold text-forsan-dark">{percent}%</p>
      </div>
      <div className="w-full h-3 bg-gray-200 rounded-full">
        <div
          className={`h-3 rounded-full ${barColor}`}
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    </div>
  );
}
