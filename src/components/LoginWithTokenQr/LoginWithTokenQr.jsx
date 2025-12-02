import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function LoginWithToken() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const loginWithToken = async () => {
      try {
        // ابعتي الـ token للسيرفر عشان يتحقق منه
        const response = await axios.post(
          "https://generous-optimism-production-4492.up.railway.app/api/login-with-token",
          { token }
        );

        if (response.data.success) {
          // لو ناجح، خزني التوكن مثلاً في localStorage أو في context
          localStorage.setItem("token", response.data.token);
e
          // بعد كده حولي المستخدم للصفحة الرئيسية أو داشبورد
          navigate("/dashboard");
        } else {
          setError("Invalid or expired token");
        }
      } catch (err) {
        setError("Login failed: " + err.message);
      }
    };

    loginWithToken();
  }, [token, navigate]);

  if (error) {
    return (
      <div className="p-6 text-center text-red-600 font-semibold">
        {error}
      </div>
    );
  }

  return <div className="p-6 text-center">Logging in...</div>;
}

export default LoginWithToken;
