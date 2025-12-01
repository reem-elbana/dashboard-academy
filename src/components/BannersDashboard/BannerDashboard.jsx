import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";

// Lucide Icons
import { Pencil, Trash2, X } from "lucide-react";

export default function BannerManagement() {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [banners, setBanners] = useState([]);
  const [filteredBanners, setFilteredBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState(null); // حالة الحذف للبنر الحالي

  // تعديل - states للمودال والبيانات
  const [editingBanner, setEditingBanner] = useState(null);
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    is_active: true,
  });
  const [saving, setSaving] = useState(false);

  // Fetch banners
  useEffect(() => {
    if (!token) {
      setError("Authorization token is required");
      setLoading(false);
      return;
    }

    axios
      .get(
        "https://generous-optimism-production-4492.up.railway.app/api/admin/banners",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        if (res.data.success) {
          setBanners(res.data.banners);
          setFilteredBanners(res.data.banners);
        } else {
          setError("Failed to load banners");
        }
      })
      .catch(() => setError("Failed to load banners"))
      .finally(() => setLoading(false));
  }, [token]);

  // Search filter
  useEffect(() => {
    if (!searchTerm) {
      setFilteredBanners(banners);
    } else {
      const filtered = banners.filter((banner) =>
        banner.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBanners(filtered);
    }
  }, [searchTerm, banners]);

  // دالة حذف البنر
  const handleDelete = async (bannerId) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;

    setDeletingId(bannerId);
    setError(null);

    try {
      const res = await axios.delete(
        `https://generous-optimism-production-4492.up.railway.app/api/admin/banners/${bannerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        // Update the lists by removing the deleted banner
        const updatedBanners = banners.filter((b) => b.id !== bannerId);
        setBanners(updatedBanners);
        setFilteredBanners(updatedBanners);
        // If the deleted banner is currently opened in the modal, close the modal
        if (selectedBanner && selectedBanner.id === bannerId) {
          setSelectedBanner(null);
        }
      } else {
        setError("Failed to delete the banner");
      }
    } catch (err) {
      setError("An error occurred while deleting the banner");
    } finally {
      setDeletingId(null);
    }
  };

  // فتح مودال التعديل وتهيئة البيانات
  const openEditModal = (banner) => {
    setEditingBanner(banner);
    setEditData({
      title: banner.title,
      description: banner.description,
      is_active: banner.is_active,
    });
    setError(null);
  };

  // حفظ التعديل وإرسال البيانات للـ API
  const saveEdit = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await axios.put(
        `https://generous-optimism-production-4492.up.railway.app/api/admin/banners/${editingBanner.id}`,
        {
          title: editData.title,
          description: editData.description,
          is_active: editData.is_active,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        // تحديث البانرز بالقيمة الجديدة
        const updatedBanner = res.data.banner;
        const updatedBanners = banners.map((b) =>
          b.id === updatedBanner.id ? updatedBanner : b
        );
        setBanners(updatedBanners);
        setFilteredBanners(updatedBanners);
        setEditingBanner(null);
      } else {
        setError("Failed to update the banner");
      }
    } catch {
      setError("An error occurred while updating the banner");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-green-600 text-lg font-semibold animate-pulse">
          Loading banners...
        </p>
      </div>
    );

  if (error && !editingBanner)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-red-600 text-lg font-semibold bg-red-100 p-4 rounded-md shadow-md">
          {error}
        </p>
      </div>
    );

  return (
    <>
      <div className="max-w-7xl mx-auto p-6">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Banner Management</h1>
          <p className="text-gray-600 mt-1">
            View and manage all advertising banners
          </p>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-col sm:flex-row  items-center mb-10 gap-4 justify-end">
          <button
            onClick={() => navigate("/admin/banners/add")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md font-semibold transition"
          >
            + Add Banner
          </button>

          <input
            type="search"
            placeholder="Search banners..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-72 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* BANNER CARDS */}
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredBanners.length === 0 ? (
            <p className="text-center text-gray-600 col-span-full">
              No banners found.
            </p>
          ) : (
            filteredBanners.map((banner) => (
              <div
                key={banner.id}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition cursor-pointer"
                onClick={() => setSelectedBanner(banner)}
              >
                {/* IMAGE */}
                <img
                  src={banner.image_url}
                  alt={banner.title}
                  className="w-full h-44 object-cover"
                />

                <div className="p-3">
                  {/* STATUS */}
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      banner.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {banner.is_active ? "Active" : "Inactive"}
                  </span>

                  {/* TITLE */}
                  <h3 className="mt-2 text-lg font-bold text-gray-900 truncate">
                    {banner.title}
                  </h3>

                  {/* DESCRIPTION */}
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                    {banner.description}
                  </p>

                  {/* ORDER */}
                  <p className="text-gray-500 text-xs mt-2">
                    Order: {banner.order || 0}
                  </p>

                  {/* ACTION BUTTONS */}
                  <div className="flex gap-4 text-xl mt-3 justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(banner.id);
                      }}
                      className="text-red-500 hover:text-red-700 transition disabled:opacity-50"
                      title="Delete"
                      disabled={deletingId === banner.id}
                    >
                      {deletingId === banner.id ? "Deleting..." : <Trash2 size={20} />}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(banner);
                      }}
                      className="text-blue-500 hover:text-blue-700 transition"
                      title="Edit"
                    >
                      <Pencil size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MODAL: عرض تفاصيل البنر */}
      {selectedBanner && !editingBanner && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50"
          onClick={() => setSelectedBanner(null)}
        >
          <div
            className="relative bg-white rounded-xl max-w-2xl w-full overflow-hidden shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setSelectedBanner(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black transition"
            >
              <X size={28} />
            </button>

            <img
              src={selectedBanner.image_url}
              alt={selectedBanner.title}
              className="w-full h-64 object-cover"
            />

            <div className="p-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                {selectedBanner.title}
              </h2>

              <p className="text-gray-700 mb-4">{selectedBanner.description}</p>

              {selectedBanner.link_url ? (
                <a
                  href={selectedBanner.link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
                >
                  Visit Link →
                </a>
              ) : (
                <p className="text-gray-500 italic">No link available</p>
              )}

              {!selectedBanner.is_active && (
                <p className="mt-4 text-sm font-semibold text-red-600 bg-red-100 px-3 py-1 rounded-md inline-block">
                  Inactive
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: تعديل البنر */}
      {editingBanner && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50"
          onClick={() => setEditingBanner(null)}
        >
          <div
            className="relative bg-white rounded-xl max-w-lg w-full p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4">Edit Banner</h2>

            <label className="block mb-2">
              Title:
              <input
                type="text"
                value={editData.title}
                onChange={(e) =>
                  setEditData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full border rounded p-2 mt-1"
              />
            </label>

            <label className="block mb-2">
              Description:
              <textarea
                value={editData.description}
                onChange={(e) =>
                  setEditData((prev) => ({ ...prev, description: e.target.value }))
                }
                className="w-full border rounded p-2 mt-1"
                rows={3}
              />
            </label>

            <label className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={editData.is_active}
                onChange={(e) =>
                  setEditData((prev) => ({ ...prev, is_active: e.target.checked }))
                }
                className="mr-2"
              />
              Active
            </label>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setEditingBanner(null)}
                className="px-4 py-2 border rounded"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>

            {error && (
              <p className="text-red-600 mt-3 font-semibold">{error}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
