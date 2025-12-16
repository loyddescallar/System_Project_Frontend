// src/pages/AdminCustomers.jsx
import { useState } from "react";
import Navbar from "../components/Navbar";
import {
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";

export default function AdminCustomers() {
  // SAMPLE DATA FOR NOW – later this will come from your backend
  const [customers, setCustomers] = useState([
    {
      id: 1,
      accountName: "Juan Dela Cruz",
      accountNumber: "123456",
      ccaNumber: "CCA001",
      address: "Quezon City",
      phone: "09123456789",
    },
    {
      id: 2,
      accountName: "Maria Santos",
      accountNumber: "789012",
      ccaNumber: "CCA002",
      address: "Pasig City",
      phone: "09998887777",
    },
  ]);

  const [search, setSearch] = useState("");
  const [mode, setMode] = useState(null); // "view" | "add" | "edit" | "delete"
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const filteredCustomers = customers.filter(
    (c) =>
      c.accountName.toLowerCase().includes(search.toLowerCase()) ||
      c.accountNumber.includes(search)
  );

  const closeModal = () => {
    setMode(null);
    setSelectedCustomer(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main className="main-shell animate-slide-left">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">Customer Management</h1>
            <p className="text-sm text-slate-300">
              Admin view for searching, adding, editing, and deleting customer
              records.
            </p>
          </div>

          <button
            onClick={() => setMode("add")}
            className="flex items-center gap-2 bg-cignalRed px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition btn-glow"
          >
            <PlusIcon className="h-5 w-5" />
            Add Customer
          </button>
        </div>

        {/* SEARCH BAR */}
        <div className="mt-6">
          <input
            type="text"
            placeholder="Search by name or account number..."
            className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm outline-none focus:ring-2 focus:ring-red-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto mt-6">
          <table className="w-full text-left border-collapse bg-slate-900 rounded-lg overflow-hidden">
            <thead className="bg-slate-800 text-slate-300 uppercase text-xs">
              <tr>
                <th className="p-3">Account Name</th>
                <th className="p-3">Account No.</th>
                <th className="p-3">CCA No.</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Address</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredCustomers.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-slate-800 hover:bg-slate-800/60"
                >
                  <td className="p-3">{c.accountName}</td>
                  <td className="p-3">{c.accountNumber}</td>
                  <td className="p-3">{c.ccaNumber}</td>
                  <td className="p-3">{c.phone}</td>
                  <td className="p-3">{c.address}</td>
                  <td className="p-3">
                    <div className="flex items-center justify-center gap-3">
                      {/* VIEW */}
                      <button
                        className="text-blue-400 hover:text-blue-300"
                        onClick={() => {
                          setSelectedCustomer(c);
                          setMode("view");
                        }}
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>

                      {/* EDIT */}
                      <button
                        className="text-yellow-400 hover:text-yellow-300"
                        onClick={() => {
                          setSelectedCustomer(c);
                          setMode("edit");
                        }}
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </button>

                      {/* DELETE */}
                      <button
                        className="text-red-400 hover:text-red-300"
                        onClick={() => {
                          setSelectedCustomer(c);
                          setMode("delete");
                        }}
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredCustomers.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="p-6 text-center text-slate-400 text-sm"
                  >
                    No customers found. Try a different search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* MODALS */}
      {mode && (
        <Modal onClose={closeModal}>
          {/* VIEW */}
          {mode === "view" && selectedCustomer && (
            <div className="space-y-2 text-sm">
              <h2 className="text-xl font-semibold mb-4">
                Customer Information
              </h2>
              <InfoRow label="Name" value={selectedCustomer.accountName} />
              <InfoRow
                label="Account Number"
                value={selectedCustomer.accountNumber}
              />
              <InfoRow label="CCA Number" value={selectedCustomer.ccaNumber} />
              <InfoRow label="Phone" value={selectedCustomer.phone} />
              <InfoRow label="Address" value={selectedCustomer.address} />
            </div>
          )}

          {/* ADD */}
          {mode === "add" && (
            <>
              <h2 className="text-xl font-semibold mb-4">Add New Customer</h2>
              <CustomerForm
                initial={{
                  accountName: "",
                  accountNumber: "",
                  ccaNumber: "",
                  address: "",
                  phone: "",
                }}
                onSubmit={(newCustomer) => {
                  setCustomers((prev) => [
                    ...prev,
                    { id: Date.now(), ...newCustomer },
                  ]);
                  closeModal();
                }}
              />
            </>
          )}

          {/* EDIT */}
          {mode === "edit" && selectedCustomer && (
            <>
              <h2 className="text-xl font-semibold mb-4">Edit Customer</h2>
              <CustomerForm
                initial={selectedCustomer}
                onSubmit={(updated) => {
                  setCustomers((prev) =>
                    prev.map((c) =>
                      c.id === selectedCustomer.id ? { ...c, ...updated } : c
                    )
                  );
                  closeModal();
                }}
              />
            </>
          )}

          {/* DELETE */}
          {mode === "delete" && selectedCustomer && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-red-600">
                Delete Customer
              </h2>
              <p className="text-sm text-gray-700 mb-6">
                Are you sure you want to delete{" "}
                <b>{selectedCustomer.accountName}</b>? This action cannot be
                undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setCustomers((prev) =>
                      prev.filter((c) => c.id !== selectedCustomer.id)
                    );
                    closeModal();
                  }}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                >
                  Delete
                </button>
                <button
                  onClick={closeModal}
                  className="flex-1 bg-slate-700 text-white py-2 rounded-lg hover:bg-slate-600 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}

/* SMALL INFO ROW FOR VIEW MODAL */
function InfoRow({ label, value }) {
  return (
    <p>
      <span className="font-semibold text-gray-700 mr-1">{label}:</span>
      <span className="text-gray-900">{value}</span>
    </p>
  );
}

/* REUSABLE MODAL */
function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[200] p-4">
      <div className="bg-white text-black rounded-lg p-6 w-full max-w-md animate-modal-animate shadow-xl">
        {children}

        <button
          onClick={onClose}
          className="mt-6 w-full bg-slate-900 text-white py-2 rounded-lg hover:bg-slate-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}

/* REUSABLE FORM */
function CustomerForm({ initial, onSubmit }) {
  const [form, setForm] = useState(initial);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (
      !form.accountName.trim() ||
      !form.accountNumber.trim() ||
      !form.ccaNumber.trim()
    ) {
      alert("Account Name, Account Number, and CCA Number are required.");
      return;
    }
    onSubmit(form);
  };

  return (
    <div className="space-y-4 text-sm">
      {[
        { key: "accountName", label: "Account Name" },
        { key: "accountNumber", label: "Account Number" },
        { key: "ccaNumber", label: "CCA Number" },
        { key: "address", label: "Address" },
        { key: "phone", label: "Phone" },
      ].map((field) => (
        <div key={field.key}>
          <label className="text-xs font-semibold text-gray-600">
            {field.label}
          </label>
          <input
            name={field.key}
            value={form[field.key] || ""}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
      ))}

      <button
        onClick={handleSave}
        className="w-full bg-cignalRed text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition"
      >
        Save
      </button>
    </div>
  );
}
