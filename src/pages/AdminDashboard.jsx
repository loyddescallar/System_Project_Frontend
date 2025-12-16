// src/pages/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ticketApi from "../api/ticketApi";
import customerApi from "../api/customerApi";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("tickets"); // "tickets" | "customers" | "technicians"

  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(true);

  const [customers, setCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);

  const [ticketError, setTicketError] = useState("");
  const [customerError, setCustomerError] = useState("");

  // CUSTOMER FORM
  const emptyCustomer = {
    id: null,
    accountName: "",
    accountNumber: "",
    ccaNumber: "",
    address: "",
    phone: "",
    role: "user",
  };
  const [editingCustomer, setEditingCustomer] = useState(emptyCustomer);
  const [savingCustomer, setSavingCustomer] = useState(false);

  // Load tickets & customers
  const loadTickets = async () => {
    setLoadingTickets(true);
    setTicketError("");
    try {
      const res = await ticketApi.getAdminTickets();
      setTickets(res.data.tickets || []);
    } catch (err) {
      console.error("ADMIN LOAD TICKETS ERROR:", err);
      setTicketError("Failed to load tickets.");
    } finally {
      setLoadingTickets(false);
    }
  };

  const loadCustomers = async () => {
    setLoadingCustomers(true);
    setCustomerError("");
    try {
      const res = await customerApi.getCustomers();
      setCustomers(res.data.customers || []);
    } catch (err) {
      console.error("ADMIN LOAD CUSTOMERS ERROR:", err);
      setCustomerError("Failed to load customers.");
    } finally {
      setLoadingCustomers(false);
    }
  };

  useEffect(() => {
    loadTickets();
    loadCustomers();
  }, []);

  // Derived data
  const totalTickets = tickets.length;
  const totalTechRequests = tickets.filter(
    (t) => t.category === "Technician Request"
  ).length;
  const totalCustomers = customers.length;

  const handleTicketStatusChange = async (id, newStatus) => {
    try {
      await ticketApi.updateTicketStatus(id, newStatus);
      await loadTickets();
    } catch (err) {
      console.error("UPDATE TICKET STATUS ERROR:", err);
      alert("Failed to update ticket status.");
    }
  };

  const handleDeleteTicket = async (id, status) => {
    if (status !== "Resolved" && status !== "Closed") {
      alert("You can only delete tickets that are Resolved or Closed.");
      return;
    }
    if (!window.confirm("Are you sure you want to permanently delete this ticket?")) {
      return;
    }

    try {
      await ticketApi.deleteTicket(id);
      await loadTickets();
    } catch (err) {
      console.error("DELETE TICKET ERROR:", err);
      alert("Failed to delete ticket.");
    }
  };

  // Customer form handlers
  const startNewCustomer = () => {
    setEditingCustomer(emptyCustomer);
  };

  const startEditCustomer = (c) => {
    setEditingCustomer({
      id: c.id,
      accountName: c.accountName || "",
      accountNumber: c.accountNumber || "",
      ccaNumber: c.ccaNumber || "",
      address: c.address || "",
      phone: c.phone || "",
      role: c.role || "user",
    });
  };

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setEditingCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const saveCustomer = async () => {
    const { id, accountName, accountNumber, ccaNumber, address, phone, role } =
      editingCustomer;

    if (!accountName || !accountNumber || !ccaNumber) {
      alert("Account Name, Account Number, and CCA Number are required.");
      return;
    }

    setSavingCustomer(true);
    try {
      if (id) {
        await customerApi.updateCustomer(id, {
          accountName,
          accountNumber,
          ccaNumber,
          address,
          phone,
          role,
        });
      } else {
        await customerApi.createCustomer({
          accountName,
          accountNumber,
          ccaNumber,
          address,
          phone,
          role,
        });
      }

      await loadCustomers();
      setEditingCustomer(emptyCustomer);
    } catch (err) {
      console.error("SAVE CUSTOMER ERROR:", err);
      alert("Failed to save customer.");
    } finally {
      setSavingCustomer(false);
    }
  };

  const deleteCustomer = async (id) => {
    if (!window.confirm("Delete this customer? This cannot be undone.")) return;
    try {
      await customerApi.deleteCustomer(id);
      await loadCustomers();
    } catch (err) {
      console.error("DELETE CUSTOMER ERROR:", err);
      alert("Failed to delete customer.");
    }
  };

  // Technician tickets derived from tickets
  const technicianTickets = tickets.filter(
    (t) => t.category === "Technician Request"
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
        {/* HEADER */}
        <header className="rounded-3xl bg-gradient-to-r from-cignalRed via-red-600 to-rose-500 text-white p-6 shadow-xl flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Descallar Satellite Services Admin Dashboard
            </h1>
            <p className="text-sm text-red-100 mt-1 max-w-md">
              Manage tickets, customers, and technician requests for Descallar Satellite
              Services.
            </p>
          </div>
        </header>

        {/* SUMMARY CARDS */}
        <section className="grid gap-4 md:grid-cols-3">
          <div className="bg-white rounded-2xl p-4 shadow border border-slate-200">
            <p className="text-xs font-semibold text-cignalRed uppercase">
              Total Tickets
            </p>
            <p className="text-3xl font-bold mt-2">{totalTickets}</p>
            <p className="text-xs text-slate-500 mt-1">
              All user-submitted support tickets.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow border border-slate-200">
            <p className="text-xs font-semibold text-cignalRed uppercase">
              Technician Requests
            </p>
            <p className="text-3xl font-bold mt-2">{totalTechRequests}</p>
            <p className="text-xs text-slate-500 mt-1">
              Tickets flagged as Technician Request.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow border border-slate-200">
            <p className="text-xs font-semibold text-cignalRed uppercase">
              Customers
            </p>
            <p className="text-3xl font-bold mt-2">{totalCustomers}</p>
            <p className="text-xs text-slate-500 mt-1">
              Registered Descallar Satellite Services accounts.
            </p>
          </div>
        </section>

        {/* TABS */}
        <section>
          <div className="flex gap-2 border-b border-slate-200">
            {["tickets", "customers", "technicians"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-semibold border-b-2 -mb-[1px] transition
                  ${
                    activeTab === tab
                      ? "border-cignalRed text-cignalRed"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
              >
                {tab === "tickets"
                  ? "Ticket Panel"
                  : tab === "customers"
                  ? "Customers"
                  : "Technician Requests"}
              </button>
            ))}
          </div>

          {/* TAB CONTENT */}
          <div className="mt-4">
            {/* TICKETS TAB */}
            {activeTab === "tickets" && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto p-4">
                <h2 className="text-lg font-semibold mb-3">User Tickets</h2>

                {ticketError && (
                  <p className="text-sm text-red-600 mb-2">{ticketError}</p>
                )}

                {loadingTickets ? (
                  <p className="text-sm text-slate-500">Loading tickets...</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead className="bg-slate-100 text-left">
                      <tr>
                        <th className="p-2">ID</th>
                        <th className="p-2">User</th>
                        <th className="p-2">Category</th>
                        <th className="p-2">Subject</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">Created</th>
                        <th className="p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tickets.length === 0 ? (
                        <tr>
                          <td
                            colSpan="7"
                            className="p-3 text-center text-slate-500"
                          >
                            No tickets found.
                          </td>
                        </tr>
                      ) : (
                        tickets.map((t) => (
                          <tr
                            key={t.id}
                            className="border-b last:border-0 hover:bg-slate-50"
                          >
                            <td className="p-2 font-semibold">{t.id}</td>
                            <td className="p-2">{t.accountName || t.user_id}</td>
                            <td className="p-2">{t.category}</td>
                            <td className="p-2 max-w-xs truncate">{t.subject}</td>
                            <td className="p-2">
                              <select
                                value={t.status}
                                onChange={(e) =>
                                  handleTicketStatusChange(t.id, e.target.value)
                                }
                                className="border border-slate-300 rounded-full px-2 py-1 text-xs bg-white"
                              >
                                <option value="Open">Open</option>
                                <option value="Ongoing">Ongoing</option>
                                <option value="Resolved">Resolved</option>
                                <option value="Closed">Closed</option>
                              </select>
                            </td>
                            <td className="p-2">
                              {t.created_at
                                ? new Date(t.created_at).toLocaleString()
                                : "N/A"}
                            </td>
                            <td className="p-2 space-x-2">
                              <button
                                onClick={() => navigate(`/admin/chat/${t.id}`)}
                                className="text-xs px-3 py-1 rounded-full bg-cignalRed text-white hover:bg-red-700"
                              >
                                Chat
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteTicket(t.id, t.status)
                                }
                                className="text-xs px-3 py-1 rounded-full bg-slate-200 text-slate-700 hover:bg-slate-300"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* CUSTOMERS TAB */}
            {activeTab === "customers" && (
              <div className="grid gap-4 lg:grid-cols-[2fr_1.3fr]">
                {/* List */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold">Customers</h2>
                    <button
                      onClick={startNewCustomer}
                      className="text-xs px-3 py-1 rounded-full bg-cignalRed text-white hover:bg-red-700"
                    >
                      + New Customer
                    </button>
                  </div>

                  {customerError && (
                    <p className="text-sm text-red-600 mb-2">{customerError}</p>
                  )}

                  {loadingCustomers ? (
                    <p className="text-sm text-slate-500">
                      Loading customers...
                    </p>
                  ) : (
                    <table className="w-full text-sm">
                      <thead className="bg-slate-100 text-left">
                        <tr>
                          <th className="p-2">ID</th>
                          <th className="p-2">Account Name</th>
                          <th className="p-2">Account #</th>
                          <th className="p-2">CCA #</th>
                          <th className="p-2">Phone</th>
                          <th className="p-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customers.length === 0 ? (
                          <tr>
                            <td
                              colSpan="6"
                              className="p-3 text-center text-slate-500"
                            >
                              No customers found.
                            </td>
                          </tr>
                        ) : (
                          customers.map((c) => (
                            <tr
                              key={c.id}
                              className="border-b last:border-0 hover:bg-slate-50"
                            >
                              <td className="p-2">{c.id}</td>
                              <td className="p-2">{c.accountName}</td>
                              <td className="p-2">{c.accountNumber}</td>
                              <td className="p-2">{c.ccaNumber}</td>
                              <td className="p-2">{c.phone}</td>
                              <td className="p-2 space-x-2">
                                <button
                                  onClick={() => startEditCustomer(c)}
                                  className="text-xs px-3 py-1 rounded-full bg-slate-200 text-slate-800 hover:bg-slate-300"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => deleteCustomer(c.id)}
                                  className="text-xs px-3 py-1 rounded-full bg-red-50 text-red-600 hover:bg-red-100"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  )}
                </div>

                {/* Form */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                  <h2 className="text-lg font-semibold mb-3">
                    {editingCustomer.id ? "Edit Customer" : "New Customer"}
                  </h2>

                  <div className="space-y-3 text-sm">
                    <div>
                      <label className="font-semibold text-xs uppercase text-slate-600">
                        Account Name *
                      </label>
                      <input
                        name="accountName"
                        value={editingCustomer.accountName}
                        onChange={handleCustomerChange}
                        className="w-full mt-1 border border-slate-300 rounded-lg px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-xs uppercase text-slate-600">
                        Account Number *
                      </label>
                      <input
                        name="accountNumber"
                        value={editingCustomer.accountNumber}
                        onChange={handleCustomerChange}
                        className="w-full mt-1 border border-slate-300 rounded-lg px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-xs uppercase text-slate-600">
                        CCA Number *
                      </label>
                      <input
                        name="ccaNumber"
                        value={editingCustomer.ccaNumber}
                        onChange={handleCustomerChange}
                        className="w-full mt-1 border border-slate-300 rounded-lg px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-xs uppercase text-slate-600">
                        Address
                      </label>
                      <input
                        name="address"
                        value={editingCustomer.address}
                        onChange={handleCustomerChange}
                        className="w-full mt-1 border border-slate-300 rounded-lg px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-xs uppercase text-slate-600">
                        Phone
                      </label>
                      <input
                        name="phone"
                        value={editingCustomer.phone}
                        onChange={handleCustomerChange}
                        className="w-full mt-1 border border-slate-300 rounded-lg px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-xs uppercase text-slate-600">
                        Role
                      </label>
                      <select
                        name="role"
                        value={editingCustomer.role}
                        onChange={handleCustomerChange}
                        className="w-full mt-1 border border-slate-300 rounded-lg px-3 py-2"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>

                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={saveCustomer}
                        disabled={savingCustomer}
                        className={`flex-1 py-2 rounded-lg text-sm font-semibold text-white bg-cignalRed hover:bg-red-700 transition ${
                          savingCustomer ? "opacity-60 cursor-not-allowed" : ""
                        }`}
                      >
                        {savingCustomer
                          ? "Saving..."
                          : editingCustomer.id
                          ? "Update"
                          : "Create"}
                      </button>
                      <button
                        onClick={() => setEditingCustomer(emptyCustomer)}
                        className="flex-1 py-2 rounded-lg text-sm font-semibold border border-slate-300 bg-white hover:bg-slate-50"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TECHNICIAN REQUESTS TAB */}
            {activeTab === "technicians" && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto p-4">
                <h2 className="text-lg font-semibold mb-3">
                  Technician Request Tickets
                </h2>

                {loadingTickets ? (
                  <p className="text-sm text-slate-500">
                    Loading technician requests...
                  </p>
                ) : (
                  <table className="w-full text-sm">
                    <thead className="bg-slate-100 text-left">
                      <tr>
                        <th className="p-2">ID</th>
                        <th className="p-2">User</th>
                        <th className="p-2">Subject</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">Created</th>
                        <th className="p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {technicianTickets.length === 0 ? (
                        <tr>
                          <td
                            colSpan="6"
                            className="p-3 text-center text-slate-500"
                          >
                            No technician request tickets found.
                          </td>
                        </tr>
                      ) : (
                        technicianTickets.map((t) => (
                          <tr
                            key={t.id}
                            className="border-b last:border-0 hover:bg-slate-50"
                          >
                            <td className="p-2 font-semibold">{t.id}</td>
                            <td className="p-2">{t.accountName || t.user_id}</td>
                            <td className="p-2 max-w-xs truncate">{t.subject}</td>
                            <td className="p-2">
                              <select
                                value={t.status}
                                onChange={(e) =>
                                  handleTicketStatusChange(t.id, e.target.value)
                                }
                                className="border border-slate-300 rounded-full px-2 py-1 text-xs bg-white"
                              >
                                <option value="Open">Open</option>
                                <option value="Ongoing">Ongoing</option>
                                <option value="Resolved">Resolved</option>
                                <option value="Closed">Closed</option>
                              </select>
                            </td>
                            <td className="p-2">
                              {t.created_at
                                ? new Date(t.created_at).toLocaleString()
                                : "N/A"}
                            </td>
                            <td className="p-2 space-x-2">
                              <button
                                onClick={() => navigate(`/admin/chat/${t.id}`)}
                                className="text-xs px-3 py-1 rounded-full bg-cignalRed text-white hover:bg-red-700"
                              >
                                Open Chat
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
