import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { Pencil, Trash2, X } from "lucide-react";

export default function CategoriesManager() {
  const { token } = useContext(AuthContext);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, [token]);

  async function fetchCategories() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        "https://generous-optimism-production-4492.up.railway.app/api/admin/categories",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        setCategories(data.categories);
      } else {
        setError("Failed to fetch categories.");
      }
    } catch (err) {
      setError("Something went wrong while fetching data.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      const res = await fetch(
        `https://generous-optimism-production-4492.up.railway.app/api/admin/categories/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok && data.success) {
        alert("Category deleted successfully.");
        fetchCategories();
      } else {
        alert("Failed to delete category: " + (data.message || JSON.stringify(data)));
      }
    } catch (error) {
      alert("An error occurred while deleting.");
    }
  }

  function openEditModal(category) {
    setEditCategory({
      id: category.id,
      name: category.name,
      description: category.description,
      is_active: category.is_active,
    });
    setSaveError("");
    setEditModalOpen(true);
  }

  function handleInputChange(e) {
    const { name, value, type, checked } = e.target;
    setEditCategory((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSave() {
    setSaving(true);
    setSaveError("");
    try {
      const res = await fetch(
        `https://generous-optimism-production-4492.up.railway.app/api/admin/categories/${editCategory.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: editCategory.name,
            description: editCategory.description,
            is_active: editCategory.is_active,
          }),
        }
      );

      const data = await res.json();

      if (res.ok && data.success) {
        alert("Category updated successfully.");
        setEditModalOpen(false);
        fetchCategories();
      } else {
        setSaveError(data.message || "Failed to update category.");
      }
    } catch {
      setSaveError("An error occurred while updating.");
    } finally {
      setSaving(false);
    }
  }

  if (loading)
    return (
      <p className="text-center p-8 text-lg text-gray-600 font-medium">
        Loading...
      </p>
    );
  if (error)
    return (
      <p className="text-center p-8 text-lg text-red-600 font-semibold">{error}</p>
    );

  return (
    <div className="p-6 md:p-10 bg-white rounded-xl shadow-lg max-w-7xl mx-auto relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Categories Management
        </h1>
      </div>

      {/* MOBILE & TABLET: Cards view */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:hidden gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-gray-50 rounded-lg shadow p-4 flex flex-col gap-3"
          >
            <div className="flex items-center gap-4">
              <img
                src={cat.icon_url || "/default-category.png"}
                alt={cat.name}
                className="w-14 h-14 rounded-full object-cover border border-gray-300"
              />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{cat.name}</h2>
                <p className="text-gray-700 text-sm line-clamp-3">{cat.description}</p>
              </div>
            </div>

            <div className="flex justify-between text-sm text-gray-700 font-semibold">
              <div>Offers: {cat.offers?.length || 0}</div>
              <div>Sessions: {cat.training_sessions?.length || 0}</div>
              <div>
                {cat.is_active ? (
                  <span className="text-green-600">Active</span>
                ) : (
                  <span className="text-red-600">Inactive</span>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-2 border-t border-gray-300">
              <button
                onClick={() => handleDelete(cat.id)}
                className="text-red-600 hover:text-red-800 transition"
                aria-label={`Delete category ${cat.name}`}
                title="Delete"
              >
                <Trash2 size={20} />
              </button>

              <button
                onClick={() => openEditModal(cat)}
                className="text-blue-600 hover:text-blue-800 transition"
                aria-label={`Edit category ${cat.name}`}
                title="Edit"
              >
                <Pencil size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP: Table view */}
      <div className="hidden lg:block overflow-x-auto rounded-lg border border-gray-200 mt-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                Category
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                Description
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                Offers
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                Sessions
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((cat) => (
              <tr
                key={cat.id}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap flex items-center gap-4">
                  <img
                    src={cat.icon_url || "/default-category.png"}
                    alt={cat.name}
                    className="w-12 h-12 rounded-full object-cover border border-gray-300"
                  />
                  <span className="text-gray-900 font-medium">{cat.name}</span>
                </td>
                <td className="px-6 py-4 max-w-xs text-gray-700 text-sm truncate">
                  {cat.description}
                </td>
                <td className="px-6 py-4 text-center text-gray-700 font-semibold">
                  {cat.offers?.length || 0}
                </td>
                <td className="px-6 py-4 text-center text-gray-700 font-semibold">
                  {cat.training_sessions?.length || 0}
                </td>
                <td className="px-6 py-4 text-center">
                  {cat.is_active ? (
                    <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                      Active
                    </span>
                  ) : (
                    <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
                      Inactive
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-center flex justify-center gap-4">
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="text-red-600 hover:text-red-800 transition"
                    title="Delete category"
                    aria-label={`Delete category ${cat.name}`}
                  >
                    <Trash2 size={22} />
                  </button>

                  <button
                    onClick={() => openEditModal(cat)}
                    className="text-blue-600 hover:text-blue-800 transition"
                    title="Edit category"
                    aria-label={`Edit category ${cat.name}`}
                  >
                    <Pencil size={22} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 px-4"
          onClick={() => setEditModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg p-8 max-w-lg w-full shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 transition"
              onClick={() => setEditModalOpen(false)}
              title="Close modal"
            >
              <X size={28} />
            </button>

            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              Edit Category
            </h2>

            {saveError && (
              <p className="mb-4 text-red-600 font-semibold">{saveError}</p>
            )}

            <label
              htmlFor="name"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Category Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={editCategory.name}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md p-3 mb-5 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
            />

            <label
              htmlFor="description"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={editCategory.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full border border-gray-300 rounded-md p-3 mb-5 resize-none focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
            />

            <label className="inline-flex items-center mb-6 cursor-pointer select-none">
              <input
                type="checkbox"
                name="is_active"
                checked={editCategory.is_active}
                onChange={handleInputChange}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="ml-3 text-gray-800 font-medium">Active</span>
            </label>

            <button
              onClick={handleSave}
              disabled={saving}
              className={`w-full py-3 text-white font-semibold rounded-md transition ${
                saving
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
