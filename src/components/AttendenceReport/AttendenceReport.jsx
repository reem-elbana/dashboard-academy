import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";

export default function AttendanceReport() {
  const { token } = useContext(AuthContext);

  const [report, setReport] = useState(null);
  const [period, setPeriod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    async function fetchReport() {
      setLoading(true);
      setError(null);

      try {
        const params = {};
        if (dateFrom) params.date_from = dateFrom;
        if (dateTo) params.date_to = dateTo;

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
          setError("Failed to load attendance report");
        }
      } catch (err) {
        setError(err.message || "Error fetching attendance data");
      }
      setLoading(false);
    }
    fetchReport();
  }, [token, dateFrom, dateTo]);

  if (loading)
    return <div className="text-center mt-20 text-lg">Loading attendance report...</div>;

  if (error)
    return <div className="text-center mt-20 text-red-600">Error: {error}</div>;

  if (!report) return null;

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans">

      {/* PAGE TITLE */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900">Attendance Report</h1>

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
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Filter By Date</h2>

        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex flex-col">
            <label className="font-medium mb-1">From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-3 py-2 border rounded-lg shadow-sm"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium mb-1">To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-3 py-2 border rounded-lg shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow border text-center">
          <p className="text-4xl font-bold text-blue-600">{report.total_attendances}</p>
          <p className="text-gray-700 font-semibold mt-2">Total Attendances</p>
        </div>

        <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow border text-center">
          <p className="text-4xl font-bold text-green-600">{report.unique_attendees}</p>
          <p className="text-gray-700 font-semibold mt-2">Unique Attendees</p>
        </div>

        <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow border text-center">
          <p className="text-4xl font-bold text-purple-600">
            {report.average_attendance_per_session.toFixed(2)}
          </p>
          <p className="text-gray-700 font-semibold mt-2">Avg Attendance / Session</p>
        </div>
      </div>

      {/* TOP ATTENDEES */}
      <div className="mb-14">
        <h2 className="text-2xl font-bold mb-5 text-gray-900">Top Attendees</h2>

        {report.top_attendees.length === 0 ? (
          <p className="text-gray-500">No attendance data available.</p>
        ) : (
          <div className="overflow-hidden border rounded-2xl shadow">
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-5 py-3 border-b">Name</th>
                  <th className="px-5 py-3 border-b">Attendance Count</th>
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
          <h2 className="text-2xl font-bold text-gray-900">Popular Sessions</h2>
       
        </div>

        {report.popular_sessions.length === 0 ? (
          <p className="text-gray-500">No sessions data available.</p>
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

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {session.description}
                  </p>

                  <div className="space-y-2 text-sm text-gray-700 mb-4">
                    <div>🗓 {session.session_date.split("T")[0]}</div>
                    <div>⏰ {session.start_time} - {session.end_time}</div>
                    <div>👥 Max: {session.max_participants}</div>
                  </div>

                  <span className="block text-green-700 font-semibold text-sm bg-green-100 px-3 py-1 rounded-full w-fit shadow">
                    {session.attendances_count} attended
                  </span>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
