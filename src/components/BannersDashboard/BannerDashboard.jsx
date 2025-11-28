import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";

export default function BannerManagement() {
  const { token } = useContext(AuthContext);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBanner, setSelectedBanner] = useState(null); // للتحكم بالبنر المفتوح في المودال

  useEffect(() => {
    if (!token) {
      setError("Authorization token is required");
      setLoading(false);
      return;
    }

    axios
      .get("https://generous-optimism-production-4492.up.railway.app/api/admin/banners", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.success) {
          setBanners(res.data.banners);
          setError(null);
        } else {
          setError("Failed to load banners");
        }
      })
      .catch(() => setError("Failed to load banners"))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-green-50">
        <p className="text-green-700 text-lg font-semibold animate-pulse">Loading banners...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen bg-green-50 px-4">
        <p className="text-red-600 text-lg font-semibold bg-red-100 p-4 rounded-md shadow-md max-w-md text-center">
          {error}
        </p>
      </div>
    );

  return (
    <>
      <div className="max-w-7xl mx-auto p-6 bg-green-50 min-h-screen">
        <header className="mb-8 text-center">
          <h1 className="text-5xl font-extrabold text-green-800 mb-2 tracking-tight">
            Banner Management
          </h1>
          <p className="text-green-600 text-lg md:text-xl">
            View and manage all advertising banners
          </p>
        </header>

        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {banners.map((banner) => (
            <div
              key={banner.id}
              onClick={() => setSelectedBanner(banner)}
              className={`flex flex-col bg-white rounded-2xl shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-[1.03] cursor-pointer
                ${banner.is_active ? "border-4 border-green-400" : "border-2 border-gray-300 opacity-70"}
              `}
              tabIndex={0} // للتركيز من الكيبورد
              aria-label={`Banner titled ${banner.title} ${banner.is_active ? "active" : "inactive"}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setSelectedBanner(banner);
                }
              }}
            >
              <img
                src={banner.image_url}
                alt={banner.title}
                className="w-full h-52 md:h-48 object-cover rounded-t-2xl"
                loading="lazy"
              />
              <div className="p-5 flex flex-col flex-grow bg-green-50">
                <h2
                  className="text-2xl font-semibold text-green-900 mb-2 truncate"
                  title={banner.title}
                >
                  {banner.title}
                </h2>
                <p className="text-green-700 flex-grow mb-4 leading-relaxed truncate" title={banner.description}>
                  {banner.description}
                </p>
                {banner.link_url ? (
                  <a
                    href={banner.link_url}
                    onClick={e => e.stopPropagation()} // لمنع إغلاق المودال لما ندوس على اللينك
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-green-700 font-semibold hover:text-green-900 focus:text-green-900 focus:outline-none underline transition-colors"
                  >
                    Learn More &rarr;
                  </a>
                ) : (
                  <span className="text-gray-400 italic">No link available</span>
                )}

                {!banner.is_active && (
                  <p className="mt-3 text-sm font-semibold text-red-600 bg-red-100 rounded-md px-2 py-1 self-start">
                    Inactive
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedBanner && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
          onClick={() => setSelectedBanner(null)}
          aria-modal="true"
          role="dialog"
          tabIndex={-1}
        >
          <div
            className="bg-white rounded-xl max-w-3xl w-full max-h-full overflow-y-auto shadow-xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedBanner(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 focus:outline-none text-3xl font-bold"
              aria-label="Close modal"
            >
              &times;
            </button>

            <img
              src={selectedBanner.image_url}
              alt={selectedBanner.title}
              className="w-full h-64 object-cover rounded-t-xl"
            />
            <div className="p-6">
              <h2 className="text-3xl font-extrabold text-green-900 mb-4">{selectedBanner.title}</h2>
              <p className="text-green-800 mb-6 whitespace-pre-line">{selectedBanner.description}</p>
              {selectedBanner.link_url ? (
                <a
                  href={selectedBanner.link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-green-600 hover:bg-green-700 focus:bg-green-700 text-white font-semibold px-5 py-3 rounded-lg transition"
                >
                  Learn More &rarr;
                </a>
              ) : (
                <span className="text-gray-500 italic">No link available</span>
              )}

              {!selectedBanner.is_active && (
                <p className="mt-4 text-sm font-semibold text-red-600 bg-red-100 rounded-md px-3 py-2 inline-block">
                  Inactive
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
