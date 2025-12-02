import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";
import { useTranslation } from "react-i18next";

export default function UpdateSubscriber() {
  const { token } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [subscriber, setSubscriber] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Form states for all editable fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [remainingSessions, setRemainingSessions] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const fetchSubscriber = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get(
          `https://generous-optimism-production-4492.up.railway.app/api/admin/subscribers/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.data.success) {
          const user = res.data.data.user;
          setSubscriber(user);

          setName(user.name || "");
          setPhone(user.phone || "");
          setNationalId(user.national_id || "");
          setRemainingSessions(user.remaining_sessions ?? "");
          setExpiresAt(user.subscription_expires_at ? user.subscription_expires_at.split("T")[0] : "");
          setIsActive(user.is_active ?? true);
        } else {
          setError(t("error_loading_data"));
        }
      } catch (err) {
        setError(t("error_fetching_data"));
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriber();
  }, [id, token, t]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!name || !phone || !nationalId || remainingSessions === "" || !expiresAt) {
      setError(t("fill_all_fields"));
      return;
    }

    try {
      setLoading(true);

      const res = await axios.put(
        `https://generous-optimism-production-4492.up.railway.app/api/admin/subscribers/${id}`,
        {
          name,
          phone,
          national_id: nationalId,
          remaining_sessions: Number(remainingSessions),
          subscription_expires_at: expiresAt,
          is_active: isActive,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        setSuccessMsg(t("update_success"));
      } else {
        setError(t("update_failed"));
      }
    } catch {
      setError(t("update_error"));
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <p className="p-6 text-center text-green-700">{t("loading")}</p>;

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-green-50 flex justify-center items-center">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h1 className="text-xl sm:text-2xl font-bold text-green-700 mb-6 text-center">
          {t("update_subscriber")} {subscriber?.name}
        </h1>

        {error && <p className="text-red-600 mb-4 font-semibold">{error}</p>}
        {successMsg && (
          <p className="text-green-700 mb-4 font-semibold">{successMsg}</p>
        )}

        <form onSubmit={handleSubmit}>
          <label className="block mb-4">
            <span className="text-gray-700 font-medium">{t("name")}</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full border border-green-400 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500"
              required
            />
          </label>

          <label className="block mb-4">
            <span className="text-gray-700 font-medium">{t("phone")}</span>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 block w-full border border-green-400 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500"
              required
            />
          </label>

          <label className="block mb-4">
            <span className="text-gray-700 font-medium">{t("national_id")}</span>
            <input
              type="text"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              className="mt-1 block w-full border border-green-400 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500"
              required
            />
          </label>

          <label className="block mb-4">
            <span className="text-gray-700 font-medium">{t("remaining_sessions")}</span>
            <input
              type="number"
              min="0"
              value={remainingSessions}
              onChange={(e) => setRemainingSessions(e.target.value)}
              className="mt-1 block w-full border border-green-400 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500"
              required
            />
          </label>

          <label className="block mb-4">
            <span className="text-gray-700 font-medium">{t("subscription_expires_at")}</span>
            <input
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="mt-1 block w-full border border-green-400 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500"
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
            <span className="text-gray-700 font-medium">{t("active")}</span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md"
          >
            {loading ? t("updating") : t("update_subscriber")}
          </button>
        </form>

        <button
          onClick={() => navigate("/admin/subscribers")}
          className="mt-4 text-green-600 underline"
        >
          {t("back_to_subscribers")}
        </button>
      </div>
    </div>
  );
}
