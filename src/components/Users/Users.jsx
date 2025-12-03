import { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Pencil, Trash2, Plus, QrCode } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function UsersList() {
  const { t, i18n } = useTranslation();
  const { token, userRole } = useContext(AuthContext);
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
  const [roleFilter, setRoleFilter] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const pageRef = useRef(1);

  // ضبط الاتجاه تلقائيًا حسب اللغة (RTL للعربية)
  useEffect(() => {
    if (i18n.language === "ar") {
      document.documentElement.dir = "rtl";
    } else {
      document.documentElement.dir = "ltr";
    }
  }, [i18n.language]);

  const availableRoles =
    userRole === "super-admin"
      ? ["subscriber", "admin", "super-admin"]
      : ["subscriber", "admin"];

  const fetchUsers = async (role = "", page = 1, append = false, searchQuery = "") => {
    try {
      const roleParam = role ? `&role=${role}` : "";
      const searchParam = searchQuery ? `&search=${searchQuery}` : "";
      const url = `https://generous-optimism-production-4492.up.railway.app/api/admin/users?per_page=5&page=${page}${roleParam}${searchParam}`;

      const { data } = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let result = Array.isArray(data.data.data) ? data.data.data : [];

      if (userRole !== "super-admin") {
        result = result.filter((u) => u.role !== "super-admin");
      }

      if (append) {
        setUsers((prev) => [...prev, ...result]);
      } else {
        setUsers(result);
      }

      setFilteredUsers((prev) => (append ? [...prev, ...result] : result));

      setHasMore(result.length === 5);
      setTotalUsers(data.data.total || 0);
      setLoading(false);
      setLoadingMore(false);
    } catch {
      setError(t("errorLoadingUsers"));
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchUsers("", 1, false, "");
  }, []);

  useEffect(() => {
    pageRef.current = 1;
    setHasMore(true);
    setUsers([]);
    setFilteredUsers([]);
    fetchUsers(roleFilter, 1, false, search);
  }, [roleFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      pageRef.current = 1;
      setHasMore(true);
      setUsers([]);
      setFilteredUsers([]);
      fetchUsers(roleFilter, 1, false, search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const handleScroll = () => {
      if (loadingMore || !hasMore) return;

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= documentHeight - 100) {
        setLoadingMore(true);
        pageRef.current += 1;
        fetchUsers(roleFilter, pageRef.current, true, search);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadingMore, hasMore, roleFilter, search]);

  const handleDelete = async (userId) => {
    const userToDelete = users.find((u) => u.id === userId);

    if (userRole !== "super-admin" && userToDelete.role === "super-admin") {
      alert(t("notAllowedDeleteSuperAdmin"));
      return;
    }

    if (!window.confirm(t("deleteConfirmation"))) return;

    setDeletingIds((prev) => ({ ...prev, [userId]: true }));

    try {
      const response = await axios.delete(
        `https://generous-optimism-production-4492.up.railway.app/api/admin/users/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setUsers((prev) => prev.filter((user) => user.id !== userId));
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
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">{t("usersManagement")}</h2>
            <p className="text-gray-500 text-sm sm:text-base">{t("viewManageUsers")}</p>
            {!loading && (
              <p className="text-blue-600 text-lg font-semibold mt-2">
                {t("total_users")}: {totalUsers}
              </p>
            )}
          </div>
        </div>

        {/* Role Filter + Search + Create */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6 justify-start">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full sm:w-52 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="">{t("All roles")}</option>
            {availableRoles.map((r) => (
              <option key={r} value={r}>
                {t(r)}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />

          <button
            onClick={() => navigate("/admin/create-user")}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto px-5 py-2.5 rounded-lg shadow transition"
          >
            <Plus className="w-5 h-5" />
            {t("createUser")}
          </button>
        </div>

        {loading && <p className="text-center text-gray-600">{t("loading")}</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {qrError && <p className="text-center text-red-500">{qrError}</p>}

        {/* TABLE - Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="p-3">{t("usersManagement")}</th>
                <th className="p-3">Email</th>
                <th className="p-3">{t("allRoles")}</th>
                <th className="p-3">Status</th>
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
                    {(userRole === "super-admin" || user.role !== "super-admin") && (
                      <button
                        onClick={() => handleGenerateQR(user.id)}
                        disabled={qrGeneratingIds[user.id]}
                        className="text-green-600 hover:text-green-800 transition"
                      >
                        {qrGeneratingIds[user.id] ? "..." : <QrCode className="w-5 h-5" />}
                      </button>
                    )}

                    {(userRole === "super-admin" || user.role !== "super-admin") && (
                      <Link
                        to={`/admin/users/edit/${user.id}`}
                        state={{ user }}
                        className="text-blue-600 hover:text-blue-800 transition"
                      >
                        <Pencil className="w-5 h-5" />
                      </Link>
                    )}

                    {(userRole === "super-admin" || user.role !== "super-admin") && (
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

        {loadingMore && <p className="text-center text-gray-600 mt-4">{t("loadingMore")}</p>}

        {/* MOBILE View */}
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
                    <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
                    {(userRole === "super-admin" || user.role !== "super-admin") && (
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
                    )}
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
                      <span className="text-green-600 font-semibold">{t("active")}</span>
                    ) : (
                      <span className="text-red-600 font-semibold">{t("inactive")}</span>
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

      {/* QR Modal */}
      {qrModalData && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={() => setQrModalData(null)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-center mb-4">{t("profile_qr_code")}</h3>
            <div className="flex justify-center mb-4">
              <img
                src={qrModalData.qr_code_url}
                alt="Profile QR Code"
                className="w-100 h-100"
              />
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-800 mb-2">{t("profile_of")} {qrModalData.user?.name}</p>
              <p className="text-gray-500 text-sm">
                {t("expires_at")}: {new Date(qrModalData.expires_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
