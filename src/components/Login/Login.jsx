import { useState, useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const { saveToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const initialValues = { email: "", password: "" };
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(6, "Min 6 chars").required("Password required"),
  });

  const handleSubmit = async (values) => {
  try {
    setLoading(true);
    setServerError("");

    const response = await axios.post(
      "https://generous-optimism-production-4492.up.railway.app/api/auth/login",
      values
    );

const resData = response.data?.data;

const token = resData?.token;
const role = resData?.user?.role || "user";



    if (!token) {
      setServerError("Token not received from server");
      return;
    }

    saveToken(token, role);

    const normalizedRole = role.toLowerCase();
    if (normalizedRole === "admin" || normalizedRole === "super_admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/user/home");
    }

  } catch (err) {
    setServerError(err.response?.data?.message || err.message || "Login failed");
  } finally {
    setLoading(false);
  }
};
return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        {serverError && <p className="text-red-500 mb-4">{serverError}</p>}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className="space-y-4">
            <div>
              <label>Email</label>
              <Field name="email" type="email" className="w-full border rounded px-3 py-2"/>
              <ErrorMessage name="email" component="p" className="text-red-500"/>
            </div>
            <div>
              <label>Password</label>
              <Field name="password" type="password" className="w-full border rounded px-3 py-2"/>
              <ErrorMessage name="password" component="p" className="text-red-500"/>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-2 rounded">
              {loading ? "Logging in..." : "Login"}
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
}