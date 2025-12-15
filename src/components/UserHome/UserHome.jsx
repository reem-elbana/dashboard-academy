
import React, { useEffect, useState } from "react";
import BannerSlider from "../BannerSlider/BannerSlider";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination  , Autoplay} from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";


export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { t } = useTranslation();

  const placeholder =
    'data:image/svg+xml,%3csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="gray" stroke-width="2"%3e%3crect x="3" y="3" width="18" height="18" rx="2" ry="2"/%3e%3ccircle cx="9" cy="9" r="2"/%3e%3cpath d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/%3e%3cline x1="21" y1="3" x2="3" y2="21"/%3e%3c/svg%3e';

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

  // تصفية الـ top categories حسب وجود عروض أو جلسات
  const topCategories = categories
    .filter((c) => c.has_active_offers || c.has_upcoming_sessions)
    .slice(0, 4);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">جاري التحميل...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <BannerSlider />

      <main className="max-w-8xl mx-auto px-6 py-16 space-y-16">
        {/* أقسام مميزة - Top Categories */}
        {topCategories.length > 0 && (
         <section>
  <h2 className="text-3xl font-bold text-forsan-green mb-8">
    {t("Top_categories")}
  </h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
    {topCategories.map((cat) => (
      <button
        key={cat.id}
        onClick={() => setSelectedCategory(cat)}
        className="group relative bg-white rounded-3xl border border-gray-100 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-forsan-green/40"
      >
        {/* الصورة */}
        <div className="aspect-[4/3] relative overflow-hidden bg-gray-50">
          <img
            src={cat.icon_url || placeholder}
            alt={cat.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
            onError={(e) => (e.target.src = placeholder)}
          />

          {cat.has_active_offers && (
            <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
              {t("active_offers", { count: cat.active_offers_count })}
            </div>
          )}

          {cat.has_upcoming_sessions && !cat.has_active_offers && (
            <div className="absolute top-4 left-4 bg-forsan-green text-white text-xs font-bold px-3 py-1 rounded-full">
              {t("upcoming_sessions")}
            </div>
          )}
        </div>

        {/* المحتوى */}
        <div className="p-6 text-center">
          <h3 className="text-xl font-bold text-gray-800 group-hover:text-forsan-green transition-colors">
            {cat.name}
          </h3>
        </div>
      </button>
    ))}
  </div>
</section>

        )}

        {/* كل الفئات */}
       <section className="category-section">
  <h2 className="text-3xl font-bold text-forsan-green mb-8">
    {t("All_categories")}
  </h2>

<Swiper
  modules={[Pagination, Autoplay]}
  pagination={{ clickable: true }}
  spaceBetween={24}
  slidesPerView={1}
  autoplay={{
    delay: 2000,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  }}
  breakpoints={{
    640: { slidesPerView: 2 },
    1024: { slidesPerView: 3 },
  }}
  className="pb-12"
>
    {categories.map((cat) => (
      <SwiperSlide key={cat.id} className="h-auto">
        {/* wrapper يوحّد المقاسات */}
        <div className="h-full">
          <button
            onClick={() => setSelectedCategory(cat)}
            className="group relative h-full w-full bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1 overflow-hidden cursor-pointer focus:outline-none"
          >
            {/* الصورة */}
            <div className="aspect-[4/3] relative overflow-hidden bg-gray-50">
              <img
                src={cat.icon_url || placeholder}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                onError={(e) => (e.target.src = placeholder)}
              />

              {cat.has_active_offers && (
                <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                  {t("active_offers", { count: cat.active_offers_count })}
                </div>
              )}

              {cat.has_upcoming_sessions && !cat.has_active_offers && (
                <div className="absolute top-3 left-3 bg-forsan-green text-white text-xs font-bold px-3 py-1 rounded-full">
                  {t("upcoming_sessions")}
                </div>
              )}
            </div>

            {/* المحتوى */}
            <div className="p-5 text-center">
              <h3 className="text-lg font-bold text-gray-800 group-hover:text-forsan-green transition-colors">
                {cat.name}
              </h3>
            </div>
          </button>
        </div>
      </SwiperSlide>
    ))}
  </Swiper>
</section>

      </main>

      {/* مودال التفاصيل */}
      {selectedCategory && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setSelectedCategory(null)} // إغلاق المودال عند الضغط على الخلفية
        >
          <div
            className="relative max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden animate-scaleIn"
            onClick={(e) => e.stopPropagation()} // منع إغلاق عند الضغط داخل المودال
          >
            <button
              onClick={() => setSelectedCategory(null)}
              className="absolute top-4 right-4 z-10 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 focus:outline-none focus:ring-4 focus:ring-indigo-300"
              aria-label="إغلاق التفاصيل"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="grid md:grid-cols-2">
              <div className="relative h-96 md:h-full">
                <img
                  src={selectedCategory.icon_url || placeholder}
                  alt={selectedCategory.name}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.target.src = placeholder)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              </div>

              <div className="p-8 md:p-12 flex flex-col justify-center">
                <h2 className="text-4xl md:text-5xl font-black text-gray-900">{selectedCategory.name}</h2>
                <p className="mt-6 text-lg text-gray-700 leading-relaxed">
                  {selectedCategory.description || t("no_description_available")}
                </p>
                {selectedCategory.has_active_offers && (
                  <p className="mt-4 text-red-600 font-semibold">
                    {`يوجد ${selectedCategory.active_offers_count} عروض نشطة`}
                  </p>
                )}
                {selectedCategory.has_upcoming_sessions && !selectedCategory.has_active_offers && (
                  <p className="mt-4 text-green-600 font-semibold">جلسات قادمة</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* أنيميشن المودال */}
      <style>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scaleIn {
          animation: scaleIn 0.4s ease-out;
        }

        .category-section .swiper-pagination {
  position: static !important;
  margin-top: 12px;
  text-align: center;
}

.swiper-pagination-bullet {
  background: #88a74d;
  opacity: 0.4;
}

.swiper-pagination-bullet-active {
  opacity: 1;
}

          
      `}</style>

      
    </div>
  );
}
