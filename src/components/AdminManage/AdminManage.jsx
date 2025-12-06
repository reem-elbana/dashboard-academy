
import { useTranslation } from "react-i18next";
import { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Pencil, Trash2, Plus, QrCode } from "lucide-react";
import { hasPermission } from "../../Context/permissions";


export default function AdminList() {
  const { token } = useContext(AuthContext);
   const { t } = useTranslation();
  const navigate = useNavigate();

  const BASE_URL = "https://generous-optimism-production-4492.up.railway.app/api";

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("admin"); // default admin
  const [deletingIds, setDeletingIds] = useState({});
  const [qrGeneratingIds, setQrGeneratingIds] = useState({});
  const [qrModalData, setQrModalData] = useState(null);
  const [qrError, setQrError] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 15;
  const [hasMore, setHasMore] = useState(true);
  const pageRef = useRef(1);
  const { permissions } = useContext(AuthContext);


  // axios instance with auth header
  const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
      "Content-Type": "application/json",
    },
  });

  // fetch users based on roleFilter only (admin or super_admin)
  const fetchUsers = async ({ page = 1, append = false, searchQuery = "" } = {}) => {
    try {
      if (!append) {
        setLoading(true);
        setError("");
      }
      if (append) setLoadingMore(true);

      const params = {
        per_page: perPage,
        page,
        role: roleFilter,
      };
      if (searchQuery.trim() !== "") {
        params.search = searchQuery.trim();
      }

      const res = await axiosInstance.get("/admin/users", { params });

      const resultList = Array.isArray(res?.data?.data?.data) ? res.data.data.data : [];
      if (append) {
        setUsers((prev) => [...prev, ...resultList]);
      } else {
        setUsers(resultList);
      }

      const totalReturned = res?.data?.data?.total ?? 0;
      setHasMore(page * perPage < totalReturned);

      setError("");
    } catch (err) {
      console.error("fetchUsers error", err?.response || err);
      setError("Error loading users");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // on role or page change
  useEffect(() => {
    pageRef.current = 1;
    setPage(1);
    fetchUsers({ page: 1, append: false, searchQuery: search });
  }, [roleFilter]);

  // search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      pageRef.current = 1;
      setPage(1);
      fetchUsers({ page: 1, append: false, searchQuery: search });
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // infinite scroll
  useEffect(() => {
    const onScroll = () => {
      if (loadingMore || !hasMore) return;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= documentHeight - 120) {
        setLoadingMore(true);
        pageRef.current += 1;
        setPage(pageRef.current);
        fetchUsers({ page: pageRef.current, append: true, searchQuery: search });
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [loadingMore, hasMore, roleFilter, search]);

  // delete user
  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setDeletingIds((prev) => ({ ...prev, [userId]: true }));
    try {
      const res = await axiosInstance.delete(`/admin/users/${userId}`);
      if (res.data?.success) {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
      } else {
        setError("Failed to delete user");
      }
    } catch (err) {
      console.error("delete error", err?.response || err);
      setError("Error deleting user");
    } finally {
      setDeletingIds((prev) => ({ ...prev, [userId]: false }));
    }
  };

  // generate QR code
  const handleGenerateQR = async (userId) => {
    setQrError("");
    setQrGeneratingIds((prev) => ({ ...prev, [userId]: true }));
    try {
      const res = await axiosInstance.post(`/admin/generate-profile-qr/${userId}`, {});
      if (res.data?.success) {
        setQrModalData(res.data.data);
      } else {
        setQrError("Failed to generate QR code");
      }
    } catch (err) {
      console.error("qr error", err?.response || err);
      setQrError("An error occurred while generating QR");
    } finally {
      setQrGeneratingIds((prev) => ({ ...prev, [userId]: false }));
    }
  };

  // navigate to create user page
  const handleCreate = () => {
    navigate("/admin/create-admin");
  };

  return  (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-10">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-lg p-6 sm:p-8" dir="ltr">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">{t("adminsManagement")}</h2>
            <p className="text-gray-500 text-sm sm:text-base">{t("viewAndManageAdmins")}</p>
          </div>

          <div className="flex items-center gap-3">
            {hasPermission(permissions, "admins.create") && (
            <button onClick={handleCreate} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow">
              <Plus className="w-4 h-4" />
              {t("createAdmin")}
            </button>
)}

          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-lg p-4 mb-6 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-sm">{t("role")}:</label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="border px-3 py-2 rounded-md"
              >
                <option value="admin">{t("admin")}</option>
                <option value="super_admin">{t("superAdmin")}</option>
              </select>
            </div>

            <div className="flex-1 flex items-center gap-2">
              <input
                type="text"
                dir="rtl"
                placeholder={t("searchByNameOrEmail")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 border px-3 py-2 rounded-lg"
              />
              <button
                onClick={() => {
                  pageRef.current = 1;
                  setPage(1);
                  fetchUsers({ page: 1, append: false, searchQuery: search });
                }}
                className="px-4 py-2 bg-gray-100 rounded-md"
              >
                {t("search")}
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        {loading && <p className="text-center text-gray-600">{t("loading")}</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {qrError && <p className="text-center text-red-500">{qrError}</p>}

        {/* Table desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="p-3">{t("name")}</th>
                <th className="p-3">{t("email")}</th>
                <th className="p-3">{t("role")}</th>
                <th className="p-3">{t("status")}</th>
                <th className="p-3">{t("joinedAt")}</th>
                <th className="p-3">{t("actions")}</th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 && !loading ? (
                <tr><td colSpan={6} className="p-6 text-center text-gray-500">{t("noUsersFound")}</td></tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-center gap-3">
                      <div className="flex justify-center items-center">
                        <div className="font-medium pl-5">{user.name}</div>
                      </div>
                    </td>

                    <td className="p-3">{user.email}</td>

                    <td className="p-3">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {user.role === "super_admin" ? t("superAdmin") : t("admin")}
                      </span>
                    </td>

                    <td className="p-3">
                      {user.is_active ? (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">{t("active")}</span>
                      ) : (
                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">{t("inactive")}</span>
                      )}
                    </td>

                    <td className="p-3">{user.created_at ? user.created_at.split("T")[0] : "-"}</td>

                    <td className="p-3 flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleGenerateQR(user.id)}
                        disabled={qrGeneratingIds[user.id]}
                        className="text-green-600 hover:text-green-800 transition"
                        title={t("profileQrCode")}
                      >
                        {qrGeneratingIds[user.id] ? "..." : <QrCode className="w-5 h-5" />}
                      </button>

                      <Link to={`/admin/users/edit/${user.id}`} state={{ user }} className="text-blue-600 hover:text-blue-800 transition" title={t("edit")}>
                        <Pencil className="w-5 h-5" />
                      </Link>

                      <button
                        onClick={() => handleDelete(user.id)}
                        disabled={deletingIds[user.id]}
                        className="text-red-600 hover:text-red-800 transition"
                        title={t("delete")}
                      >
                        {deletingIds[user.id] ? "..." : <Trash2 className="w-5 h-5" />}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* loading more */}
        {loadingMore && <p className="text-center text-gray-600 mt-4">{t("loadingMore")}</p>}

        {/* Mobile view */}
        <div className="md:hidden">
          {users.length === 0 && !loading ? (
            <p className="text-center text-gray-500">{t("noUsersFound")}</p>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="bg-white p-4 rounded-xl shadow border border-gray-200">
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button onClick={() => handleGenerateQR(user.id)} disabled={qrGeneratingIds[user.id]} className="text-green-600 hover:text-green-800">
                        {qrGeneratingIds[user.id] ? "..." : <QrCode className="w-5 h-5" />}
                      </button>

                      <Link to={`/admin/users/edit/${user.id}`} state={{ user }} className="text-blue-600 hover:text-blue-800">
                        <Pencil className="w-5 h-5" />
                      </Link>

                      <button onClick={() => handleDelete(user.id)} disabled={deletingIds[user.id]} className="text-red-600 hover:text-red-800">
                        {deletingIds[user.id] ? "..." : <Trash2 className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="mt-2">
                    <div className="inline-block px-3 py-1 rounded-full text-sm font-semibold text-blue-700 bg-blue-100">
                      {user.role === "super_admin" ? t("superAdmin") : t("admin")}
                    </div>

                    <p className="mt-2 text-sm">
                      {t("status")}:{" "}
                      {user.is_active ? <span className="text-green-600 font-semibold">{t("active")}</span> : <span className="text-red-600 font-semibold">{t("inactive")}</span>}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">{t("joinedAt")}: {user.created_at ? user.created_at.split("T")[0] : "-"}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* QR Modal */}
        {qrModalData && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" onClick={() => setQrModalData(null)}>
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-semibold text-center mb-4">{t("profileQrCode")}</h3>

              <div className="flex justify-center mb-4">
                <img src={qrModalData.qr_code_url} alt="Profile QR" className="w-48 h-48 object-contain" />
              </div>

              <div className="text-center">
                <p className="font-semibold text-gray-800 mb-2">{t("profileOf")} {qrModalData.user?.name}</p>
                {qrModalData.expires_at && (
                  <p className="text-gray-500 text-sm">{t("expiresAt")}: {new Date(qrModalData.expires_at).toLocaleDateString()}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}