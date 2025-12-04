// src/components/SetInitialPassword/SetInitialPassword.jsx
import { useState, useContext } from "react";
import axios from "axios";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../Context/AuthContext";

export default function SetInitialPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { token: paramToken } = useParams();
  const { t } = useTranslation();
  const { saveToken } = useContext(AuthContext);

  const token = paramToken || params.get("token"); // جاي من الرابط
  const authToken = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setServerError(t("passwords_do_not_match"));
      return;
    }

    try {
      setLoading(true);
      setServerError("");
      const res = await axios.post(
        "https://generous-optimism-production-4492.up.railway.app/api/auth/set-initial-password",
        {
          password: password,
          password_confirmation: confirm,
          ...(token && { token }),
        },
        {
          headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
        }
      );
console.log(res);
      if (res.data.token) {
        saveToken(res.data.token, res.data.user?.role || 'user');
      }
      setSuccessMsg(t("password_set_successfully"));
      setTimeout(() => {
        navigate("/user/profile");
      }, 1500);
    } catch (err) {
      setServerError(err.response?.data?.message || err.message || t("error_occurred"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-950">

      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-emerald-600 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-40 w-96 h-96 bg-lime-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-lg px-8">
        <div className="backdrop-blur-2xl bg-white/5 border border-green-500/30 rounded-3xl shadow-2xl overflow-hidden ring-1 ring-white/10 transform-gpu">

          {/* Header */}
          <div className="text-center pt-10 pb-8 px-6">
            <h1 className="text-3xl xs:text-4xl sm:text-4xl py-3 font-black bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent leading-snug break-words">
              {t("set_initial_password")}
            </h1>
            <p className="text-green-200/70 mt-3 text-sm tracking-wide">
              {t("choose_a_secure_password")}
            </p>
          </div>

          {/* Error / Success */}
          {serverError && (
            <div className="mx-8 mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-sm text-center">
              {serverError}
            </div>
          )}
          {successMsg && (
            <div className="mx-8 mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-green-300 text-sm text-center">
              {successMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 pb-10 space-y-6">

            {/* Password */}
            <div className="relative group">
              <input
                type="password"
                placeholder={t("new_password")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 bg-white/10 border border-green-500/40 rounded-2xl 
                           text-green-50 placeholder-green-400/60
                           focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent
                           transition-all duration-300 backdrop-blur-xl"
              />
            </div>

            {/* Confirm Password */}
            <div className="relative group">
              <input
                type="password"
                placeholder={t("confirm_password")}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full px-5 py-4 bg-white/10 border border-green-500/40 rounded-2xl 
                           text-green-50 placeholder-green-400/60
                           focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent
                           transition-all duration-300 backdrop-blur-xl"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-8 bg-gradient-to-r from-green-500 to-emerald-600 
                         hover:from-green-400 hover:to-emerald-500 
                         text-white font-bold text-lg rounded-2xl 
                         shadow-xl hover:shadow-green-500/25 
                         transform transition-all duration-300 
                         active:scale-98 disabled:opacity-70"
            >
              {loading ? t("saving") + "..." : t("save_password")}
            </button>
          </form>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 40px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 20s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
