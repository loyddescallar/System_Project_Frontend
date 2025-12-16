import { useEffect, useState } from "react";
import ticketApi from "../api/ticketApi";

export default function AdminTickets() {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // ====== LOAD ALL TICKETS (ADMIN) ======
  useEffect(() => {
    const loadTickets = async () => {
      try {
        setLoading(true);
        const { data } = await ticketApi.getAdminTickets();

        if (data.error) {
          setError(data.error);
        } else {
          setTickets(data.tickets || []);
          setError("");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load tickets.");
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, []);

  // ====== FILTER / SEARCH ======
  useEffect(() => {
    let result = [...tickets];

    if (statusFilter !== "All") {
      result = result.filter((t) => t.status === statusFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          String(t.id).includes(q) ||
          (t.title && t.title.toLowerCase().includes(q)) ||
          (t.description && t.description.toLowerCase().includes(q))
      );
    }

    setFilteredTickets(result);
  }, [tickets, statusFilter, search]);

  // ====== LOAD SINGLE TICKET + MESSAGES ======
  const selectTicket = async (ticketId) => {
    setSelectedTicketId(ticketId);
    setSelectedTicket(null);
    setMessages([]);
    setError("");

    try {
      const [ticketRes, messagesRes] = await Promise.all([
        ticketApi.getTicket(ticketId),
        ticketApi.getMessages(ticketId),
      ]);

      if (ticketRes.data.error) {
        setError(ticketRes.data.error);
      } else {
        setSelectedTicket(ticketRes.data.ticket);
      }

      if (messagesRes.data.error) {
        setError((prev) => prev || messagesRes.data.error);
      } else {
        setMessages(messagesRes.data.messages || []);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load ticket details.");
    }
  };

  // ====== UPDATE STATUS ======
  const handleStatusChange = async (newStatus) => {
    if (!selectedTicketId) return;
    setUpdatingStatus(true);
    setError("");

    try {
      const { data } = await ticketApi.updateStatus(selectedTicketId, newStatus);
      if (data.error) {
        setError(data.error);
      } else {
        // refresh ticket + list
        await selectTicket(selectedTicketId);
        const listRes = await ticketApi.getAdminTickets();
        setTickets(listRes.data.tickets || []);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to update status.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  // ====== SEND MESSAGE ======
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedTicketId) return;

    setSending(true);
    setError("");

    try {
      const { data } = await ticketApi.sendMessage(
        selectedTicketId,
        messageText.trim()
      );
      if (data.error) {
        setError(data.error);
      } else {
        setMessageText("");
        // reload messages
        const res = await ticketApi.getMessages(selectedTicketId);
        setMessages(res.data.messages || []);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Support Tickets (Admin)</h1>
        <p className="text-sm text-gray-300 mb-6">
          View all user tickets, update their status, and chat with users.
        </p>

        {error && (
          <div className="mb-4 rounded bg-red-700/80 px-4 py-2 text-sm">
            {error}
          </div>
        )}

        {/* TOP CONTROLS */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm"
            >
              <option>All</option>
              <option>Open</option>
              <option>Pending</option>
              <option>Closed</option>
            </select>
          </div>

          <input
            placeholder="Search by ID, title, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm w-full md:w-80"
          />
        </div>

        {/* MAIN LAYOUT: TABLE + DETAILS */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr,1.5fr] gap-6">
          {/* TICKETS TABLE */}
          <div className="bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-800 flex justify-between items-center">
              <span className="font-semibold text-sm">Tickets</span>
              {loading && (
                <span className="text-xs text-gray-400">Loading...</span>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-900">
                  <tr className="text-left text-gray-300 border-b border-slate-800">
                    <th className="px-4 py-2">ID</th>
                    <th className="px-4 py-2">Title</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.length === 0 && !loading && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-4 text-center text-gray-400"
                      >
                        No tickets found.
                      </td>
                    </tr>
                  )}

                  {filteredTickets.map((t) => (
                    <tr
                      key={t.id}
                      onClick={() => selectTicket(t.id)}
                      className={`cursor-pointer border-b border-slate-800 hover:bg-slate-800/60 ${
                        selectedTicketId === t.id ? "bg-slate-800/80" : ""
                      }`}
                    >
                      <td className="px-4 py-2">{t.id}</td>
                      <td className="px-4 py-2">
                        {t.title || "(no title)"}
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            t.status === "Open"
                              ? "bg-green-600/20 text-green-400"
                              : t.status === "Pending"
                              ? "bg-yellow-500/20 text-yellow-300"
                              : "bg-gray-500/30 text-gray-200"
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-gray-400">
                        {t.created_at
                          ? new Date(t.created_at).toLocaleString()
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* DETAILS + CHAT */}
          <div className="bg-slate-900/80 rounded-xl border border-slate-800 flex flex-col">
            <div className="px-4 py-3 border-b border-slate-800">
              <span className="font-semibold text-sm">
                {selectedTicket
                  ? `Ticket #${selectedTicket.id}`
                  : "Select a ticket to view details"}
              </span>
            </div>

            {selectedTicket ? (
              <div className="flex-1 flex flex-col">
                {/* Ticket Info */}
                <div className="px-4 py-3 border-b border-slate-800 text-sm">
                  <p className="font-semibold mb-1">
                    {selectedTicket.title || "(no title)"}
                  </p>
                  <p className="text-gray-300 mb-2">
                    {selectedTicket.description || "No description"}
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-300">
                    <span>
                      Status:{" "}
                      <strong className="text-white">
                        {selectedTicket.status}
                      </strong>
                    </span>
                    {selectedTicket.created_at && (
                      <span>
                        Created:{" "}
                        {new Date(
                          selectedTicket.created_at
                        ).toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Status buttons */}
                  <div className="mt-3 flex gap-2">
                    {["Open", "Pending", "Closed"].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => handleStatusChange(s)}
                        disabled={updatingStatus}
                        className={`px-3 py-1 rounded-full text-xs border ${
                          selectedTicket.status === s
                            ? "bg-red-600 border-red-600 text-white"
                            : "border-slate-600 text-gray-200 hover:bg-slate-800"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 text-sm">
                  {messages.length === 0 && (
                    <p className="text-gray-400 text-xs">
                      No messages yet. Start the conversation below.
                    </p>
                  )}

                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`max-w-[80%] px-3 py-2 rounded-lg ${
                        m.sender === "admin"
                          ? "bg-red-600/80 ml-auto text-white"
                          : "bg-slate-800/80 text-gray-100"
                      }`}
                    >
                      <div className="text-[10px] uppercase opacity-70 mb-1">
                        {m.sender === "admin" ? "Admin" : "User"}
                      </div>
                      <div>{m.message}</div>
                      {m.created_at && (
                        <div className="text-[10px] opacity-60 mt-1">
                          {new Date(m.created_at).toLocaleString()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Send box */}
                <form
                  onSubmit={handleSendMessage}
                  className="border-t border-slate-800 p-3 flex gap-2"
                >
                  <textarea
                    rows={2}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type a reply..."
                    className="flex-1 bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm resize-none"
                  />
                  <button
                    type="submit"
                    disabled={sending || !messageText.trim()}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-900 rounded text-sm font-semibold"
                  >
                    {sending ? "Sending..." : "Send"}
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-sm text-gray-400">
                Select a ticket on the left to view details and chat.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
