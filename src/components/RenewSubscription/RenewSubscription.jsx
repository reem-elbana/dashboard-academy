import { useState, useContext } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";
import { useTranslation } from "react-i18next";

export default function RenewSubscriptionPage() {
  const { token } = useContext(AuthContext);
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const subscriber = location.state?.subscriber;

  const [months, setMonths] = useState("");
  const [sessions, setSessions] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [newSubscription, setNewSubscription] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setNewSubscription(null);

    if (!months || !sessions) {
      setError(t("enter_months_sessions"));
      return;
    }
    if (isNaN(months) || isNaN(sessions)) {
      setError(t("months_sessions_numbers"));
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `https://generous-optimism-production-4492.up.railway.app/api/admin/users/${id}/renew-subscription`,
        { months: Number(months), sessions: Number(sessions) },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        setSuccessMsg(res.data.message || t("renew_success"));
        setNewSubscription(res.data.data);
        setMonths("");
        setSessions("");
      } else {
        setError(t("renew_failed"));
      }
    } catch (err) {
      setError(t("renew_error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 p-6 flex flex-col items-center">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-green-700 mb-6 text-center">
          {t("renew_subscription")} {subscriber ? `${t("for")} ${subscriber.name}` : ""}
        </h1>

        <form onSubmit={handleSubmit}>
          {error && <p className="mb-3 text-red-600 font-semibold">{error}</p>}
          {successMsg && (
            <p className="mb-3 text-green-700 font-semibold">{successMsg}</p>
          )}

          <label className="block mb-4">
            <span className="text-gray-700 font-medium">{t("months_to_add")}</span>
            <input
              type="number"
              min="1"
              value={months}
              onChange={(e) => setMonths(e.target.value)}
              className="mt-1 block w-full border border-green-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder={t("example_months")}
              required
            />
          </label>

          <label className="block mb-6">
            <span className="text-gray-700 font-medium">{t("sessions_to_add")}</span>
            <input
              type="number"
              min="1"
              value={sessions}
              onChange={(e) => setSessions(e.target.value)}
              className="mt-1 block w-full border border-green-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder={t("example_sessions")}
              required
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md transition"
          >
            {loading ? t("renewing") : t("renew_subscription")}
          </button>
        </form>

        {newSubscription && (
          <div className="mt-6 p-4 bg-green-100 rounded-md text-green-800 font-semibold text-center">
            <p>{t("new_expiration_date")}: {newSubscription.subscription_expires_at.split("T")[0]}</p>
            <p>{t("remaining_sessions")}: {newSubscription.remaining_sessions}</p>
          </div>
        )}

        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-green-600 underline"
        >
          {t("back_to_subscribers")}
        </button>
      </div>
    </div>
  );
}
