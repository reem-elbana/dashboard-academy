import { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Pencil, Trash2, Plus, QrCode } from "lucide-react";
import { useTranslation } from "react-i18next";
import { hasPermission } from "../../Context/permissions";

export default function UsersList() {
  const { t, i18n } = useTranslation();
  const { token, permissions } = useContext(AuthContext);
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");
  const [subscriptionFilter, setSubscriptionFilter] = useState("all");

  const [deletingIds, setDeletingIds] = useState({});
  const [qrGeneratingIds, setQrGeneratingIds] = useState({});
  const [qrModalData, setQrModalData] = useState(null);

  const [totalUsers, setTotalUsers] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // صفحة التحميل الحالية
  const pageRef = useRef(1);

  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  const isSubscriptionExpired = (user) => {
    if (!user.subscription_expires_at) return true;
    return new Date(user.subscription_expires_at) < new Date();
  };

  const isSubscriptionNearExpiry = (user) => {
    if (!user.subscription_expires_at) return false;
    const today = new Date();
    const expiryDate = new Date(user.subscription_expires_at);
    const diffDays = (expiryDate - today) / (1000 * 60 * 60 * 24);
    return diffDays > 0 && diffDays <= 7;
  };


const fetchUsers = async (page = 1, append = false) => {
  try {
    if (!append) setLoading(true);
    else setLoadingMore(true);

   
    const url = `https://generous-optimism-production-4492.up.railway.app/api/admin/users?per_page=5&role=subscriber&page=${page}`;

    const { data } = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const fetchedUsers = data.data.data || [];
    setTotalUsers(data.data.total || 0);
    setHasMore(data.data.current_page < data.data.last_page);

    if (append) setUsers((prev) => [...prev, ...fetchedUsers]);
    else setUsers(fetchedUsers);

    setLoading(false);
    setLoadingMore(false);
  } catch (err) {
    setError(t("errorLoadingUsers"));
    setLoading(false);
    setLoadingMore(false);
  }
};


  useEffect(() => {
    pageRef.current = 1;
    fetchUsers(1, false);
  }, []);

  // فلترة المستخدمين حسب الحالة والاشتراك والبحث
  const filteredUsers = users.filter((user) => {
    if (statusFilter === "active" && !user.is_active) return false;
    if (statusFilter === "inactive" && user.is_active) return false;

    if (subscriptionFilter === "expired" && !isSubscriptionExpired(user)) return false;
    if (subscriptionFilter === "valid" && isSubscriptionExpired(user)) return false;
    if (subscriptionFilter === "near_expiry" && !isSubscriptionNearExpiry(user)) return false;

    if (search) {
      const searchLower = search.toLowerCase();
      if (
        !user.name.toLowerCase().includes(searchLower) &&
        !user.email.toLowerCase().includes(searchLower)
      )
        return false;
    }

    return true;
  });

  useEffect(() => {
    if (
      search.trim() !== "" ||
      statusFilter !== "all" ||
      subscriptionFilter !== "all" ||
      loading ||
      loadingMore ||
      error ||
      !hasMore
    )
      return;

    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100
      ) {
        pageRef.current += 1;
        fetchUsers(pageRef.current, true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [search, statusFilter, subscriptionFilter, loading, loadingMore, error, hasMore]);

  const handleDelete = async (id) => {
    if (!window.confirm(t("deleteConfirmation"))) return;

    setDeletingIds((p) => ({ ...p, [id]: true }));

    try {
      await axios.delete(
        `https://generous-optimism-production-4492.up.railway.app/api/admin/users/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch {
      setError(t("errorDeleteUser"));
    } finally {
      setDeletingIds((p) => ({ ...p, [id]: false }));
    }
  };

  const handleGenerateQR = async (id) => {
    setQrGeneratingIds((p) => ({ ...p, [id]: true }));

    try {
      const res = await axios.post(
        `https://generous-optimism-production-4492.up.railway.app/api/admin/generate-profile-qr/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) setQrModalData(res.data.data);
    } catch (err) {
      setError(t("failed_generate_profile_qr"));
    } finally {
      setQrGeneratingIds((p) => ({ ...p, [id]: false }));
    }
  };

  if (!hasPermission(permissions, "users.view")) {
    return (
      <div className="text-center text-red-500 text-xl mt-10">
        {t("you do not have permission to view this page")}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-lg p-6">
        <h2 className="text-3xl font-bold mb-2 text-forsan-green">{t("usersManagement")}</h2>
        <p className="text-forsan-dark font-semibold mb-4">
          {t("total_users")}: {totalUsers}
        </p>

        {/* البحث + الفلاتر */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border rounded-lg w-full"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="all">{t("all_status")}</option>
            <option value="active">{t("active")}</option>
            <option value="inactive">{t("inactive")}</option>
          </select>

          <select
            value={subscriptionFilter}
            onChange={(e) => setSubscriptionFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="all">{t("all_subscriptions")}</option>
            <option value="valid">{t("subscription_valid")}</option>
            <option value="expired">{t("subscription_expired")}</option>
            <option value="near_expiry">{t("near_expiry")}</option>
          </select>

          {hasPermission(permissions, "users.create") && (
            <button
              onClick={() => navigate("/admin/create-user")}
              className="bg-forsan-dark text-white px-5 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              {t("createUser")}
            </button>
          )}
        </div>

        {/* جدول المستخدمين */}
        <div className="overflow-x-auto hidden md:block">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="p-3">{t("usersManagement")}</th>
                <th className="p-3">{t("email")}</th>
                <th className="p-3">{t("role")}</th>
                <th className="p-3">{t("status")}</th>
                <th className="p-3">{t("subscriptionExpiresAt")}</th>
                <th className="p-3">{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="text-center p-4 text-gray-500">
                    {t("noUsersFound")}
                  </td>
                </tr>
              )}

              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                      {t(user.role)}
                    </span>
                  </td>
                  <td className="p-3">
                    {user.is_active ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">
                        {t("active")}
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full">
                        {t("inactive")}
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    {user.subscription_expires_at
                      ? new Date(user.subscription_expires_at).toLocaleDateString()
                      : t("noSubscription")}
                  </td>
                  <td className="p-3 flex items-center justify-center gap-4">
                    <button
                      onClick={() => handleGenerateQR(user.id)}
                      disabled={qrGeneratingIds[user.id]}
                      className="text-green-600 hover:text-green-800 transition"
                    >
                      {qrGeneratingIds[user.id] ? "..." : <QrCode className="w-5 h-5" />}
                    </button>

                    {hasPermission(permissions, "users.edit") && (
                      <Link
                        to={`/admin/users/edit/${user.id}`}
                        state={{ user }}
                        className="text-forsan-dark hover:text-blue-800 transition"
                      >
                        <Pencil className="w-5 h-5" />
                      </Link>
                    )}

                    {hasPermission(permissions, "users.delete") && (
                      <button
                        onClick={() => handleDelete(user.id)}
                        disabled={deletingIds[user.id]}
                        className="text-red-600 hover:text-red-800 transition"
                      >
                        {deletingIds[user.id] ? "..." : <Trash2 className="w-5 h-5" />}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loadingMore && (
            <p className="text-center text-gray-600 py-4">{t("loadingMore")}</p>
          )}
        </div>

        {/* نسخة الموبايل */}
        <div className="md:hidden">
          {filteredUsers.length === 0 && !loading ? (
            <p className="text-center text-gray-500">{t("noUsersFound")}</p>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className="bg-white p-4 rounded-xl shadow border border-gray-200 mb-4"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{user.name}</h3>
                <p className="text-gray-600 mb-1">{user.email}</p>
                <p className="mb-1">
                  <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold text-blue-700 bg-blue-100">
                    {t(user.role)}
                  </span>
                </p>
                <p className="mb-1">
                  {t("status")}:{" "}
                  {user.is_active ? (
                    <span className="text-green-600 font-semibold">{t("active")}</span>
                  ) : (
                    <span className="text-red-600 font-semibold">{t("inactive")}</span>
                  )}
                </p>
                <p className="mb-3">
                  {t("subscriptionExpiresAt")}:{" "}
                  {user.subscription_expires_at
                    ? new Date(user.subscription_expires_at).toLocaleDateString()
                    : t("noSubscription")}
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleGenerateQR(user.id)}
                    disabled={qrGeneratingIds[user.id]}
                    className="text-green-600 hover:text-green-800 transition"
                  >
                    {qrGeneratingIds[user.id] ? "..." : <QrCode className="w-5 h-5" />}
                  </button>

                  <Link
                    to={`/admin/users/edit/${user.id}`}
                    state={{ user }}
                    className="text-blue-600 hover:text-blue-800 transition"
                  >
                    <Pencil className="w-5 h-5" />
                  </Link>

                  <button
                    onClick={() => handleDelete(user.id)}
                    disabled={deletingIds[user.id]}
                    className="text-red-600 hover:text-red-800 transition"
                  >
                    {deletingIds[user.id] ? "..." : <Trash2 className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            ))
          )}
          {loadingMore && (
            <p className="text-center text-gray-600 py-4">{t("loadingMore")}</p>
          )}
        </div>
      </div>

      {/* مودال كود QR */}
      {qrModalData && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={() => setQrModalData(null)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-center mb-4">
              {t("profile_qr_code")}
            </h3>

            <div className="flex justify-center mb-4">
              <img
                src={qrModalData.qr_code_url}
                alt="Profile QR Code"
                className="w-100 h-100"
              />
            </div>

            <div className="text-center">
              <p className="font-semibold text-gray-800 mb-2">
                {t("profile_of")} {qrModalData.user?.name}
              </p>
              <p className="text-gray-500 text-sm">
                {t("expires_at")}:{" "}
                {new Date(qrModalData.expires_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
