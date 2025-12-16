// src/pages/Register.jsx
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import authApi from "../api/authApi";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    accountName: "",
    accountNumber: "",
    ccaNumber: "",
    address: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.accountName.trim())
      newErrors.accountName = "Account name is required.";
    if (!form.accountNumber.trim())
      newErrors.accountNumber = "Account number is required.";
    if (!form.ccaNumber.trim())
      newErrors.ccaNumber = "CCA number is required.";
    if (!form.address.trim())
      newErrors.address = "Address is required.";
    if (!form.phone.trim())
      newErrors.phone = "Cellphone number is required.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const v = validate();
    setErrors(v);
    if (Object.keys(v).length !== 0) return;

    try {
      const { data } = await authApi.register(form);

      if (data.error) {
        setServerError(data.error);
        return;
      }

      navigate("/login");
    } catch (err) {
      console.error(err);
      setServerError("Failed to register. Please try again.");
    }
  };

  return (
    <AuthLayout>
      <div className="flex justify-center lg:justify-end">
        <div
          className="
            w-full max-w-md lg:w-[400px]
            bg-white/90 backdrop-blur-xl 
            border border-red-200/40 
            shadow-[0_16px_40px_rgba(15,23,42,0.45)]
            rounded-3xl px-8 py-10
            lg:mr-4 xl:mr-10 2xl:mr-16
            animate-fade-in
          "
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-7 text-center text-slate-900">
            Create Account
          </h2>

          {serverError && (
            <p className="text-sm text-red-600 mb-4 text-center">
              {serverError}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ACCOUNT NAME */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">
                ACCOUNT NAME
              </label>
              <input
                id="accountName"
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
                <p className="text-xs text-red-600 mt-1">
                  {errors.accountName}
                </p>
              )}
            </div>

            {/* ACCOUNT NUMBER */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">
                ACCOUNT NUMBER
              </label>
              <input
                id="accountNumber"
                name="accountNumber"
                value={form.accountNumber}
                onChange={handleChange}
                className="
                  w-full border border-gray-300 bg-white 
                  rounded-xl px-3 py-3 text-sm outline-none
                  focus:ring-2 focus:ring-red-500 focus:border-red-500
                "
              />
              {errors.accountNumber && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.accountNumber}
                </p>
              )}
            </div>

            {/* CCA NUMBER */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">
                CCA NUMBER
              </label>
              <input
                id="ccaNumber"
                name="ccaNumber"
                value={form.ccaNumber}
                onChange={handleChange}
                className="
                  w-full border border-gray-300 bg-white 
                  rounded-xl px-3 py-3 text-sm outline-none
                  focus:ring-2 focus:ring-red-500 focus:border-red-500
                "
              />
              {errors.ccaNumber && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.ccaNumber}
                </p>
              )}
            </div>

            {/* ADDRESS */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">
                ADDRESS
              </label>
              <input
                id="address"
                name="address"
                value={form.address}
                onChange={handleChange}
                className="
                  w-full border border-gray-300 bg-white 
                  rounded-xl px-3 py-3 text-sm outline-none
                  focus:ring-2 focus:ring-red-500 focus:border-red-500
                "
              />
              {errors.address && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.address}
                </p>
              )}
            </div>

            {/* PHONE */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">
                CELLPHONE NUMBER
              </label>
              <input
                id="phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="
                  w-full border border-gray-300 bg-white 
                  rounded-xl px-3 py-3 text-sm outline-none
                  focus:ring-2 focus:ring-red-500 focus:border-red-500
                "
              />
              {errors.phone && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.phone}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="
                w-full py-3 rounded-xl 
                bg-gradient-to-r from-red-500 to-red-600 
                text-white font-semibold
                shadow-md hover:shadow-lg hover:shadow-red-500/30 
                hover:scale-[1.01]
                active:scale-[0.98]
                transition-all
              "
            >
              Register
            </button>

            <p className="text-center text-sm mt-2 text-gray-700">
              Already have an account?{" "}
              <Link to="/login" className="text-red-600 font-semibold">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
}
