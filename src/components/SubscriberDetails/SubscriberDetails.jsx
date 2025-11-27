import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";

export default function SubscriberDetails() {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [subscriber, setSubscriber] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSubscriberDetails = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(
          `https://generous-optimism-production-4492.up.railway.app/api/admin/subscribers/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.data.success) {
          setSubscriber(res.data.data.user);
          setStats(res.data.data.stats);
        } else {
          setError("Failed to load subscriber details");
        }
      } catch (err) {
        setError("An error occurred while fetching subscriber details");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriberDetails();
  }, [id, token]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-green-700 font-semibold">
        Loading subscriber details...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 font-semibold">
        {error}
      </div>
    );

  if (!subscriber)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 font-semibold">
        No subscriber data found.
      </div>
    );

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-green-600 underline"
        >
          ← Back to Subscribers
        </button>

        <h1 className="text-3xl font-bold text-green-800 mb-6">
          تفاصيل المشترك: {subscriber.name}
        </h1>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left: Profile */}
          <div className="flex flex-col items-center md:w-1/3">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-green-500 mb-4">
              {subscriber.profile_image ? (
                <img
                  src={`https://generous-optimism-production-4492.up.railway.app/storage/${subscriber.profile_image}`}
                  alt={subscriber.name}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-green-200 text-green-700 font-bold text-5xl">
                  {subscriber.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <p className={`font-semibold ${subscriber.is_active ? "text-green-600" : "text-red-600"}`}>
              {subscriber.is_active ? "Active" : "Inactive"}
            </p>
          </div>

          {/* Right: Details and stats */}
          <div className="md:w-2/3 space-y-4">
            <div>
              <p><span className="font-semibold">Email:</span> {subscriber.email}</p>
              <p><span className="font-semibold">Phone:</span> {subscriber.phone}</p>
              <p><span className="font-semibold">National ID:</span> {subscriber.national_id}</p>
              <p><span className="font-semibold">Role:</span> {subscriber.role}</p>
              <p>
                <span className="font-semibold">Subscription Expires At:</span>{" "}
                {subscriber.subscription_expires_at
                  ? new Date(subscriber.subscription_expires_at).toLocaleDateString()
                  : "N/A"}
              </p>
              <p><span className="font-semibold">Remaining Sessions:</span> {subscriber.remaining_sessions}</p>
            </div>

            <div className="border-t border-green-300 pt-4">
              <h2 className="text-xl font-semibold text-green-800 mb-2">
                إحصائيات الحضور
              </h2>
              <p><span className="font-semibold">Total Attendances:</span> {stats?.total_attendances ?? 0}</p>
              <p><span className="font-semibold">Attended Sessions:</span> {stats?.attended_sessions ?? 0}</p>
              <p><span className="font-semibold">Remaining Sessions:</span> {stats?.remaining_sessions ?? 0}</p>
              <p>
                <span className="font-semibold">Last Attendance:</span>{" "}
                {stats?.last_attendance
                  ? new Date(stats.last_attendance).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
