import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";
import { useTranslation } from "react-i18next";

export default function SubscribersReport() {
  const { token } = useContext(AuthContext);
  const { t } = useTranslation();

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
          setError(t("failed_to_load_report"));
        }
      } catch (err) {
        setError(err.message || t("error_fetching_data"));
      }
      setLoading(false);
    }
    fetchReport();
  }, [token, t]);

  if (loading)
    return <div className="text-center mt-20 text-lg">{t("loading")}...</div>;
  if (error)
    return (
      <div className="text-center mt-20 text-red-600">
        {t("error")}: {error}
      </div>
    );

  const stats = {
    total_subscribers: {
      label: t("total_subscribers"),
      icon: "💰",
      color: "purple-500",
      value: report.total_subscribers,
    },
    active_subscribers: {
      label: t("active_subscribers"),
      icon: "✅",
      color: "green-500",
      value: report.active_subscribers,
    },
    expired_subscriptions: {
      label: t("expired_subscriptions"),
      icon: "⏳",
      color: "red-500",
      value: report.expired_subscriptions,
    },
    new_subscribers_this_month: {
      label: t("new_subscribers_this_month"),
      icon: "📅",
      color: "blue-500",
      value: report.new_subscribers_this_month,
    },
  };

  return (
    <div className="p-6 font-sans max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-10">
        {t("subscriber_report")}
      </h1>

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
          <h2 className="text-lg font-bold mb-6 text-center md:text-left">
            {t("main_subscriber_statistics")}
          </h2>
          <div className="space-y-6">
            {Object.entries(stats).map(([key, stat]) => {
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
        <h2 className="text-lg font-bold mb-6 text-center md:text-left">
          {t("subscribers_by_session_count")}
        </h2>
        <div className="space-y-4">
          {["zero_sessions", "low_sessions", "high_sessions"].map((key, idx) => {
            const colors = ["blue-600", "green-600", "red-600"];
            const labels = {
              zero_sessions: t("zero_sessions"),
              low_sessions: t("low_sessions"),
              high_sessions: t("high_sessions"),
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
