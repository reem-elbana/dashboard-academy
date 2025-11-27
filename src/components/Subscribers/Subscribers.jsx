import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const subscriptionStatusOptions = [
  { label: "All", value: "" },
  { label: "Active", value: "active" },
  { label: "Expired", value: "expired" },
  { label: "No Sessions", value: "no_sessions" },
];

export default function Subscribers() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");

  const fetchSubscribers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        "https://generous-optimism-production-4492.up.railway.app/api/admin/subscribers",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        setSubscribers(res.data.data.data);
      } else {
        setError("Failed to load subscribers");
      }
    } catch {
      setError("An error occurred while fetching subscribers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const checkSubscriptionStatus = (subscriber) => {
    const today = new Date();
    const expiresAt = subscriber.subscription_expires_at
      ? new Date(subscriber.subscription_expires_at)
      : null;
    const remaining = subscriber.remaining_sessions ?? 0;

    if (filter === "active") {
      return expiresAt && expiresAt >= today;
    } else if (filter === "expired") {
      return expiresAt && expiresAt < today;
    } else if (filter === "no_sessions") {
      return remaining === 0;
    }
    return true;
  };

  const filteredSubscribers = subscribers.filter(checkSubscriptionStatus);

  return (
    <div className="min-h-screen p-6 bg-green-50">
      <div className="max-w-7xl mx-auto p-6 bg-white rounded-xl shadow-lg">

        <h1 className="text-3xl font-bold text-center mb-8 text-green-800">
          Subscribers List
        </h1>

        {/* Filter */}
        <div className="flex justify-center mb-6">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-green-400 rounded-md px-4 py-2 text-green-700 focus:outline-none focus:ring-2 focus:ring-green-600"
          >
            {subscriptionStatusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {loading && (
          <p className="text-center text-green-600 font-semibold">Loading subscribers...</p>
        )}
        {error && (
          <p className="text-center text-red-600 font-semibold">{error}</p>
        )}
        {!loading && !error && filteredSubscribers.length === 0 && (
          <p className="text-center text-green-700">No subscribers found.</p>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {!loading && !error && filteredSubscribers.map((sub) => {
            const today = new Date();
            const expiresAt = sub.subscription_expires_at
              ? new Date(sub.subscription_expires_at)
              : null;

            let statusText = "No Expiry";
            let statusColor = "text-gray-600";

            if (expiresAt) {
              if (expiresAt >= today) {
                statusText = "Active";
                statusColor = "text-green-700 font-semibold";
              } else {
                statusText = "Expired";
                statusColor = "text-red-600 font-semibold";
              }
            }

            // دالة لمنع navigate من الزرار يشتغل مع onClick للكارت
            const onCardClick = () => navigate(`/admin/subscribers/${sub.id}`);

            return (
              <div
                key={sub.id}
                onClick={onCardClick}
                className="bg-white border border-green-300 rounded-xl shadow-md p-5 flex flex-col items-center text-center cursor-pointer hover:shadow-lg transition relative"
              >
                {/* Profile image or placeholder */}
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-green-500 mb-4">
                  {sub.profile_image ? (
                    <img
                      src={`https://generous-optimism-production-4492.up.railway.app/storage/${sub.profile_image}`}
                      alt={sub.name}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-green-200 text-green-700 font-bold text-3xl">
                      {sub.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <h2 className="text-xl font-semibold text-green-800 mb-1">{sub.name}</h2>
                <p className="text-green-600 mb-1">{sub.email}</p>
                <p className="text-green-600 mb-2">{sub.phone}</p>

                <div className="w-full bg-green-100 rounded-full h-4 mb-3">
                  <div
                    className={`h-4 rounded-full transition-all duration-500 ${
                      statusText === "Active"
                        ? "bg-green-500"
                        : statusText === "Expired"
                        ? "bg-red-500"
                        : "bg-gray-400"
                    }`}
                    style={{
                      width:
                        statusText === "Active"
                          ? "100%"
                          : statusText === "Expired"
                          ? "100%"
                          : "40%",
                    }}
                  />
                </div>

                <p className={`${statusColor} mb-2`}>{statusText}</p>

                <p className="text-green-700 font-medium">
                  Remaining Sessions: {sub.remaining_sessions}
                </p>
                <p className="text-green-700 text-sm mt-2">
                  Subscription Expires:{" "}
                  {expiresAt ? expiresAt.toISOString().split("T")[0] : "N/A"}
                </p>

                <p className={`mt-2 font-semibold ${
                  sub.is_active ? "text-green-600" : "text-red-600"
                }`}>
                  {sub.is_active ? "Active" : "Inactive"}
                </p>

                {/* Renew Subscription Button - show only if expired */}
                {statusText === "Expired" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // يمنع navigate للكارت لما اضغط على الزرار
                      navigate(`/admin/subscribers/renew/${sub.id}`, { state: { subscriber: sub } });
                    }}
                    className="mt-4 text-green-700 border border-green-700 hover:bg-green-700 hover:text-white transition font-semibold px-4 py-2 rounded-md w-full"
                  >
                    Renew Subscription
                  </button>

                  
                )}

                
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
