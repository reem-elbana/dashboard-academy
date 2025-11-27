import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";
import { Link } from "react-router-dom";

export default function UsersList() {
  const { token } = useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingIds, setDeletingIds] = useState({});

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(
        "https://generous-optimism-production-4492.up.railway.app/api/admin/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(data.data.data);
      setLoading(false);
    } catch (err) {
      setError("An error occurred while loading users");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }

    setDeletingIds((prev) => ({ ...prev, [userId]: true }));
    setError("");

    try {
      const response = await axios.delete(
        `https://generous-optimism-production-4492.up.railway.app/api/admin/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      } else {
        setError("Failed to delete the user.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred while deleting the user.");
    } finally {
      setDeletingIds((prev) => ({ ...prev, [userId]: false }));
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-10 bg-gray-100">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-xl p-6 md:p-10">

        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-8 text-green-700">
          Users List
        </h2>

        {/* Loading */}
        {loading && <p className="text-center text-gray-600">Loading...</p>}

        {/* Error */}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* MOBILE VERSION — CARDS */}
        <div className="grid gap-6 md:hidden">
          {users.map((user) => (
            <div key={user.id} className="p-4 bg-gray-50 rounded-2xl shadow border">
              <p><span className="font-semibold">Name:</span> {user.name}</p>
              <p><span className="font-semibold">Email:</span> {user.email}</p>
              <p><span className="font-semibold">Phone:</span> {user.phone}</p>
              <p><span className="font-semibold">Role:</span> {user.role}</p>
              <p>
                <span className="font-semibold">Status:</span>{" "}
                {user.is_active ? "Active" : "Inactive"}
              </p>
              <p>
                <span className="font-semibold">Remaining Sessions:</span>{" "}
                {user.remaining_sessions}
              </p>
              <p>
                <span className="font-semibold">Created:</span>{" "}
                {user.created_at.split("T")[0]}
              </p>

             {/* For mobile cards buttons container */}
<div className="mt-4 flex justify-center gap-4">
  <Link
    to={`/admin/users/edit/${user.id}`}
    state={{ user }}
    className="flex-1 text-center text-green-700 border border-green-700 hover:bg-green-700 hover:text-white transition px-4 py-2 rounded-md font-semibold text-sm"
  >
    Edit
  </Link>
  <button
    onClick={() => handleDelete(user.id)}
    disabled={deletingIds[user.id]}
    className="flex-1 text-center text-red-700 border border-red-700 hover:bg-red-700 hover:text-white transition px-4 py-2 rounded-md font-semibold text-sm"
  >
    {deletingIds[user.id] ? "Deleting..." : "Delete"}
  </button>
</div>

            </div>
          ))}
        </div>

        {/* DESKTOP VERSION — TABLE */}
        <div className="hidden md:block overflow-x-auto mt-5">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="p-2 text-centert">Name</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Role</th>
                <th className="p-2 text-left">Phone</th>
                <th className="p-2 text-left">Status</th>
                <th className="text-center">Remaining Sessions</th>
                <th className="p-2 text-left">Created At</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{user.name}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                      {user.role}
                    </span>
                  </td>
                  <td className="p-2">{user.phone}</td>
                  <td className="p-2">
                    {user.is_active ? (
                      <span className="text-green-600 font-semibold">Active</span>
                    ) : (
                      <span className="text-red-600 font-semibold">Inactive</span>
                    )}
                  </td>
                  <td className="p-2 text-center">{user.remaining_sessions}</td>
                  <td className="p-2">{user.created_at.split("T")[0]}</td>
{/* For desktop table buttons cell */}
<td className="p-2 flex justify-center gap-3 max-w-[160px]">
  <Link
    to={`/admin/users/edit/${user.id}`}
    state={{ user }}
    className="flex-1 text-center text-green-700 border border-green-700 hover:bg-green-700 hover:text-white transition px-3 py-1.5 rounded-md font-semibold text-xs"
  >
    Edit
  </Link>
  <button
    onClick={() => handleDelete(user.id)}
    disabled={deletingIds[user.id]}
    className="flex-1 text-center text-red-700 border border-red-700 hover:bg-red-700 hover:text-white transition px-3 py-1.5 rounded-md font-semibold text-xs"
  >
    {deletingIds[user.id] ? "Deleting..." : "Delete"}
  </button>
</td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
