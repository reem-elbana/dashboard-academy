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
    return <p className="p-4 text-red-600 text-center">Failed to load dashboard.</p>;

  return (
    <div className="
      w-full min-h-screen
      bg-gradient-to-br from-gray-100 to-gray-200
      px-4 sm:px-10 py-6
      max-w-[1400px] mx-auto       /* يخليه متسنتر وشكله حلو على الشاشات الكبيرة */
    ">
      
      {/* Page Title */}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-green-700 mb-10 text-center md:text-left">
        Admin Dashboard
      </h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Users" value={stats.total_users} />
        <StatCard title="Active Users" value={stats.active_users} />
        <StatCard title="Total Subscribers" value={stats.total_subscribers} />
        <StatCard title="Expired Subscriptions" value={stats.expired_subscriptions} />
        <StatCard title="Total Sessions" value={stats.total_sessions} />
        <StatCard title="Total Offers" value={stats.total_offers} />
      </div>

      {/* Month Stats */}
      <div className="mt-12 bg-white rounded-3xl shadow-lg p-6 sm:p-8 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-green-700 mb-6">
          Monthly Activity
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard title="New Subscribers" value={month.new_subscribers} small />
          <StatCard title="Attendances This Month" value={month.total_attendances_this_month} small />
          <StatCard title="Active Users This Month" value={month.active_users_this_month} small />
        </div>
      </div>

      {/* Recent Attendance */}
      <div className="mt-12 bg-white rounded-3xl shadow-lg p-6 sm:p-8 max-w-7xl mx-auto overflow-x-auto">
        <h2 className="text-2xl font-bold text-green-700 mb-4">
          Recent Attendance
        </h2>

        {attendances.length === 0 ? (
          <p className="text-gray-500 text-lg text-center">
            No attendance records yet.
          </p>
        ) : (
          <table className="w-full min-w-[600px] border-collapse">
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
      <p className="text-3xl font-extrabold text-green-600 mt-2">{value}</p>
    </div>
  );
}
