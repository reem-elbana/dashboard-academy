import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";

export default function SubscribersReport() {
  const { token } = useContext(AuthContext);

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchReport() {
      try {
        const res = await axios.get(
          "https://generous-optimism-production-4492.up.railway.app/api/admin/reports/subscribers",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.data.success) {
          setReport(res.data.data.report);
        } else {
          setError("Failed to load report");
        }
      } catch (err) {
        setError(err.message || "Error fetching data");
      }
      setLoading(false);
    }
    fetchReport();
  }, [token]);

  if (loading) return <div className="text-center mt-20 text-lg">Loading...</div>;
  if (error) return <div className="text-center mt-20 text-red-600">Error: {error}</div>;

  const stats = {
    total_subscribers: {
      label: "Total Subscribers",
      icon: "💰",
      color: "purple-500",
      value: report.total_subscribers,
    },
    active_subscribers: {
      label: "Active Subscribers",
      icon: "✅",
      color: "green-500",
      value: report.active_subscribers,
    },
    expired_subscriptions: {
      label: "Expired Subscriptions",
      icon: "⏳",
      color: "red-500",
      value: report.expired_subscriptions,
    },
    new_subscribers_this_month: {
      label: "New Subscribers This Month",
      icon: "📅",
      color: "blue-500",
      value: report.new_subscribers_this_month,
    },
  };

  return (
    <div className="p-6 font-sans max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-10">Subscriber Report</h1>

      {/* flex container للكاردز و progress bars الرئيسية جنب بعض */}
      <div className="flex flex-col md:flex-row gap-10 mb-12">
        {/* الكاردز */}
        <div className="md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {Object.entries(stats).map(([key, stat]) => (
            <div
              key={key}
              className="p-6 bg-white rounded shadow flex flex-col items-center text-center"
            >
              <div className={`text-${stat.color} mb-3 text-5xl`}>{stat.icon}</div>
              <div className="text-gray-700 mb-1 font-semibold">{stat.label}</div>
              <div className="font-bold text-4xl">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* progress bars لنفس الإحصائيات مع عرض متغير حسب قيمة العدد */}
        <div className="md:w-1/2 bg-white rounded shadow p-6">
          <h2 className="text-lg font-bold mb-6 text-center md:text-left">Main Subscriber Statistics (Progress Bars)</h2>
          <div className="space-y-6">
            {Object.entries(stats).map(([key, stat]) => {
              // عرض البار حسب قيمة العدد نفسها (مثال thresholds)
              let widthPercent = 0;
              if (stat.value < 50) {
                widthPercent = 20;
              } else if (stat.value < 150) {
                widthPercent = 40;
              } else {
                widthPercent = 70;
              }

              return (
                <div key={key}>
                  <div className="flex justify-between mb-1 font-semibold">
                    <span>{stat.label}</span>
                    <span>{stat.value}</span>
                  </div>
                  <div className="w-full bg-gray-200 h-4 rounded">
                    <div
                      className={`h-4 rounded bg-blue-600`}
                      style={{ width: `${widthPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Subscribers by Session Count تحت الاتنين */}
      <div className="bg-white rounded shadow p-6 max-w-xl mx-auto md:mx-0">
        <h2 className="text-lg font-bold mb-6 text-center md:text-left">Subscribers by Session Count</h2>
        <div className="space-y-4">
          {["zero_sessions", "low_sessions", "high_sessions"].map((key, idx) => {
            const colors = ["blue-600", "green-600", "red-600"];
            const labels = {
              zero_sessions: "Zero Sessions",
              low_sessions: "Low Sessions",
              high_sessions: "High Sessions",
            };
            const value = report.subscribers_by_session_count[key];
            const widthPercent = (value / report.total_subscribers) * 100;

            return (
              <div key={key}>
                <div className="flex justify-between">
                  <span>{labels[key]}</span>
                  <span className="font-semibold">{value}</span>
                </div>
                <div className="w-full bg-gray-200 h-3 rounded">
                  <div
                    className={`h-3 rounded bg-${colors[idx]}`}
                    style={{ width: `${widthPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
