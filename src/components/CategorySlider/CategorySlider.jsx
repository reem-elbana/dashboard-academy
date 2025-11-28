// src/components/UserHome/CategoriesGrid.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

export default function CategorySlider() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState(null); // الفئة المختارة
  const { t } = useTranslation();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          "https://generous-optimism-production-4492.up.railway.app/api/content/categories"
        );
        setCategories(res.data.categories || []);
      } catch (err) {
        console.error("خطأ تحميل الفئات:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // إغلاق المودال بالـ Escape أو الضغط خارج النافذة
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && setSelectedCat(null);
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin inline-block"></div>
        <p className="mt-4 text-gray-600">جاري تحميل الفئات...</p>
      </div>
    );
  }

  return (
    <>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-4xl font-black text-gray-900">{t("choose_your_favorite_art")}</h2>
          <p className="mt-4 text-lg text-gray-600">{t("courses_and_workshops_in_all_art_fields")}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 lg:gap-8">
          {categories.map((cat, index) => (
            <div
              key={cat.id}
              onClick={() => setSelectedCat(cat)}
              className="group relative block bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 overflow-hidden cursor-pointer"
              style={{ animation: `fadeInUp 0.7s ease-out ${index * 0.1}s both` }}
            >
              <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50">
                <img
                  src={(cat.icon_url || "").replace(/w=64&h=64/, "w=800&h=800")}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                {cat.has_active_offers && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                    {t("active_offers", { count: cat.active_offers_count })}
                  </div>
                )}
                {cat.has_upcoming_sessions && !cat.has_active_offers && (
                  <div className="absolute top-3 left-3 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {t("upcoming_sessions")}
                  </div>
                )}
              </div>

              <div className="p-5 text-center">
                <h3 className="text-lg font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                  {cat.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Fancy Modal */}
      {selectedCat && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setSelectedCat(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden animate-[scaleIn_0.4s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedCat(null)}
              className="absolute top-4 right-4 z-10 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="grid md:grid-cols-2">
              {/* Large Image */}
              <div className="relative h-96 md:h-full">
                <img
                  src={(selectedCat.icon_url || "").replace(/w=64&h=64/, "w=1200&h=800")}
                  alt={selectedCat.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <h2 className="text-4xl md:text-5xl font-black text-gray-900">{selectedCat.name}</h2>
                <p className="mt-6 text-lg text-gray-700 leading-relaxed">{selectedCat.description}</p>

                <div className="mt-8 space-y-4">
                  {selectedCat.has_active_offers && (
                    <div className="flex items-center gap-3 text-red-600">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.163c.969 0 1.371 1.24.588 1.81l-3.376 2.456a1 1 0 00-.364 1.118l1.287 3.967c.3.921-.755 1.688-1.54 1.118l-3.376-2.456a1 1 0 00-1.176 0l-3.376 2.456c-.784.57-1.838-.197-1.54-1.118l1.287-3.967a1 1 0 00-.364-1.118L2.316 9.384c-.783-.57-.38-1.81.588-1.81h4.163a1 1 0 00.95-.69l1.286-3.967z" />
                        </svg>
                      </div>
                      <span className="font-bold">
                        {t("active_offers_now", { count: selectedCat.active_offers_count })}
                      </span>
                    </div>
                  )}

                  {selectedCat.has_upcoming_sessions && (
                    <div className="flex items-center gap-3 text-emerald-600">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="font-bold">{t("upcoming_sessions_soon")}</span>
                    </div>
                  )}
                </div>

                <div className="mt-10 flex gap-4">
                  <button className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-full hover:bg-indigo-700 transition shadow-lg">
                    {t("view_available_courses")}
                  </button>
                  <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-bold rounded-full hover:border-indigo-600 hover:text-indigo-600 transition">
                    {t("learn_more")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
}
