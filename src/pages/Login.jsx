// src/pages/Login.jsx
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import SuccessModal from "../components/SuccessModal";
import authApi from "../api/authApi";

export default function Login() {
  const navigate = useNavigate();

  // REMOVED AUDIO + DARK MODE

  const [form, setForm] = useState({ accountName: "", accountId: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [errorShake, setErrorShake] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.accountName.trim())
      newErrors.accountName = "Account name is required.";
    if (!form.accountId.trim())
      newErrors.accountId = "Account number / CCA number is required.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const v = validate();
    setErrors(v);

    if (Object.keys(v).length !== 0) {
      setErrorShake(true);
      setTimeout(() => setErrorShake(false), 400);
      return;
    }

    try {
      setLoading(true);

      const { data } = await authApi.login({
        accountName: form.accountName,
        accountId: form.accountId,
      });

      if (data.error) {
        setServerError(data.error);
        setErrorShake(true);
        setTimeout(() => setErrorShake(false), 400);
        setLoading(false);
        return;
      }

      // Save data
      if (data.token) localStorage.setItem("token", data.token);
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("username", data.user.accountName || "");
        localStorage.setItem("userRole", data.user.role || "user");
      }

      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        navigate("/user-dashboard");
      }, 800);
    } catch (err) {
      console.error(err);
      setServerError("Login failed. Please try again.");
      setErrorShake(true);
      setTimeout(() => setErrorShake(false), 400);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout showNavbar={false}>
      <SuccessModal
        isOpen={showSuccess}
        title="Login Successful!"
        message="Redirecting to your dashboard..."
      />

      {/* TWO COLUMN LAYOUT */}
      <div className="flex flex-col lg:flex-row items-center lg:items-stretch gap-10 lg:gap-16">

        {/* LEFT TEXT PANEL */}
        <div
          className="
          w-full lg:w-1/2 
          text-white 
          drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]
          px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24
          flex flex-col justify-center
        "
        >
          <p className="text-sm sm:text-base uppercase tracking-[0.22em] text-red-200 font-semibold mb-3">
            Welcome to
          </p>

          <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold leading-tight">
            Descallar
          </h1>

          <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold leading-tight text-red-400">
            Satellite Services
          </h1>

          <p className="mt-6 max-w-xl text-base sm:text-lg text-slate-100/95 leading-relaxed tracking-wide">
            Your trusted partner for Cignal TV and satellite solutions in Balayan 
            and nearby areas. We provide reliable installations, excellent customer 
            service, and fast technical assistance for all your Cignal needs.
          </p>

          <div className="mt-8 space-y-3 text-base sm:text-lg font-medium">
            <div className="flex items-start gap-2">
              <span className="text-red-300 text-xl">📍</span>
              <span>Langgangan, Balayan, Batangas</span>
            </div>

            <div className="flex items-start gap-2">
              <span className="text-red-300 text-xl">📞</span>
              <span>0975-571-8056 / 0917-511-9647</span>
            </div>
          </div>
        </div>

        {/* RIGHT LOGIN CARD */}
        <div
          className={`
            w-full max-w-md lg:w-[380px]
            bg-white/90 backdrop-blur-xl 
            border border-red-200/40 
            shadow-[0_16px_40px_rgba(15,23,42,0.45)]
            rounded-3xl px-8 py-10 
            lg:ml-auto lg:mr-4 xl:mr-10 2xl:mr-16
            animate-fade-in
            ${errorShake ? "shake" : ""}
          `}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-7 text-center text-slate-900">
            <span className="text-red-600">User</span> Login
          </h2>

          {serverError && (
            <p className="text-red-600 text-sm mb-4 text-center font-medium">
              {serverError}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* ACCOUNT NAME */}
            <div>
              <label className="text-xs font-semibold text-gray-600">
                ACCOUNT NAME
              </label>
              <input
                name="accountName"
                value={form.accountName}
                onChange={handleChange}
                className="
                  w-full border border-gray-300 bg-white
                  rounded-xl px-3 py-3 text-sm outline-none
                  focus:ring-2 focus:ring-red-500 focus:border-red-500
                "
              />
              {errors.accountName && (
                <p className="text-xs text-red-600 mt-1">{errors.accountName}</p>
              )}
            </div>

            {/* ACCOUNT NUMBER / CCA */}
            <div>
              <label className="text-xs font-semibold text-gray-600">
                ACCOUNT NUMBER / CCA NUMBER
              </label>
              <input
                name="accountId"
                value={form.accountId}
                onChange={handleChange}
                className="
                  w-full border border-gray-300 bg-white
                  rounded-xl px-3 py-3 text-sm outline-none
                  focus:ring-2 focus:ring-red-500 focus:border-red-500
                "
              />
              {errors.accountId && (
                <p className="text-xs text-red-600 mt-1">{errors.accountId}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="
                w-full bg-gradient-to-r from-red-500 to-red-600 
                text-white py-3 rounded-xl font-semibold shadow-md
                hover:scale-[1.01] hover:shadow-lg hover:shadow-red-500/30
                transition-all disabled:opacity-60
              "
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <p className="text-center text-sm text-gray-700">
              Don’t have an account?{" "}
              <Link to="/register" className="text-red-600 font-semibold">
                Register
              </Link>
            </p>

            <div className="text-center mt-3">
              <button
                type="button"
                onClick={() => navigate("/admin-login")}
                className="text-blue-700 font-medium underline hover:text-blue-900"
              >
                Admin Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
}
