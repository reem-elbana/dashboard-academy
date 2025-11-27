import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";

export default function UpdateSubscriber() {
  const { token } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [subscriber, setSubscriber] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Form fields
  const [remainingSessions, setRemainingSessions] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Fetch subscriber details
  useEffect(() => {
    const fetchSubscriber = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `https://generous-optimism-production-4492.up.railway.app/api/admin/subscribers/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.data.success) {
          const user = res.data.data.user;
          setSubscriber(user);
          setRemainingSessions(user.remaining_sessions ?? "");
          setExpiresAt(user.subscription_expires_at ?? "");
          setIsActive(user.is_active);
        } else {
          setError("Failed to load subscriber data.");
        }
      } catch {
        setError("Error fetching subscriber data.");
      } finally {
        setLoading(false);
      }
    };
    fetchSubscriber();
  }, [id, token]);

  // Handle form submit (PUT request)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (remainingSessions === "" || expiresAt === "") {
      setError("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.put(
        `https://generous-optimism-production-4492.up.railway.app/api/admin/subscribers/${id}`,
        {
          remaining_sessions: Number(remainingSessions),
          subscription_expires_at: expiresAt,
          is_active: isActive,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        setSuccessMsg("Subscriber updated successfully!");
        // Optionally update local state or navigate back
        setTimeout(() => {
          navigate("/admin/subscribers");
        }, 1500);
      } else {
        setError("Failed to update subscriber.");
      }
    } catch {
      setError("Error occurred while updating subscriber.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="p-6 text-center text-green-700">Loading...</p>;

  return (
    <div className="min-h-screen p-6 bg-green-50 flex justify-center items-center">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-green-700 mb-6 text-center">
          Update Subscriber {subscriber?.name}
        </h1>

        {error && <p className="text-red-600 mb-4 font-semibold">{error}</p>}
        {successMsg && <p className="text-green-700 mb-4 font-semibold">{successMsg}</p>}

        <form onSubmit={handleSubmit}>
          <label className="block mb-4">
            <span className="text-gray-700 font-medium">Remaining Sessions</span>
            <input
              type="number"
              min="0"
              value={remainingSessions}
              onChange={(e) => setRemainingSessions(e.target.value)}
              className="mt-1 block w-full border border-green-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </label>

          <label className="block mb-4">
            <span className="text-gray-700 font-medium">Subscription Expires At</span>
            <input
              type="date"
              value={expiresAt ? expiresAt.split("T")[0] : ""}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="mt-1 block w-full border border-green-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </label>

          <label className="flex items-center mb-6">
            <input
              type="checkbox"
              checked={isActive}
              onChange={() => setIsActive(!isActive)}
              className="mr-2"
            />
            <span className="text-gray-700 font-medium">Active</span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md transition"
          >
            {loading ? "Updating..." : "Update Subscriber"}
          </button>
        </form>

        <button
          onClick={() => navigate("/admin/subscribers")}
          className="mt-4 text-green-600 underline"
        >
          Back to Subscribers
        </button>
      </div>
    </div>
  );
}
