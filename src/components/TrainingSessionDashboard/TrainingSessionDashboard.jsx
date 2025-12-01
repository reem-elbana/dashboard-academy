import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";
import { Pencil, Trash2, X } from "lucide-react";

export default function TrainingSessions() {
  const { token } = useContext(AuthContext);

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(null);

  // For edit popup
  const [editingSession, setEditingSession] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    max_participants: "",
    is_active: false,
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);

  // Fetch sessions from API with pagination
  const fetchSessions = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `https://generous-optimism-production-4492.up.railway.app/api/admin/training-sessions?page=${page}&per_page=15&status=active`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        const fetchedSessions = res.data.data.data;

        if (page === 1) {
          setSessions(fetchedSessions);
        } else {
          setSessions((prevSessions) => {
            const filteredNew = fetchedSessions.filter(
              (session) => !prevSessions.some((s) => s.id === session.id)
            );
            return [...prevSessions, ...filteredNew];
          });
        }

        setCurrentPage(res.data.data.current_page);
        setLastPage(res.data.data.last_page);
      } else {
        setError("Failed to load sessions.");
      }
    } catch (err) {
      setError("Error loading sessions.");
    }
    setLoading(false);
  };

  // Load sessions on component mount or token change
  useEffect(() => {
    fetchSessions(1);
  }, [token]);

  // Load more sessions on button click
  const loadMore = () => {
    if (currentPage < lastPage && !loading) {
      fetchSessions(currentPage + 1);
    }
  };

  // Filter sessions by search term (case insensitive)
  const filteredSessions = sessions.filter((session) =>
    session.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Open edit popup and set form data
  const handleUpdate = (session) => {
    setEditingSession(session);
    setEditForm({
      title: session.title,
      max_participants: session.max_participants || "",
      is_active: session.is_active,
    });
    setEditError(null);
  };

  // Handle form input changes
  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Submit edit form
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError(null);

    try {
      const res = await axios.put(
        `https://generous-optimism-production-4492.up.railway.app/api/admin/training-sessions/${editingSession.id}`,
        {
          title: editForm.title,
          max_participants: Number(editForm.max_participants),
          is_active: editForm.is_active,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        // Update session in local state
        setSessions((prev) =>
          prev.map((s) =>
            s.id === editingSession.id ? { ...s, ...res.data.data } : s
          )
        );
        setEditingSession(null);
      } else {
        setEditError("Failed to update the session.");
      }
    } catch (err) {
      setEditError("An error occurred while updating the session.");
    }
    setEditLoading(false);
  };

  // Delete session API call and state update
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this session?")) return;

    try {
      setLoading(true);
      const res = await axios.delete(
        `https://generous-optimism-production-4492.up.railway.app/api/admin/training-sessions/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        setSessions((prev) => prev.filter((s) => s.id !== id));
      } else {
        alert("Failed to delete the session.");
      }
    } catch (err) {
      alert("An error occurred while deleting the session.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Training Sessions</h1>
        <button
          onClick={() => window.location.href = "/admin/training-sessions/add"}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-5 rounded"
        >
          Create Training Session
        </button>
      </div>

      <div className="mb-6 relative">
        <input
          type="text"
          placeholder="Search sessions by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {loading && currentPage === 1 && (
        <p className="text-center text-gray-600">Loading sessions...</p>
      )}
      {error && (
        <p className="text-center text-red-600 font-semibold">{error}</p>
      )}

      {!loading && !error && filteredSessions.length === 0 && (
        <p className="text-center text-gray-600">No training sessions found.</p>
      )}

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredSessions.map((session) => (
          <div
            key={session.id}
            className="bg-white border border-gray-300 rounded-lg shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition-shadow duration-300 relative"
          >
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {session.title}
              </h2>
              <p className="text-gray-700 mb-3 line-clamp-3">
                {session.description || "No description provided."}
              </p>

              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <span className="font-semibold">Date:</span>{" "}
                  {new Date(session.session_date).toLocaleDateString("en-GB")}
                </p>
                <p>
                  <span className="font-semibold">Time:</span>{" "}
                  {session.start_time} - {session.end_time}
                </p>
                <p>
                  <span className="font-semibold">Duration:</span>{" "}
                  {session.duration_minutes} minutes
                </p>
                <p>
                  <span className="font-semibold">Participants:</span>{" "}
                  {session.current_participants}{" "}
                  {session.max_participants ? ` / ${session.max_participants}` : ""}
                </p>
                <p>
                  <span className="font-semibold">Category:</span>{" "}
                  {session.category?.name || "No category"}
                </p>
                <p>
                  <span className="font-semibold">Active:</span>{" "}
                  {session.is_active ? (
                    <span className="text-green-600 font-semibold">Yes</span>
                  ) : (
                    <span className="text-red-600 font-semibold">No</span>
                  )}
                </p>
              </div>
            </div>

            <div className="absolute bottom-4 right-4 flex space-x-3">
              <button
                onClick={() => handleUpdate(session)}
                title="Update Session"
                className="text-blue-600 hover:text-blue-800"
              >
                <Pencil size={20} />
              </button>
              <button
                onClick={() => handleDelete(session.id)}
                title="Delete Session"
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {!loading && !error && currentPage < lastPage && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMore}
            className="bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 px-6 rounded"
          >
            Load More
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {editingSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <button
              onClick={() => setEditingSession(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              aria-label="Close edit modal"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-semibold mb-4">Edit Training Session</h2>

            {editError && (
              <p className="mb-3 text-red-600 font-semibold">{editError}</p>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-semibold" htmlFor="title">
                  Title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={editForm.title}
                  onChange={handleEditChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold" htmlFor="max_participants">
                  Max Participants
                </label>
                <input
                  id="max_participants"
                  name="max_participants"
                  type="number"
                  min="1"
                  value={editForm.max_participants}
                  onChange={handleEditChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="is_active"
                  name="is_active"
                  type="checkbox"
                  checked={editForm.is_active}
                  onChange={handleEditChange}
                  className="w-4 h-4"
                />
                <label htmlFor="is_active" className="font-semibold">
                  Active
                </label>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingSession(null)}
                  className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                  disabled={editLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded"
                >
                  {editLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
