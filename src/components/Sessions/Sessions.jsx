import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";
import { useTranslation } from "react-i18next";

export default function Offers() {
  const { token } = useContext(AuthContext);
  const { t } = useTranslation();

  const [sessions, setSessions] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        // جلب الحصص
        const sessionsRes = await axios.get(
          "https://generous-optimism-production-4492.up.railway.app/api/subscriber/training-sessions",
          { headers: { Authorization: `Bearer ${token}` } }
        );
          console.log(sessionsRes);
        setSessions(sessionsRes.data?.data || []);

        // جلب العروض / التنبيهات
        const dashboardRes = await axios.get(
          "https://generous-optimism-production-4492.up.railway.app/api/subscriber/dashboard",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const recommendations = dashboardRes.data?.data?.data?.recommendations || [];
        setOffers(recommendations.filter((r) => r.type === "renewal" || r.type === "sessions"));
      } catch (err) {
        setError(err.response?.data?.message || err.message || t("fetch_error"));
      } finally {
        setLoading(false);
      }
      
    };
  

    fetchData();
  }, [token, t]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>{t("loading")}...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-6">

        {/* عنوان الصفحة */}
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-4xl font-semibold text-gray-900 tracking-tight">
            {t("My_sessions & offers")}
          </h1>
          <p className="text-lg text-gray-600 mt-3 font-medium">
            {t("manage_your_sessions_and_offers")}
          </p>
        </div>

        {/* قسم العروض */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
            {t("current_offers")}
          </h2>

          {/* {error && <p className="text-red-500 mb-4">{error}</p>} */}

          {offers.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offers.map((offer, i) => (
                <div key={i} className="p-4 rounded-xl bg-green-50 border border-green-200">
                  <h3 className="font-bold text-gray-900">{offer.title}</h3>
                  <p className="text-gray-700 mt-1">{offer.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-12">{t("no_offers_currently")}</p>
          )}
        </section>

        {/* قسم الحصص */}
        <section>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
            {t("My_sessions")}
          </h2>

          {sessions.length > 0 ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {sessions.map((session) => (
                <div key={session.id} className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
                  <h3 className="font-bold text-gray-900">{session.name}</h3>
                  <p className="text-gray-700 mt-1">
                    {new Date(session.date).toLocaleDateString("ar-EG", { weekday: "long", day: "numeric", month: "long" })}
                  </p>
                  <p className="text-gray-700">
                    {new Date(session.date).toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                  <p className="text-emerald-600 font-semibold mt-2">
                    {t("remaining_sessions")}: {session.remaining_sessions}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-12">{t("no_sessions_booked")}</p>
          )}
        </section>

      </div>
    </div>
  );
}