import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";
import { Pencil, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function OffersList() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // New state for editing
  const [editingOffer, setEditingOffer] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);

  const fetchOffers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        "https://generous-optimism-production-4492.up.railway.app/api/admin/offers?per_page=15&status=active",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOffers(res.data.data.offers.data || []);
    } catch {
      setError("Error loading offers");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleDelete = async (offerId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this offer?"
    );
    if (!confirmDelete) return;

    try {
      setDeletingId(offerId);
      await axios.delete(
        `https://generous-optimism-production-4492.up.railway.app/api/admin/offers/${offerId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOffers((prev) => prev.filter((offer) => offer.id !== offerId));
      if (selectedOffer?.id === offerId) setSelectedOffer(null);
      alert("The offer has been deleted successfully.");
    } catch (err) {
      alert("An error occurred while deleting. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = offers.filter((o) =>
    o.title.toLowerCase().includes(search.toLowerCase())
  );

  // Handle input changes in edit form
  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingOffer((prev) => ({
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
      // Prepare body - only allowed fields from your edit form
      const body = {
        title: editingOffer.title,
        discount_percentage: Number(editingOffer.discount_percentage),
        end_date: editingOffer.end_date,
        is_active: editingOffer.is_active,
      };

      await axios.put(
        `https://generous-optimism-production-4492.up.railway.app/api/admin/offers/${editingOffer.id}`,
        body,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update the offers state locally
      setOffers((prev) =>
        prev.map((offer) =>
          offer.id === editingOffer.id
            ? {
                ...offer,
                title: body.title,
                pricing: {
                  ...offer.pricing,
                  discount_percentage: body.discount_percentage.toFixed(2),
                },
                validity: {
                  ...offer.validity,
                  expires_at: body.end_date,
                },
                status: {
                  ...offer.status,
                  is_active: body.is_active,
                  current_status: body.is_active ? "active" : "inactive",
                  status_label: body.is_active ? "نشط" : "غير نشط",
                },
              }
            : offer
        )
      );

      alert("Offer updated successfully.");
      setEditingOffer(null);
    } catch (err) {
      setEditError("Failed to update offer. Please try again.");
    } finally {
      setEditLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-6">Loading...</p>;
  if (error) return <p className="text-center mt-6 text-red-500">{error}</p>;

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Offers</h1>

        <div className="flex gap-3 w-full sm:w-auto">
          <button
            className="px-5 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
            onClick={() => navigate("/admin/offers/add")}
          >
            Add Offer
          </button>
          <input
            type="text"
            placeholder="Search offers..."
            className="w-full sm:w-64 px-4 py-2 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((offer) => (
          <div
            key={offer.id}
            onClick={() => setSelectedOffer(offer)}
            className="bg-white shadow-md rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition cursor-pointer group relative flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition">
                {offer.title}
              </h2>

              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {offer.description}
              </p>

              <div className="flex justify-between items-center text-sm text-gray-700 font-medium">
                <div>
                  <p>
                    <span className="font-semibold">Start Date:</span>{" "}
                    {new Date(offer.validity.starts_at).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-semibold">Expires At:</span>{" "}
                    {new Date(offer.validity.expires_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="text-right">
                  <p>
                    <span className="font-semibold">Discount %:</span>{" "}
                    {offer.pricing.discount_percentage || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Category:</span>{" "}
                    {offer.category?.name || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom area for Active badge and icons */}
            <div className="flex justify-between items-center mt-6">
              {/* Active Badge */}
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  offer.status.is_active
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {offer.status.is_active
                  ? offer.status.status_label
                  : "Inactive"}
              </span>

              {/* Icons */}
              <div className="flex gap-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Open edit popup and prefill
                    setEditingOffer({
                      id: offer.id,
                      title: offer.title,
                      discount_percentage: offer.pricing.discount_percentage,
                      end_date: offer.validity.expires_at
                        ? offer.validity.expires_at.split(" ")[0]
                        : "",
                      is_active: offer.status.is_active,
                    });
                  }}
                  className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
                >
                  <Pencil size={20} />
                </button>
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (deletingId === offer.id) return;
                    await handleDelete(offer.id);
                  }}
                  disabled={deletingId === offer.id}
                  className={`p-2 rounded-full transition ${
                    deletingId === offer.id
                      ? "bg-red-300 text-white cursor-not-allowed"
                      : "bg-red-100 text-red-600 hover:bg-red-200"
                  }`}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected offer popup */}
      {selectedOffer && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center p-6 z-50"
          onClick={() => setSelectedOffer(null)}
        >
          <div
            className="bg-white max-w-lg w-full rounded-3xl p-8 shadow-2xl relative animate-[fadeIn_0.25s_ease]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-5 right-5 text-gray-600 hover:text-gray-900"
              onClick={() => setSelectedOffer(null)}
            >
              <X size={26} />
            </button>

            <h2 className="text-3xl font-bold mb-4 text-blue-700">
              {selectedOffer.title}
            </h2>

            <p className="text-gray-700 mb-6">{selectedOffer.description}</p>

            <div className="space-y-3 text-gray-800 text-lg">
              <p>
                <span className="font-semibold">Start Date:</span>{" "}
                {new Date(selectedOffer.validity.starts_at).toLocaleDateString()}
              </p>
              <p>
                <span className="font-semibold">Expires At:</span>{" "}
                {new Date(selectedOffer.validity.expires_at).toLocaleDateString()}
              </p>
              <p>
                <span className="font-semibold">Discount %:</span>{" "}
                {selectedOffer.pricing.discount_percentage || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Category:</span>{" "}
                {selectedOffer.category?.name || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Created At:</span>{" "}
                {new Date(selectedOffer.timestamps.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Edit offer popup */}
      {editingOffer && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center p-6 z-50"
          onClick={() => setEditingOffer(null)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleEditSubmit}
            className="bg-white max-w-md w-full rounded-3xl p-8 shadow-2xl animate-[fadeIn_0.25s_ease]"
          >
            <button
              type="button"
              className="absolute top-5 right-5 text-gray-600 hover:text-gray-900"
              onClick={() => setEditingOffer(null)}
            >
              <X size={26} />
            </button>

            <h2 className="text-2xl font-bold mb-6 text-blue-700">Edit Offer</h2>

            {editError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                {editError}
              </div>
            )}

            <label className="block mb-2 font-semibold">
              Title
              <input
                type="text"
                name="title"
                value={editingOffer.title}
                onChange={handleEditChange}
                required
                className="mt-1 w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>

            <label className="block mb-2 font-semibold">
              Discount Percentage (%)
              <input
                type="number"
                name="discount_percentage"
                min="0"
                max="100"
                value={editingOffer.discount_percentage}
                onChange={handleEditChange}
                required
                className="mt-1 w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>

            <label className="block mb-2 font-semibold">
              End Date
              <input
                type="date"
                name="end_date"
                value={editingOffer.end_date}
                onChange={handleEditChange}
                required
                className="mt-1 w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center gap-2 mb-6 font-semibold">
              <input
                type="checkbox"
                name="is_active"
                checked={editingOffer.is_active}
                onChange={handleEditChange}
                className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              Activate Offer
            </label>

            <button
              type="submit"
              disabled={editLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors duration-300"
            >
              {editLoading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
