import { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Pencil, Trash2, Plus } from "lucide-react";

export default function UsersList() {
  const { token, userRole } = useContext(AuthContext);
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [deletingIds, setDeletingIds] = useState({});
  const [roleFilter, setRoleFilter] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const pageRef = useRef(1);

  const availableRoles =
    userRole === "super-admin"
      ? ["subscriber", "admin", "super-admin"]
      : ["subscriber", "admin", "super-admin"];

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

      setFilteredUsers((prev) => append ? [...prev, ...result] : result);

      if (result.length < 5) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      setLoading(false);
      setLoadingMore(false);
    } catch {
      setError("An error occurred while loading users.");
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

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadingMore, hasMore, roleFilter, search]);

  const handleDelete = async (userId) => {
    const userToDelete = users.find((u) => u.id === userId);

    if (userRole !== "super-admin" && userToDelete.role === "super-admin") {
      alert("You are not allowed to delete a Super Admin.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this user?")) return;

    setDeletingIds((prev) => ({ ...prev, [userId]: true }));

    try {
      const response = await axios.delete(
        `https://generous-optimism-production-4492.up.railway.app/api/admin/users/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setUsers((prev) => prev.filter((user) => user.id !== userId));
      } else {
        setError("Failed to delete the user.");
      }
    } catch {
      setError("An error occurred while deleting the user.");
    } finally {
      setDeletingIds((prev) => ({ ...prev, [userId]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-10">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-lg p-6 sm:p-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Users Management
            </h2>
            <p className="text-gray-500 text-sm sm:text-base">
              View and manage all users
            </p>
          </div>
        </div>

        {/* Role Filter + Search + Create */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6 justify-end">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full sm:w-52 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="">All roles</option>
            {availableRoles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search for a user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />

          <button
            onClick={() => navigate("/admin/create-user")}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto px-5 py-2.5 rounded-lg shadow transition"
          >
            <Plus className="w-5 h-5" />
            Create User
          </button>
        </div>

        {loading && <p className="text-center text-gray-600">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* TABLE - Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Status</th>
                <th className="p-3">Joined At</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>

                  <td className="p-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                      {user.role}
                    </span>
                  </td>

                  <td className="p-3">
                    {user.is_active ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">
                        Active
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full">
                        Inactive
                      </span>
                    )}
                  </td>

                  <td className="p-3">{user.created_at.split("T")[0]}</td>

                  <td className="p-3 flex items-center justify-center gap-4">

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

        {loadingMore && <p className="text-center text-gray-600 mt-4">Loading more...</p>}

        {/* MOBILE View */}
        <div className="md:hidden">
          {filteredUsers.length === 0 ? (
            <p className="text-center text-gray-500">No users found.</p>
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
                      {user.role}
                    </span>
                  </p>
                  <p className="mt-1">
                    Status:{" "}
                    {user.is_active ? (
                      <span className="text-green-600 font-semibold">Active</span>
                    ) : (
                      <span className="text-red-600 font-semibold">Inactive</span>
                    )}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Joined: {user.created_at.split("T")[0]}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {loadingMore && <p className="text-center text-gray-600 mt-4">Loading more...</p>}
      </div>
    </div>
  );
}
