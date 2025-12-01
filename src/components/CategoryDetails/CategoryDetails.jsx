import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function CategoryDetails() {
  const { id } = useParams(); // ناخد الـ ID من الرابط
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await axios.get(
          `https://generous-optimism-production-4492.up.railway.app/api/content/categories/${id}`
        );
        console
        setCategory(res.data.data); // بيانات الفئة
      } catch (err) {
        console.error(err);
        setError("حدث خطأ أثناء تحميل بيانات الفئة");
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center mt-20">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-600">جاري التحميل...</p>
      </div>
    );
  }

  if (error) {
    return <p className="text-center mt-20 text-red-500">{error}</p>;
  }

  if (!category) {
    return <p className="text-center mt-20">الفئة غير موجودة</p>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* عنوان الفئة */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black">{category.name}</h1>
        <p className="mt-4 text-lg text-gray-600">
          {category.description || "لا يوجد وصف متاح لهذه الفئة."}
        </p>
      </div>

      {/* الدورات أو أي بيانات مرتبطة */}
      {category.courses && category.courses.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">الدورات</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {category.courses.map((course) => (
              <div key={course.id} className="bg-white shadow-lg rounded-xl p-4">
                <img
                  src={course.image_url || "/placeholder.jpg"}
                  alt={course.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-lg font-bold">{course.name}</h3>
                <p className="text-gray-600">{course.description || "لا يوجد وصف."}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}