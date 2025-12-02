// import React, { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import { AuthContext } from "../../Context/AuthContext";
// import { useTranslation } from "react-i18next";
// import CategorySlider from "../CategorySlider/CategorySlider";
// import BannerSlider from "../BannerSlider/BannerSlider";

// export default function UserHome() {
//   const { token } = useContext(AuthContext);
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const { t } = useTranslation();

//   const formatTime = (dateString) => {
//     const date = new Date(dateString);
//     return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
//   };

//   useEffect(() => {
//     if (!token) return; // لو مش عامل login ما نعملش fetch

//     const fetchDashboard = async () => {
//       try {
//         setLoading(true);
//         const res = await axios.get(
//             "https://generous-optimism-production-4492.up.railway.app/api/subscriber/dashboard",
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         setData(res.data.data);
//       } catch (err) {
//         setError(err.response?.data?.message || err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboard();
//   }, [token]);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <main className="pt-10 pb-16 max-w-7xl mx-auto px-6">
//         {/* <div className="mb-8">
//           <h2 className="text-3xl font-bold text-gray-900">
//             {t("welcome_back")}
//           </h2>
//           {token ? (
//             <p className="text-gray-600 mt-1">{t("account_summary")}</p>
//           ) : (
//             <p className="text-gray-600 mt-1">
//               سجل الدخول لعرض تفاصيل حسابك.
//             </p>
//           )}
//         </div> */}
// <div className="space-y-12">
//        {/* Banner */}
//        <BannerSlider />
//  </div>
//         {/* لو في توكن نعرض البيانات */}
//         {token && (
//           <>
//             {loading && <p className="text-center mt-10">{t("loading")}...</p>}
//             {error && <p className="text-center mt-10 text-red-500">{error}</p>}

//             {data && (
//               <>

//                 {/* إحصائيات سريعة */}
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 mb-12">
//                   <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
//                     <p className="text-sm font-medium text-gray-600">{t("remaining_sessions")}</p>
//                     <p className="text-3xl font-bold text-gray-900 mt-2">{data.stats?.remaining_sessions || 0}</p>
//                   </div>
//                   <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
//                     <p className="text-sm font-medium text-gray-600">{t("total_attendances")}</p>
//                     <p className="text-3xl font-bold text-gray-900 mt-2">{data.recent_attendances?.length || 0}</p>
//                   </div>
//                   <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
//                     <p className="text-sm font-medium text-gray-600">{t("profile_completion")}</p>
//                     <p className="text-3xl font-bold text-gray-900 mt-2">{data.stats?.profile_completion || 0}%</p>
//                     <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
//                       <div
//                         className="bg-green-600 h-2 rounded-full transition-all duration-700"
//                         style={{ width: `${data.stats?.profile_completion || 0}%` }}
//                       />
//                     </div>
//                   </div>
//                   <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
//                     <p className="text-sm font-medium text-gray-600">{t("subscription_status")}</p>
//                     <p className="text-3xl font-bold text-green-600 mt-2">
//                       {data.stats?.has_valid_subscription ? t("active") : t("inactive")}
//                     </p>
//                     <p className="text-xs text-gray-500 mt-2">
//                       Expires: {data.stats?.subscription_expires_at ? new Date(data.stats.subscription_expires_at).toLocaleDateString("en-GB") : "--"}
//                     </p>
//                   </div>
//                 </div>

//                 {/* جلسات الأسبوع والحضور */}
//                 {/* نفس الكود اللي عندك داخل grid lg:grid-cols-2 */}
//               </>
//             )}
//           </>
//         )}

//         {/* Categories */}
//         <div className="space-y-12">
//           <CategorySlider />
//         </div>
//       </main>
//     </div>
//   );
// }



import React, { useEffect, useState } from "react";
import BannerSlider from "../BannerSlider/BannerSlider";
import axios from "axios";
import { useTranslation } from "react-i18next";

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
            <h2 className="text-3xl font-bold text-green-600 mb-6">{t("Top_categories")}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 lg:gap-8">
              {topCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat)} // افتح مودال التفاصيل
                  className="group relative block bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1 overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-300"
                >
                  <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50">
                    <img
                      src={cat.icon_url || placeholder}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => (e.target.src = placeholder)}
                    />
                    {cat.has_active_offers && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                        {t("active_offers", { count: cat.active_offers_count })}
                      </div>
                    )}
                    {cat.has_upcoming_sessions && !cat.has_active_offers && (
                      <div className="absolute top-2 left-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {t("upcoming_sessions")}
                      </div>
                    )}
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                      {cat.name}
                    </h3>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* كل الفئات */}
        <section>
          <h2 className="text-3xl font-bold text-green-600 mb-6">{t("All_categories")}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 lg:gap-8">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat)}
                className="group relative block bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden cursor-pointer focus:outline-none focus:ring-4 focus:ring-indigo-300"
              >
                <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50">
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
              </button>
            ))}
          </div>
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
      `}</style>
    </div>
  );
}
