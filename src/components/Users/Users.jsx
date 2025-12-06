

import { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Pencil, Trash2, Plus, QrCode } from "lucide-react";
import { useTranslation } from "react-i18next";
import { hasPermission } from "../../Context/permissions";


export default function UsersList() {
  const { t, i18n } = useTranslation();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [deletingIds, setDeletingIds] = useState({});
  const [qrGeneratingIds, setQrGeneratingIds] = useState({});
  const [qrError, setQrError] = useState("");
  const [qrModalData, setQrModalData] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalSubscribers, setTotalSubscribers] = useState(0);
  const { permissions } = useContext(AuthContext);


    if (!hasPermission(permissions, "users.view")) {
    return (
      <div className="text-center text-red-500 text-xl mt-10">
        {t("you do not have permission to view this page")}
      </div>
    );
  }

  const pageRef = useRef(1);

  // ضبط الاتجاه حسب اللغة
  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  // 🔥 API REQ — Always get ONLY subscribers from server
  const fetchUsers = async (page = 1, append = false, searchQuery = "") => {
    try {
      const searchParam = searchQuery ? `&search=${searchQuery}` : "";
      const url = `https://generous-optimism-production-4492.up.railway.app/api/admin/users?per_page=5&page=${page}&role=subscriber${searchParam}`;

      const { data } = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let result = Array.isArray(data.data.data) ? data.data.data : [];

      if (append) {
        setUsers((prev) => [...prev, ...result]);
      } else {
        setUsers(result);
      }

      setFilteredUsers((prev) => (append ? [...prev, ...result] : result));

      setHasMore(result.length === 5);
      setLoading(false);
      setLoadingMore(false);
      setTotalSubscribers(data.data.total);

    } catch {
      setError(t("errorLoadingUsers"));
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchUsers(1, false, "");
  }, []);

  // Search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      pageRef.current = 1;
      setHasMore(true);
      setUsers([]);
      setFilteredUsers([]);
      fetchUsers(1, false, search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Infinite Scroll
  useEffect(() => {
    const handleScroll = () => {
      if (loadingMore || !hasMore) return;

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= documentHeight - 100) {
        setLoadingMore(true);
        pageRef.current += 1;
        fetchUsers(pageRef.current, true, search);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadingMore, hasMore, search]);

  const handleDelete = async (userId) => {
    if (!window.confirm(t("deleteConfirmation"))) return;

    setDeletingIds((prev) => ({ ...prev, [userId]: true }));

    try {
      const response = await axios.delete(
        `https://generous-optimism-production-4492.up.railway.app/api/admin/users/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setUsers((prev) => prev.filter((user) => user.id !== userId));
        setFilteredUsers((prev) => prev.filter((user) => user.id !== userId));
      } else {
        setError(t("failedDeleteUser"));
      }
    } catch {
      setError(t("errorDeleteUser"));
    } finally {
      setDeletingIds((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const handleGenerateQR = async (userId) => {
    setQrError("");
    setQrGeneratingIds((prev) => ({ ...prev, [userId]: true }));

    try {
      const response = await axios.post(
        `https://generous-optimism-production-4492.up.railway.app/api/admin/generate-profile-qr/${userId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setQrModalData(response.data.data);
      } else {
        setQrError(t("failed_generate_profile_qr"));
      }
    } catch (err) {
      setQrError(t("error_occurred") + ": " + err.message);
    } finally {
      setQrGeneratingIds((prev) => ({ ...prev, [userId]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-10">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-lg p-6 sm:p-8">
        
        {/* Header */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
              {t("usersManagement")}
            </h2>
            <p className="text-gray-500 text-sm sm:text-base">
              {t("viewManageUsers")}
            </p>

            {!loading && (
              <p className="text-blue-600 text-lg font-semibold mt-2">
                {t("total_users")}: {totalSubscribers}
              </p>
            )}
          </div>
        </div>

        {/* Search + Create */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6 justify-start">
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />


          {/* hena  */}

      {hasPermission(permissions, "users.create") && (
  <button
    onClick={() => navigate("/admin/create-user")}
    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto px-5 py-2.5 rounded-lg shadow"
  >
    <Plus className="w-5 h-5" />
    {t("createUser")}
  </button>
)}

        </div>

        {loading && <p className="text-center text-gray-600">{t("loading")}</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {qrError && <p className="text-center text-red-500">{qrError}</p>}

        {/* TABLE */}

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="p-3">{t("usersManagement")}</th>
                <th className="p-3">Email</th>
                <th className="p-3">{t("role")}</th>
                <th className="p-3">{t("status")}</th>
                <th className="p-3">{t("joinedAt")}</th>
                <th className="p-3">{t("actions")}</th>
              </tr>
            </thead>

            <tbody>
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

                  <td className="p-3">{user.created_at.split("T")[0]}</td>

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
    className="text-blue-600 hover:text-blue-800 transition"
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
        </div>

        {loadingMore && (
          <p className="text-center text-gray-600 mt-4">{t("loadingMore")}</p>
        )}

        {/* MOBILE VIEW */}
        <div className="md:hidden">
          {filteredUsers.length === 0 ? (
            <p className="text-center text-gray-500">{t("noUsersFound")}</p>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="bg-white p-4 rounded-xl shadow border border-gray-200"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {user.name}
                    </h3>

                    <div className="flex items-center gap-3">
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

                  <p className="text-gray-600 text-sm">{user.email}</p>

                  <p className="mt-1">
                    <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold text-blue-700 bg-blue-100">
                      {t(user.role)}
                    </span>
                  </p>

                  <p className="mt-1">
                    {t("status")}:{" "}
                    {user.is_active ? (
                      <span className="text-green-600 font-semibold">
                        {t("active")}
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold">
                        {t("inactive")}
                      </span>
                    )}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {t("joinedAt")}: {user.created_at.split("T")[0]}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* QR MODAL */}
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
