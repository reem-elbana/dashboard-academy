import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";
import { useTranslation } from "react-i18next";
import { hasPermission } from "../../Context/permissions"

export default function SubscribersReport() {
  const { token } = useContext(AuthContext);
  const { permissions } = useContext(AuthContext);
  const { t } = useTranslation();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");


      if (!hasPermission(permissions, "reports.view")) {
      return (
        <div className="text-center text-red-500 text-xl mt-10">
          {t("you do not have permission to view this page")}
        </div>
      );
    }
    

  async function fetchReport() {
    if (!dateFrom || !dateTo) {
      setError(t("please_select_both_dates"));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await axios.get(
        `https://generous-optimism-production-4492.up.railway.app/api/admin/reports/subscribers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            date_from: dateFrom,
            date_to: dateTo,
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
    } finally {
      setLoading(false);
    }
  }

  const stats = report
    ? {
        total_subscribers: {
          label: t("total_subscribers"),
          icon: "💰",
          value: report.total_subscribers,
        },
        active_subscribers: {
          label: t("active_subscribers"),
          icon: "✅",
          value: report.active_subscribers,
        },
        expired_subscriptions: {
          label: t("expired_subscriptions"),
          icon: "⏳",
          value: report.expired_subscriptions,
        },
        new_subscribers_this_month: {
          label: t("new_subscribers_this_month"),
          icon: "📅",
          value: report.new_subscribers_this_month,
        },
      }
    : {};

  function getWidthPercent(value) {
    if (!report) return 0;
    if (value === 0) return 5;
    const maxValue = Math.max(...Object.values(stats).map((s) => s.value));
    return Math.min((value / maxValue) * 100, 100);
  }

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans">
      <h1 className="text-4xl font-extrabold text-forsan-green mb-6 pb-2">
        {t("subscriber_report")}
      </h1>

      {/* Inputs اختيار الفترة */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center">
        <label className="text-forsan-dark font-semibold">
          {t("date_from")}:
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="ml-2 p-2 border rounded-md"
          />
        </label>

        <label className="text-forsan-dark font-semibold">
          {t("date_to")}:
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="ml-2 p-2 border rounded-md"
          />
        </label>

        <button
          onClick={fetchReport}
          className="bg-forsan-dark text-white px-5 py-2 rounded-xl hover:bg-blue-900 transition"
          disabled={loading}
        >
          {loading ? t("loading") + "..." : t("show_report")}
        </button>
      </div>

      {error && (
        <div className="text-red-600 font-semibold mb-6 text-center">{error}</div>
      )}

      {!report && !loading && !error && (
        <p className="text-center text-gray-500">{t("please_select_dates_and_show_report")}</p>
      )}

      {report && (
        <>
          {/* عرض الفترة */}
          <p className="mb-6 text-forsan-dark font-semibold text-lg text-center">
            {t("report_period")}: {dateFrom} — {dateTo}
          </p>

          <div className="flex flex-col md:flex-row gap-12 mb-16">
            <div className="md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-8">
              {Object.entries(stats).map(([key, stat]) => (
                <div
                  key={key}
                  className="p-8 bg-white rounded-3xl shadow-lg flex flex-col items-center text-center hover:shadow-2xl transition"
                >
                  <div className="text-forsan-green text-2xl mb-4">{stat.icon}</div>
                  <div className="text-forsan-dark text-lg font-semibold mb-1">{stat.label}</div>
                  <div className="text-5xl font-extrabold text-forsan-dark">{stat.value}</div>
                </div>
              ))}
            </div>

            <div className="md:w-1/2 bg-white rounded-3xl shadow-lg p-8">
              <h2 className="text-xl font-bold mb-8 text-forsan-green">
                {t("main_subscriber_statistics")}
              </h2>

              <div className="space-y-8">
                {Object.entries(stats).map(([key, stat]) => {
                  const widthPercent = getWidthPercent(stat.value);

                  return (
                    <div key={key}>
                      <div className="flex justify-between mb-2 font-semibold text-forsan-dark">
                        <span>{stat.label}</span>
                        <span>{stat.value}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-5">
                        <div
                          className="h-5 rounded-full bg-gradient-to-r from-forsan-green to-forsan-dark transition-width duration-500"
                          style={{ width: `${widthPercent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8 max-w-xl mx-auto md:mx-0">
            <h2 className="text-xl font-bold mb-8 text-forsan-green">
              {t("subscribers_by_session_count")}
            </h2>
            <div className="space-y-6">
              {["zero_sessions", "low_sessions", "high_sessions"].map((key, idx) => {
                const labels = {
                  zero_sessions: t("zero_sessions"),
                  low_sessions: t("low_sessions"),
                  high_sessions: t("high_sessions"),
                };
                const value = report.subscribers_by_session_count[key];
                const widthPercent = (value / report.total_subscribers) * 100;

                const colors = [
                  "bg-forsan-green",
                  "bg-forsan-green/80",
                  "bg-forsan-green/60",
                ];

                return (
                  <div key={key}>
                    <div className="flex justify-between font-semibold text-forsan-dark mb-1">
                      <span>{labels[key]}</span>
                      <span>{value}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className={`${colors[idx]} h-4 rounded-full transition-width duration-500`}
                        style={{ width: `${widthPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
