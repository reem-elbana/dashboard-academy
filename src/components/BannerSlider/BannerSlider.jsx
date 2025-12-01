import React, { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export default function BannerSlider() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "https://generous-optimism-production-4492.up.railway.app/api/content/banners"
        );
        setBanners(res.data.data?.banners || res.data.banners || []);
      } catch (err) {
        console.error("Banners error:", err);
        setError("فشل في تحميل البانرات");
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  if (loading)
    return (
      <div className="h-80 md:h-96 bg-gray-100 rounded-2xl flex items-center justify-center">
        <p className="text-gray-500 animate-pulse">جاري التحميل...</p>
      </div>
    );

  if (error)
    return (
      <div className="h-80 md:h-96 bg-red-50 rounded-2xl flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );

  if (!banners.length)
    return (
      <div className="h-80 md:h-96 bg-gray-50 rounded-2xl flex items-center justify-center">
        <p className="text-gray-500">لا توجد بانرات حاليًا</p>
      </div>
    );

  return (
    <div className="max-w-screen-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
  <Swiper
    modules={[Autoplay, Pagination, EffectFade]}
    spaceBetween={0}
    slidesPerView={1}
    loop={true}
    effect="fade"
    autoplay={{
      delay: 3000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    }}
    pagination={{
  clickable: true,
  bulletClass: "swiper-pagination-bullet !bg-white/100 !w-4 !h-4", // أكبر وأكثر وضوح
  bulletActiveClass: "!bg-white !scale-125",
}}

    speed={1000}
    className="rounded-2xl overflow-hidden shadow-lg"
  >
    {banners.map((banner, index) => (
      <SwiperSlide key={banner.id}>
        <a
          href={banner.link_url || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="block relative h-80 md:h-96 lg:h-[400px] overflow-hidden group cursor-pointer"
        >
          {/* الصورة */}
          <img
            src={banner.image_url}
            alt={banner.title || "Banner"}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            loading={index === 0 ? "eager" : "lazy"}
            onError={(e) =>
              (e.target.src = "https://via.placeholder.com/1200x400/111/fff?text=No+Image")
            }
          />

          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          {/* المحتوى */}
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 text-right">
              <div className="max-w-2xl">
                {banner.title && (
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight drop-shadow-md translate-y-4 opacity-0 animate-[slideUp_0.8s_ease-out_0.3s_forwards]">
                    {banner.title}
                  </h2>
                )}
                {banner.description && (
                  <p className="mt-2 text-xs sm:text-sm md:text-base text-gray-100 font-medium leading-relaxed opacity-0 animate-[fadeIn_1.2s_ease-out_0.6s_forwards]">
                    {banner.description}
                  </p>
                )}
                {banner.link_url && (
                  <div className="mt-4 opacity-0 animate-[fadeIn_1.4s_ease-out_0.9s_forwards]">
                    <span className="inline-flex items-center gap-2 text-white font-semibold text-sm sm:text-base hover:gap-4 transition-all duration-500">
                      Shop Now
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                    <div className="mt-1 h-0.5 w-0 group-hover:w-16 bg-white transition-all duration-700 rounded-full" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </a>
      </SwiperSlide>
    ))}

    <style jsx>{`
      @keyframes slideUp {
        to { transform: translateY(0); opacity: 1; }
      }
      @keyframes fadeIn {
        to { opacity: 1; }
      }
      .swiper-pagination {
        bottom: 1rem !important;
      }
    `}</style>
  </Swiper>
</div>
  );
}