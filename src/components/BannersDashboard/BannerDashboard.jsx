import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";

// Lucide Icons
import { Pencil, Trash2, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { hasPermission } from "../../Context/permissions";


export default function BannerManagement() {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const { t } = useTranslation();

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

  const { permissions } = useContext(AuthContext);


    if (!hasPermission(permissions, "banners.view")) {
    return (
      <div className="text-center text-red-500 text-xl mt-10">
        {t("you do not have permission to view this page")}
      </div>
    );
  }


  // Fetch banners
  useEffect(() => {
    if (!token) {
      setError(t("auth_token_required"));
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
          setError(t("failed_load_banners"));
        }
      })
      .catch(() => setError(t("failed_load_banners")))
      .finally(() => setLoading(false));
  }, [token, t]);

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
    if (!window.confirm(t("confirm_delete_banner"))) return;

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
        setError(t("failed_delete_banner"));
      }
    } catch (err) {
      setError(t("error_delete_banner"));
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
        setError(t("failed_update_banner"));
      }
    } catch {
      setError(t("error_update_banner"));
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-green-600 text-lg font-semibold animate-pulse">
          {t("loading_banners")}
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
          <h1 className="text-4xl font-bold text-gray-900">{t("banner_management")}</h1>
          <p className="text-gray-600 mt-1">{t("view_manage_banners")}</p>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-col sm:flex-row  items-center mb-10 gap-4 justify-end">
          {hasPermission(permissions, "banners.create") && (
          <button
            onClick={() => navigate("/admin/banners/add")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md font-semibold transition"
          >
            + {t("add_banner")}
          </button>
          )}

          <input
            type="search"
            placeholder={t("search_banners")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-72 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* BANNER CARDS */}
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredBanners.length === 0 ? (
            <p className="text-center text-gray-600 col-span-full">
              {t("no_banners_found")}
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
                    {banner.is_active ? t("active") : t("inactive")}
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
                    {t("order")}: {banner.order || 0}
                  </p>

                  {/* ACTION BUTTONS */}
                  <div className="flex gap-4 text-xl mt-3 justify-end">
                     {hasPermission(permissions, "banners.delete") && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(banner.id);
                      }}
                      className="text-red-500 hover:text-red-700 transition disabled:opacity-50"
                      title={t("delete")}
                      disabled={deletingId === banner.id}
                    >
                      {deletingId === banner.id ? t("deleting") : <Trash2 size={20} />}
                    </button>
                     )}
                    {hasPermission(permissions, "banners.edit") && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(banner);
                      }}
                      className="text-blue-500 hover:text-blue-700 transition"
                      title={t("edit")}
                    >
                      <Pencil size={20} />
                    </button>
                    )}
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
              aria-label={t("close")}
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
                  {t("visit_link")} →
                </a>
              ) : (
                <p className="text-gray-500 italic">{t("no_link_available")}</p>
              )}

              {!selectedBanner.is_active && (
                <p className="mt-4 text-sm font-semibold text-red-600 bg-red-100 px-3 py-1 rounded-md inline-block">
                  {t("inactive")}
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
            <h2 className="text-2xl font-bold mb-4">{t("edit_banner")}</h2>

            <label className="block mb-2">
              {t("title")}:
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
              {t("description")}:
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
              {t("active")}
            </label>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setEditingBanner(null)}
                className="px-4 py-2 border rounded"
                disabled={saving}
              >
                {t("cancel")}
              </button>
              <button
                onClick={saveEdit}
                className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                disabled={saving}
              >
                {saving ? t("saving") : t("save")}
              </button>
            </div>

            {error && <p className="text-red-600 mt-3 font-semibold">{error}</p>}
          </div>
        </div>
      )}
    </>
  );
}
