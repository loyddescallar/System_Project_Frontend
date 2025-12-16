// src/pages/UserRetrieveInfo.jsx
import { useState } from "react";
import Navbar from "../components/Navbar";
import axiosClient from "../api/axiosClient";

export default function UserRetrieveInfo() {
  const [accountNumber, setAccountNumber] = useState("");
  const [customer, setCustomer] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch Customer Info
  const handleRetrieve = async () => {
    setError("");
    setCustomer(null);

    if (!accountNumber.trim()) {
      setError("Please enter your account number.");
      return;
    }

    setLoading(true);

    try {
      const res = await axiosClient.get(`/customers/${accountNumber.trim()}`);

      if (!res.data.user) {
        setError("No customer found for this account number.");
      } else {
        setCustomer(res.data.user);
      }
    } catch (err) {
      console.error(err);
      setError("Customer not found. Please check your account number.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-16">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 mt-12">

        {/* HEADER */}
        <div className="mb-10 animate-slide-down">
          <h1 className="text-4xl font-bold text-cignalRed">
            Retrieve Customer Information
          </h1>

          <p className="text-slate-300 mt-2 max-w-2xl">
            Enter your Cignal account number to retrieve your registered details.
          </p>
        </div>

        {/* SEARCH CARD */}
        <div className="
          bg-slate-900 border border-slate-700/60 rounded-2xl p-8 
          shadow-xl max-w-3xl animate-fadeIn
        ">
          <label className="text-sm font-semibold text-slate-300">
            Account Number
          </label>

          <input
            type="text"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            placeholder="Enter your Cignal account number"
            className="
              w-full mt-2 px-4 py-3 rounded-xl bg-slate-800 text-white
              border border-slate-700 focus:ring-2 focus:ring-cignalRed 
              outline-none transition
            "
          />

          <button
            onClick={handleRetrieve}
            className="
              w-full mt-5 py-3 rounded-xl bg-cignalRed
              font-semibold shadow-lg hover:bg-red-700 transition btn-glow
            "
          >
            Retrieve Information
          </button>

          {error && (
            <p className="text-red-400 mt-4 text-sm animate-fadeIn">{error}</p>
          )}
        </div>

        {/* LOADING SPINNER */}
        {loading && (
          <div className="flex flex-col items-center mt-10 animate-fadeIn">
            <div className="h-12 w-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
            <p className="text-slate-300 mt-3">Searching… Please wait.</p>
          </div>
        )}

        {/* RESULT CARD */}
        {customer && !loading && (
          <div className="
            mt-12 bg-white text-slate-900 rounded-2xl p-10 
            shadow-2xl animate-slide-up border border-slate-200
          ">
            <h2 className="text-2xl font-bold text-cignalRed mb-6">
              Account Information
            </h2>

            <div className="grid md:grid-cols-2 gap-6 text-lg">
              <div>
                <p><strong>Account Name:</strong> {customer.accountName}</p>
                <p className="mt-2">
                  <strong>Account Number:</strong> {customer.accountNumber}
                </p>
                <p className="mt-2">
                  <strong>CCA Number:</strong> {customer.ccaNumber}
                </p>
              </div>

              <div>
                <p><strong>Address:</strong> {customer.address}</p>
                <p className="mt-2">
                  <strong>Phone:</strong> {customer.phone}
                </p>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `Name: ${customer.accountName}\nAccount Number: ${customer.accountNumber}\nCCA: ${customer.ccaNumber}\nAddress: ${customer.address}\nPhone: ${customer.phone}`
                  );
                  alert("Customer info copied!");
                }}
                className="
                  flex-1 py-3 rounded-xl bg-slate-900 text-white 
                  hover:bg-slate-700 transition shadow
                "
              >
                Copy Information
              </button>

              <button
                onClick={() => (window.location.href = "/user-dashboard")}
                className="
                  flex-1 py-3 rounded-xl bg-cignalRed text-white 
                  hover:bg-red-700 transition shadow
                "
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
