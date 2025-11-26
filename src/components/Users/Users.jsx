import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";
import { Link } from "react-router-dom";

export default function UsersList() {
  const { token } = useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-[1200px] mx-auto">


        {/* Title */}
        <h2 className="text-2xl font-bold mb-6 text-center">
          Users List
        </h2>

        {/* Loading */}
        {loading && <p className="text-center text-gray-600">Loading...</p>}

        {/* Error */}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* Users Table */}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Remaining Sessions</th>
                  <th className="p-3">Created At</th>
                  <th className="p-3">Actions</th> {/* عمود جديد */}
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50 text-center">
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">
                      <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                        {user.role}
                      </span>
                    </td>
                    <td className="p-3">{user.phone}</td>
                    <td className="p-3">
                      {user.is_active ? (
                        <span className="text-green-600 font-semibold">Active</span>
                      ) : (
                        <span className="text-red-600 font-semibold">Inactive</span>
                      )}
                    </td>
                    <td className="p-3">{user.remaining_sessions}</td>
                    <td className="p-3">{user.created_at.split("T")[0]}</td>

                    {/* زرار التعديل */}
                    <td className="p-3">
         <Link
  to={`/admin/users/edit/${user.id}`}
  state={{ user }} // هنا بنرسل بيانات المستخدم كامل مع الرابط
  className="text-white bg-green-600 hover:bg-green-700 px-4 py-1 rounded-md"
>
  Edit
</Link>


                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}
