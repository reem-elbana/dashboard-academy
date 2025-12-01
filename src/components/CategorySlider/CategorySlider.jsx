import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import CategoryDetails from './../CategoryDetails/CategoryDetails';

export default function CategorySlider() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState(null);
  const { t } = useTranslation();
  const navigate = useNavigate();

  // جلب الفئات
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          "https://generous-optimism-production-4492.up.railway.app/api/content/categories"
        );
        // تأكدنا من المكان الصح للبيانات
        setCategories(res.data.data || []); 
      } catch (err) {
        console.error("خطأ تحميل الفئات:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // إغلاق المودال بـ Escape
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && setSelectedCat(null);
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin inline-block"></div>
        <p className="mt-4 text-gray-600">{t("loading_categories") || "جاري تحميل الفئات..."}</p>
      </div>
    );
  }

  return (
    <>
      {/* Slider */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900">{t("choose_your_favorite_art")}</h2>
          <p className="mt-4 text-lg text-gray-600">{t("courses_and_workshops_in_all_art_fields")}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 lg:gap-8">
          {categories.map((cat, index) => (
            <button
  key={cat.id}
  onClick={() => navigate(`/category/${cat.id}`, { state: { category: cat } })}  className="group relative block bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 overflow-hidden cursor-pointer focus:outline-none focus:ring-4 focus:ring-indigo-300"
  style={{ animation: `fadeInUp 0.7s ease-out ${index * 0.1}s both` }}
  aria-label={`عرض تفاصيل ${cat.name}`}
>
              <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50">
                <img
                  src={cat.icon_url || "/placeholder.jpg"}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
              </div>

              <div className="p-5 text-center">
                <h3 className="text-lg font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                  {cat.name}
                </h3>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Modal */}
      {selectedCat && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setSelectedCat(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedCat(null)}
              className="absolute top-4 right-4 z-10 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 focus:outline-none focus:ring-4 focus:ring-indigo-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="grid md:grid-cols-2">
              <div className="relative h-96 md:h-full">
                <img src={selectedCat.icon_url} alt={selectedCat.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              </div>

              <div className="p-8 md:p-12 flex flex-col justify-center">
                <h2 className="text-4xl md:text-5xl font-black text-gray-900">{selectedCat.name}</h2>
                <p className="mt-6 text-lg text-gray-700 leading-relaxed">
                  {selectedCat.description || t("no_description_available")}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style jsx global>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        .animate-fadeInUp { animation: fadeInUp 0.7s ease-out both; }
        .animate-scaleIn { animation: scaleIn 0.4s ease-out; }
      `}</style>
    </>
  );
}