import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import { useTranslation } from "react-i18next";

export default function EditUser() {
  const { token } = useContext(AuthContext);
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const user = location.state?.user;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    national_id: "",
    role: "subscriber",
    subscriptions: [
      {
        category_id: "",
        offer_id: "",
        payment_method: "cash",
        subscription_starts_at: "",
        subscription_expires_at: "",
        remaining_sessions: "",
      },
    ],
  });

  const [offers, setOffers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const roles = ["subscriber", "admin", "super_admin"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [offersRes, categoriesRes] = await Promise.all([
          axios.get("https://generous-optimism-production-4492.up.railway.app/api/admin/offers?per_page=15&status=active", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get("https://generous-optimism-production-4492.up.railway.app/api/content/categories")
        ]);

        if (offersRes.data.success) {
          setOffers(offersRes.data.data.offers.data || []);
        } else {
          setOffers([]);
        }

        // Handle categories response
        if (categoriesRes.data.success) {
          setCategories(categoriesRes.data.categories || []);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };
    fetchData();
  }, [token]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!id) return;

      try {
        const response = await axios.get(
          `https://generous-optimism-production-4492.up.railway.app/api/admin/users/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
          const userData = response.data.data;
          setFormData({
            name: userData.name || "",
            email: userData.email || "",
            phone: userData.phone || "",
            national_id: userData.national_id || "",
            role: userData.role || "subscriber",
            subscriptions: userData.subscriptions && userData.subscriptions.length > 0 ? userData.subscriptions.map(sub => ({
              category_id: sub.category_id || "",
              offer_id: sub.offer_id || "",
              payment_method: sub.payment_method || "cash",
              subscription_starts_at: sub.subscription_starts_at ? sub.subscription_starts_at.split("T")[0] : "",
              subscription_expires_at: sub.subscription_expires_at ? sub.subscription_expires_at.split("T")[0] : "",
              remaining_sessions: sub.remaining_sessions || "",
            })) : [
              {
                category_id: "",
                offer_id: "",
                payment_method: "cash",
                subscription_starts_at: "",
                subscription_expires_at: "",
                remaining_sessions: "",
              }
            ],
            is_active: userData.is_active ?? true,
          });
        }
      } catch (error) {
        console.error("Failed to fetch user details", error);
      }
    };

    fetchUserDetails();
  }, [id, token]);

  useEffect(() => {
    if (!user) {
      navigate("/admin/users");
      return;
    }

    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      national_id: user.national_id || "",
      role: user.role || "subscriber",
      subscriptions: user.subscriptions && user.subscriptions.length > 0 ? user.subscriptions.map(sub => ({
        category_id: sub.category_id || "",
        offer_id: sub.offer_id || "",
        payment_method: sub.payment_method || "cash",
        subscription_starts_at: sub.subscription_starts_at ? sub.subscription_starts_at.split("T")[0] : "",
        subscription_expires_at: sub.subscription_expires_at ? sub.subscription_expires_at.split("T")[0] : "",
        remaining_sessions: sub.remaining_sessions || "",
      })) : [
        {
          category_id: "",
          offer_id: "",
          payment_method: "cash",
          subscription_starts_at: "",
          subscription_expires_at: "",
          remaining_sessions: "",
        }
      ],
      is_active: user.is_active ?? true,
    });
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addSubscription = () => {
    setFormData((prev) => ({
      ...prev,
      subscriptions: [
        ...prev.subscriptions,
        {
          category_id: "",
          offer_id: "",
          payment_method: "cash",
          subscription_starts_at: "",
          subscription_expires_at: "",
          remaining_sessions: "",
        },
      ],
    }));
  };

  const removeSubscription = (index) => {
    setFormData((prev) => ({
      ...prev,
      subscriptions: prev.subscriptions.filter((_, i) => i !== index),
    }));
  };

  const handleSubscriptionChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      subscriptions: prev.subscriptions.map((sub, i) =>
        i === index ? { ...sub, [field]: value } : sub
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const res = await axios.put(
        `https://generous-optimism-production-4492.up.railway.app/api/admin/users/${id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setSuccessMsg(t("user_updated_successfully"));
      } else {
        setErrorMsg(t("failed_to_update_user"));
      }
    } catch (error) {
      setErrorMsg(error.response?.data?.message || t("failed_to_update_user"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center p-6">
      <div className="bg-white w-full max-w-xl p-6 rounded-2xl shadow-md border border-gray-200">
        <h2 className="text-2xl font-semibold mb-6 text-center text-green-700 tracking-tight">
          {t("update_user")}
        </h2>

        {successMsg && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg text-center font-medium shadow-sm border border-green-300">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg text-center font-medium shadow-sm border border-red-300">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block mb-1 font-medium text-gray-800 text-base">
              {t("name")}
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder={t("name")}
              className="w-full p-3 border border-gray-300 rounded-lg text-base bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-400 outline-none transition"
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-1 font-medium text-gray-800 text-base">
              {t("email")}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder={t("email")}
              className="w-full p-3 border border-gray-300 rounded-lg text-base bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-400 outline-none transition"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block mb-1 font-medium text-gray-800 text-base">
              {t("phone")}
            </label>
            <input
              id="phone"
              name="phone"
              type="text"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder={t("phone")}
              className="w-full p-3 border border-gray-300 rounded-lg text-base bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-400 outline-none transition"
            />
          </div>

          <div>
            <label htmlFor="national_id" className="block mb-1 font-medium text-gray-800 text-base">
              {t("national_id")}
            </label>
            <input
              id="national_id"
              name="national_id"
              type="text"
              required
              value={formData.national_id}
              onChange={handleChange}
              placeholder={t("national_id")}
              className="w-full p-3 border border-gray-300 rounded-lg text-base bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-400 outline-none transition"
            />
          </div>

          <div>
            <label htmlFor="role" className="block mb-1 font-medium text-gray-800 text-base">
              {t("role")}
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg text-base bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-400 outline-none transition"
            >
              {roles.map((r) => (
                <option key={r} value={r}>
                  {t(r)}
                </option>
              ))}
            </select>
          </div>

          {formData.role === "subscriber" && (
            <div>
              <label className="block mb-2 font-medium text-gray-800 text-base">{t("subscriptions")}</label>
              {formData.subscriptions.map((sub, index) => (
                <div key={index} className="border border-gray-300 rounded-lg p-4 mb-4 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 font-medium text-gray-700 text-sm">{t("category")}</label>
                      <select
                        value={sub.category_id}
                        onChange={(e) => handleSubscriptionChange(index, "category_id", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-green-400 outline-none transition"
                      >
                        <option value="">{t("select_category")}</option>
                        {Array.isArray(categories) && categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block mb-1 font-medium text-gray-700 text-sm">{t("offer")}</label>
                      <select
                        value={sub.offer_id}
                        onChange={(e) => handleSubscriptionChange(index, "offer_id", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-green-400 outline-none transition"
                      >
                        <option value="">{t("select_offer")}</option>
                        {Array.isArray(offers) && offers.map((offer) => (
                          <option key={offer.id} value={offer.id}>
                            {offer.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block mb-1 font-medium text-gray-700 text-sm">{t("payment_method")}</label>
                      <select
                        value={sub.payment_method}
                        onChange={(e) => handleSubscriptionChange(index, "payment_method", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-green-400 outline-none transition"
                        required
                      >
                        <option value="cash">{t("cash")}</option>
                        <option value="visa">{t("visa")}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block mb-1 font-medium text-gray-700 text-sm">{t("subscription_starts_at")}</label>
                      <input
                        type="date"
                        value={sub.subscription_starts_at}
                        onChange={(e) => handleSubscriptionChange(index, "subscription_starts_at", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-green-400 outline-none transition"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-1 font-medium text-gray-700 text-sm">{t("subscription_expires_at")}</label>
                      <input
                        type="date"
                        value={sub.subscription_expires_at}
                        onChange={(e) => handleSubscriptionChange(index, "subscription_expires_at", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-green-400 outline-none transition"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block mb-1 font-medium text-gray-700 text-sm">{t("remaining_sessions")}</label>
                      <input
                        type="number"
                        value={sub.remaining_sessions}
                        onChange={(e) => handleSubscriptionChange(index, "remaining_sessions", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-green-400 outline-none transition"
                        placeholder="0"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSubscription(index)}
                    className="mt-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-1 px-3 rounded-lg transition"
                  >
                    {t("remove_subscription")}
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addSubscription}
                className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-lg transition"
              >
                {t("add_subscription")}
              </button>
            </div>
          )}

          <label className="inline-flex items-center mb-6 cursor-pointer select-none">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="mr-2 w-5 h-5 text-green-600 focus:ring-green-400 border-gray-300 rounded"
            />
            <span className="text-gray-800 font-medium">{t("active_user")}</span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 shadow"
          >
            {loading ? t("updating") : t("update_user")}
          </button>
        </form>
      </div>
    </div>
  );
}
