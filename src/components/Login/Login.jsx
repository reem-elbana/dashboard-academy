
import { useState, useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Login() {
  const [serverError, setServerError] = useState("");
  const { saveToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const initialValues = { email: "", password: "" };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email")
      .required(t("email") + " is required"),
    password: Yup.string()
      .min(6, "Min 6 chars")
      .required(t("new_password") + " required"),
  });

  const handleSubmit = async (values) => {
    try {
      setServerError("");

      // API ثابت لكل الـ Roles
      const apiUrl =
        "https://generous-optimism-production-4492.up.railway.app/api/auth/login";

      const response = await axios.post(apiUrl, { ...values, user_type: "subscriber" });
      const resData = response.data?.data;

      const token = resData?.token;
      const userRole = resData?.user?.role || "user";

      if (!token) {
        setServerError("Token not received from server");
        return;
      }

      saveToken(token, userRole);

      // Navigate حسب الدور
      const normalizedRole = userRole.toLowerCase();

      if (normalizedRole === "super_admin") navigate("/admin/dashboard");
      else if (normalizedRole === "admin") navigate("/admin/dashboard");
      else navigate("/user/home");

    } catch (err) {
      setServerError(
        err.response?.data?.message || err.message || "Login failed"
      );
    }
  };

  return (
<div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-950">

  {/* Animated Background */}
  <div className="absolute inset-0">
    <div className="absolute top-10 left-10 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply blur-3xl opacity-50 animate-blob"></div>
    <div className="absolute top-40 right-20 w-80 h-80 bg-emerald-600 rounded-full mix-blend-multiply blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
    <div className="absolute -bottom-20 left-40 w-96 h-96 bg-lime-500 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
  </div>

  {/* Floating Sports Icons */}
  <div className="absolute inset-0 pointer-events-none">
    {["⚽","🏀","🎾","🏈","🏐","⚾"].map((icon,i)=>(
      <div
        key={i}
        className="absolute text-6xl opacity-10 animate-float-slow"
        style={{
          top: `${20 + i * 12}%`,
          left: i % 2 === 0 ? `${10 + i * 15}%` : "auto",
          right: i % 2 === 1 ? `${10 + i * 10}%` : "auto",
          animationDelay: `${i * 1.5}s`,
          animationDuration: `${12 + i}s`,
        }}
      >
        {icon}
      </div>
    ))}
  </div>

  {/* Login Card */}
  <div className="relative z-10 w-full max-w-lg px-8">
    <div className="backdrop-blur-2xl bg-white/5 border border-green-500/30 rounded-3xl shadow-2xl overflow-hidden ring-1 ring-white/10">

      {/* Header */}
      <div className="text-center pt-10 pb-8 px-6">
        <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
          {t("login")}
        </h1>
        <p className="text-green-200/70 mt-3 text-sm">Welcome back, champion</p>
      </div>

      {/* Error */}
      {serverError && (
        <div className="mx-8 mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-sm text-center">
          {serverError}
        </div>
      )}

      {/* Form */}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="px-8 pb-10 space-y-6">

            {/* Email */}
            <div>
              <Field
                name="email"
                type="email"
                className="w-full px-5 py-4 bg-white/10 border border-green-500/40 
                  rounded-2xl text-green-50 placeholder-green-400/60
                  focus:ring-2 focus:ring-green-400 focus:border-transparent"
                placeholder={t("email")}
              />
              <ErrorMessage
                name="email"
                component="p"
                className="text-red-400 text-xs mt-2"
              />
            </div>

            {/* Password */}
            <div>
              <Field
                name="password"
                type="password"
                className="w-full px-5 py-4 bg-white/10 border border-green-500/40 
                  rounded-2xl text-green-50 placeholder-green-400/60
                  focus:ring-2 focus:ring-green-400 focus:border-transparent"
                placeholder={t("new_password")}
              />
              <ErrorMessage
                name="password"
                component="p"
                className="text-red-400 text-xs mt-2"
              />

              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-green-300 hover:text-green-100 text-sm mt-3 underline"
              >
                {t("forgot_password")}?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 mt-6 bg-gradient-to-r from-green-500 to-emerald-600 
                hover:from-green-400 hover:to-emerald-500 text-white font-bold text-lg rounded-2xl"
            >
              {isSubmitting ? "Signing in..." : t("login").toUpperCase()}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  </div>

  {/* Animations */}
  <style>{`
    @keyframes blob {
      0%, 100% { transform: translate(0px, 0px) scale(1); }
      33% { transform: translate(30px, -50px) scale(1.1); }
      66% { transform: translate(-20px, 40px) scale(0.9); }
    }
    .animate-blob { animation: blob 20s infinite; }
    .animation-delay-2000 { animation-delay: 2s; }
    .animation-delay-4000 { animation-delay: 4s; }

    @keyframes float-slow {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-40px); }
    }
    .animate-float-slow { animation: float-slow 15s ease-in-out infinite; }
  `}</style>
</div>
  );
}
