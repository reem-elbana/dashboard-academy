import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";

export default function AdminDashboard() {
  const { token } = useContext(AuthContext);
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
    return <p className="p-4 text-gray-600 text-center">Loading...</p>;
  if (!stats)
    return (
      <p className="p-4 text-red-600 text-center">
        Failed to load dashboard.
      </p>
    );

  // --------- Quick Progress Data ----------
  const progressData = [
    {
      label: "Subscription Rate",
      percent: Math.min(
        (stats.total_subscribers / stats.total_users) * 100,
        100
      ),
      color: "bg-blue-500",
    },
    {
      label: "Active Users",
      percent: Math.min(
        (stats.active_users / stats.total_users) * 100,
        100
      ),
      color: "bg-green-500",
    },
    {
      label: "Expired Subscriptions",
      percent: Math.min(
        (stats.expired_subscriptions / stats.total_subscribers) * 100,
        100
      ),
      color: "bg-red-500",
    },
    {
      label: "Sessions Activity",
      percent: Math.min((stats.total_sessions / 100) * 100, 100),
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-4 sm:px-6 md:px-10 py-6 max-w-[1400px] mx-auto">

      {/* Page Title */}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-green-700 mb-10 text-center md:text-left">
        Admin Dashboard
      </h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">

        <StatCard title="Total Users" value={stats.total_users} />
        <StatCard title="Active Users" value={stats.active_users} />
        <StatCard title="Total Subscribers" value={stats.total_subscribers} />
        <StatCard title="Expired Subscriptions" value={stats.expired_subscriptions} />

        {/* Last two cards 50% - 50% on desktop */}
        <div className="lg:col-span-2">
          <StatCard title="Total Sessions" value={stats.total_sessions} />
        </div>

        <div className="lg:col-span-2">
          <StatCard title="Total Offers" value={stats.total_offers} />
        </div>

      </div>

      {/* Current Month Summary */}
      {month && (
        <div className="mt-10 bg-white rounded-3xl shadow-lg p-5 sm:p-7 md:p-8 max-w-7xl mx-auto text-center sm:text-left">
          <h2 className="text-xl sm:text-2xl font-bold text-green-700 mb-6">
            Current Month Summary
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-gray-700 font-semibold text-lg">
            <div className="bg-green-50 rounded-xl p-5 shadow-inner">
              <p className="text-green-600 text-3xl">{month.new_subscribers}</p>
              <p>New Subscribers</p>
            </div>
            <div className="bg-green-50 rounded-xl p-5 shadow-inner">
              <p className="text-green-600 text-3xl">{month.total_attendances_this_month}</p>
              <p>Total Attendances This Month</p>
            </div>
            <div className="bg-green-50 rounded-xl p-5 shadow-inner">
              <p className="text-green-600 text-3xl">{month.active_users_this_month}</p>
              <p>Active Users This Month</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Statistics */}
      <div className="mt-10 bg-white rounded-3xl shadow-lg p-5 sm:p-7 md:p-8 max-w-7xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold text-green-700 mb-6 text-center sm:text-left">
          Quick Statistics
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
      <div className="mt-10 bg-white rounded-3xl shadow-lg p-5 sm:p-7 md:p-8 overflow-x-auto w-full max-w-7xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold text-green-700 mb-4 text-center sm:text-left">
          Recent Attendance
        </h2>

        {attendances.length === 0 ? (
          <p className="text-gray-500 text-lg text-center">
            No attendance records yet.
          </p>
        ) : (
          <table className="w-full min-w-[650px] border-collapse text-sm md:text-base">
            <thead>
              <tr className="text-left border-b bg-gray-100">
                <th className="p-3 font-semibold">User</th>
                <th className="p-3 font-semibold">Session</th>
                <th className="p-3 font-semibold">Date</th>
              </tr>
            </thead>

            <tbody>
              {attendances.map((item, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
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

/* Stat Box Component */
function StatCard({ title, value, small }) {
  return (
    <div
      className={`
        bg-white rounded-3xl shadow-lg p-6 border border-gray-200
        hover:shadow-xl transition-transform hover:-translate-y-1 
        ${small ? "py-5" : "py-7"}
      `}
    >
      <h3 className="text-gray-600 font-semibold">{title}</h3>
      <p className="text-3xl font-extrabold text-green-600 mt-2">
        {value}
      </p>
    </div>
  );
}

/* Progress Row Component */
function ProgressRow({ label, percent, barColor }) {
  return (
    <div className="mb-6">
      <div className="flex justify-between mb-1">
        <p className="text-gray-600 font-semibold">{label}</p>
        <p className="font-bold text-gray-700">{percent}%</p>
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
