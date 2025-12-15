import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";
import { useTranslation } from "react-i18next";
import { hasPermission } from "../../Context/permissions"

export default function AttendanceReport() {
  const { token } = useContext(AuthContext);
  const { permissions } = useContext(AuthContext);
  const { t } = useTranslation();

  const [report, setReport] = useState(null);
  const [period, setPeriod] = useState(null);
  const [loading, setLoading] = useState(false); // خلي التحميل false عشان يبدأ بعد الضغط
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

  // دالة لجلب التقرير بناءً على التواريخ اللي المستخدم يدخلها
  async function fetchReport() {
    if (!dateFrom || !dateTo) {
      setError(t("please_select_both_dates"));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = {
        date_from: dateFrom,
        date_to: dateTo,
      };

      const res = await axios.get(
        "https://generous-optimism-production-4492.up.railway.app/api/admin/reports/attendance",
        {
          headers: { Authorization: `Bearer ${token}` },
          params,
        }
      );

      if (res.data.success) {
        setReport(res.data.data.report);
        setPeriod(res.data.data.period);
      } else {
        setError(t("failed_to_load_attendance_report"));
      }
    } catch (err) {
      setError(err.message || t("error_fetching_attendance_data"));
    }
    setLoading(false);
  }

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans">
      {/* PAGE TITLE */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900">{t("attendance_report")}</h1>

        {period && (
          <div className="bg-blue-100 text-blue-800 text-sm px-5 py-2 rounded-full border border-blue-300 shadow-sm">
            <span className="font-medium">
              📅 {period.from.split("T")[0]} → {period.to.split("T")[0]}
            </span>
          </div>
        )}
      </div>

      {/* FILTER CARD */}
      <div className="bg-white/70 backdrop-blur-md border border-gray-200 shadow-md p-6 rounded-2xl mb-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">{t("filter_by_date")}</h2>

        <div className="flex flex-col sm:flex-row gap-6 items-end">
          <div className="flex flex-col">
            <label className="font-medium mb-1">{t("from")}</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-3 py-2 border rounded-lg shadow-sm"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium mb-1">{t("to")}</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-3 py-2 border rounded-lg shadow-sm"
            />
          </div>

          <button
            onClick={fetchReport}
            className="bg-forsan-green hover:bg-forsan-green-dark text-white px-6 py-3 rounded-xl transition"
          >
            {t("show_report")}
          </button>
        </div>

        {error && <p className="mt-3 text-red-600">{error}</p>}
      </div>

      {loading && (
        <div className="text-center mt-20 text-lg">{t("loading_attendance_report")}...</div>
      )}

      {/* SHOW REPORT IF AVAILABLE */}
      {!loading && report && (
        <>
          {/* STAT CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow border text-center">
              <p className="text-4xl font-bold text-forsan-green">{report.total_attendances}</p>
              <p className="text-gray-700 font-semibold mt-2">{t("total_attendances")}</p>
            </div>

            <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow border text-center">
              <p className="text-4xl font-bold text-green-600">{report.unique_attendees}</p>
              <p className="text-gray-700 font-semibold mt-2">{t("unique_attendees")}</p>
            </div>

            <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow border text-center">
              <p className="text-4xl font-bold text-purple-600">
                {report.average_attendance_per_session.toFixed(2)}
              </p>
              <p className="text-gray-700 font-semibold mt-2">{t("avg_attendance_per_session")}</p>
            </div>
          </div>

          {/* TOP ATTENDEES */}
          <div className="mb-14">
            <h2 className="text-2xl font-bold mb-5 text-gray-900">{t("top_attendees")}</h2>

            {report.top_attendees.length === 0 ? (
              <p className="text-gray-500">{t("no_attendance_data")}</p>
            ) : (
              <div className="overflow-hidden border rounded-2xl shadow">
                <table className="w-full text-left">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-5 py-3 border-b">{t("name")}</th>
                      <th className="px-5 py-3 border-b">{t("attendance_count")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.top_attendees.map((attendee) => (
                      <tr key={attendee.id} className="hover:bg-gray-50">
                        <td className="px-5 py-3 border-b">{attendee.name}</td>
                        <td className="px-5 py-3 border-b">{attendee.attendance_count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* POPULAR SESSIONS */}
          <div>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold text-gray-900">{t("popular_sessions")}</h2>
            </div>

            {report.popular_sessions.length === 0 ? (
              <p className="text-gray-500">{t("no_sessions_data")}</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                {[...report.popular_sessions]
                  .sort((a, b) => b.attendances_count - a.attendances_count)
                  .map((session) => (
                    <div
                      key={session.id}
                      className="
                        bg-white/80 backdrop-blur-md p-6 rounded-2xl border shadow 
                        hover:shadow-xl hover:-translate-y-1 transition-all
                      "
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{session.title}</h3>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{session.description}</p>

                      <div className="space-y-2 text-sm text-gray-700 mb-4">
                        <div>🗓 {session.session_date.split("T")[0]}</div>
                        <div>
                          ⏰ {session.start_time} - {session.end_time}
                        </div>
                        <div>
                          👥 {t("max_participants")}: {session.max_participants}
                        </div>
                      </div>

                      <span className="block text-green-700 font-semibold text-sm bg-green-100 px-3 py-1 rounded-full w-fit shadow">
                        {session.attendances_count} {t("attended")}
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
