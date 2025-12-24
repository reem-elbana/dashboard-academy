import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { Pencil, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { hasPermission } from "../../Context/permissions"

export default function CategoriesManager() {
  const { token } = useContext(AuthContext);
  const { permissions } = useContext(AuthContext);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [editCategory, setEditCategory] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

     if (!hasPermission(permissions, "categories.view")) {
      return (
        <div className="text-center text-red-500 text-xl mt-10">
          {t("you do not have permission to view this page")}
        </div>
      );
    }



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
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (data.success) setCategories(data.categories);
      else setError(t("failed_to_fetch_categories"));
    } catch {
      setError(t("something_went_wrong_while_fetching_data"));
    } finally {
      setLoading(false);
    }
  }

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  async function handleDelete(id) {
    if (!window.confirm(t("confirm_delete_category"))) return;

    const res = await fetch(
      `https://generous-optimism-production-4492.up.railway.app/api/admin/categories/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await res.json();
    if (res.ok && data.success) fetchCategories();
  }

  function openEditModal(category) {
    setEditCategory({ ...category });
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
          body: JSON.stringify(editCategory),
        }
      );

      const data = await res.json();
      if (res.ok && data.success) {
        setEditModalOpen(false);
        fetchCategories();
      } else setSaveError(t("failed_to_update_category"));
    } finally {
      setSaving(false);
    }
  }

  if (loading)
    return <p className="text-center p-10">{t("loading")}</p>;

  return (
    <div className="p-6 md:p-10 bg-white rounded-2xl shadow-lg max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between mb-8">
        <div>
        <h1 className="text-3xl font-bold text-forsan-green">{t("categories_management")}</h1>
        <p className="text-gray-600 mt-1">{t("View and manage Categories")}</p>
        </div>
        {hasPermission(permissions, "categories.create") && (
        <button
          onClick={() => navigate("/admin/categories/add")}
          className="bg-forsan-dark hover:bg-blue-900 text-white px-6 py-3 rounded-xl"
        >
          + {t("add_category")}
        </button>
        )}
      </div>

      <input
        type="text"
        placeholder={t("search_categories_placeholder")}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-8 w-full md:w-96 border p-3 rounded-xl"
      />

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCategories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => {
              setSelectedCategory(cat);
              setDetailsModalOpen(true);
            }}
            className="cursor-pointer bg-white rounded-2xl border shadow-sm hover:shadow-xl transition overflow-hidden"
          >
            {/* IMAGE */}
         <div className="h-36 bg-gray-50 flex items-center justify-center">
  {cat.icon_url ? (
    <img
      src={cat.icon_url}
      alt={cat.name}
      className="h-full w-full object-cover p-4"
    />
  ) : (
    <div className="flex flex-col items-center text-gray-400 text-sm">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8 mb-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 5h18M3 5v14h18V5M3 15l4-4a2 2 0 012.828 0L13 14l2-2a2 2 0 012.828 0L21 15"
        />
      </svg>
      {t("no_image")}
    </div>
  )}
</div>


            <div className="p-4">
              <span
                className={`text-xs px-3 py-1 rounded-full ${
                  cat.is_active
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {cat.is_active ? t("active") : t("inactive")}
              </span>

              <h2 className="mt-3 text-lg font-bold text-forsan-dark">{cat.name}</h2>

              <div className="flex justify-between text-sm text-gray-600 mt-3">
                <span>{t("offers")}: {cat.offers?.length || 0}</span>
                <span>{t("sessions")}: {cat.training_sessions?.length || 0}</span>
              </div>

              <div
                className="flex justify-end gap-4 mt-4"
                onClick={(e) => e.stopPropagation()}
              >
                {hasPermission(permissions, "categories.delete") && (
                <Trash2
                  className="text-red-600 cursor-pointer"
                  onClick={() => handleDelete(cat.id)}
                />
                )}
                 {hasPermission(permissions, "categories.edit") && (
                <Pencil
                  className="text-blue-600 cursor-pointer"
                  onClick={() => openEditModal(cat)}
                />
                 )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DETAILS MODAL */}
      {detailsModalOpen && selectedCategory && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          onClick={() => setDetailsModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between mb-4">
              <h2 className="text-2xl font-bold">
                {selectedCategory.name}
              </h2>
              <X onClick={() => setDetailsModalOpen(false)} />
            </div>

            <img
              src={selectedCategory.icon_url || "/default-category.png"}
              className="w-full h-48 object-contain mb-4"
            />

            <p className="text-gray-600 mb-4">
              {selectedCategory.description}
            </p>

            <div className="flex justify-between text-sm font-medium">
              <span>{t("offers")}: {selectedCategory.offers?.length || 0}</span>
              <span>{t("sessions")}: {selectedCategory.training_sessions?.length || 0}</span>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">{t("edit_category")}</h2>

            <input
              name="name"
              value={editCategory.name}
              onChange={handleInputChange}
              className="w-full border p-3 rounded mb-3"
            />

            <textarea
              name="description"
              value={editCategory.description}
              onChange={handleInputChange}
              className="w-full border p-3 rounded mb-3"
            />

            <button
              onClick={handleSave}
              className="bg-forsan-dark hover:bg-blue-900 text-white w-full py-3 rounded-xl"
            >
              {saving ? t("saving") : t("save_changes")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}