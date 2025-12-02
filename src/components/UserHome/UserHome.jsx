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
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const navigate = useNavigate();

  // جلب الفئات
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

  // دالة آمنة لتحويل الصور إلى دقة عالية
  const placeholder = 'data:image/svg+xml,%3csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="gray" stroke-width="2"%3e%3crect x="3" y="3" width="18" height="18" rx="2" ry="2"/%3e%3ccircle cx="9" cy="9" r="2"/%3e%3cpath d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/%3e%3cline x1="21" y1="3" x2="3" y2="21"/%3e%3c/svg%3e';
  const getHighResImage = (url) => {
    if (!url) return placeholder;
    // بما أن الصور من Laravel storage، نرجع الـ URL كما هو
    return url;
  };

  // استخراج أفضل الفئات حسب العروض أو الجلسات
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
    <div className="min-h-screen ">
      {/* بانرات */}
      <BannerSlider />

      <main className="max-w-8xl mx-auto px-6 py-16 space-y-16">
        {/* أقسام مميزة - Top Categories */}
        {topCategories.length > 0 && (
          <section>
            <h2 className="text-3xl md:text-3xl font-bold text-green-600 mb-6">
              {t("Top_categories")}
            </h2>
            {/* <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 lg:gap-6"> */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 lg:gap-8">

  {topCategories.map((cat) => (
    <button
      key={cat.id}
      onClick={() => navigate(`/category/${cat.id}`)}
      className="group relative block bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1 overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-300"
    >
      <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50">
        <img
          src={getHighResImage(cat.icon_url)} // قللت دقة الصورة
          alt={cat.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" // قللت السكيل عند hover
          loading="lazy"
          onError={(e) => e.target.src = placeholder}
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
      <div className="p-6 text-center"> {/* قللت الـ padding */}
         <h3 className="text-lg font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
          {cat.name}
        </h3>
      </div>
    </button>
  ))}
</div>

              {/* <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 lg:gap-8">
                {topCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => navigate(`/category/${cat.id}`)}
                    className="group relative block bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden cursor-pointer focus:outline-none focus:ring-4 focus:ring-indigo-300"
                  >
                    <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50">
                      <img
                        src={getHighResImage(cat.icon_url, 800, 800)}
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
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
              </div> */}
          </section>
        )}

        {/* كل الفئات */}
        <section>
          <h2 className="text-3xl md:text-3xl font-bold text-green-600 mb-6">
            {t("All_categories")}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 lg:gap-8">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => navigate(`/category/${cat.id}`)}
                className="group relative block bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden cursor-pointer focus:outline-none focus:ring-4 focus:ring-indigo-300"
              >
                <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50">
                  <img
                    src={getHighResImage(cat.icon_url)}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => e.target.src = placeholder}
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
    </div>
  );
}
