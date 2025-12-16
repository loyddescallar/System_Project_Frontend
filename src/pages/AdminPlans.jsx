import { useState } from "react";
import Navbar from "../components/Navbar";
import { PlusIcon, PencilSquareIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/solid";
import PlanModal from "../components/Plans/PlanModal";
import PlanForm from "../components/Plans/PlanForm";

export default function AdminPlans() {
  const [plans, setPlans] = useState([
    {
      id: 1,
      name: "Load 100",
      amount: 100,
      description: "Ideal for short-term entertainment.",
    },
    {
      id: 2,
      name: "Load 175",
      amount: 175,
      description: "More channels and longer validity.",
    },
  ]);

  const [search, setSearch] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [modalType, setModalType] = useState(null); // "view", "add", "edit", "delete"

  const filteredPlans = plans.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.amount.toString().includes(search)
  );

  const openModal = (type, plan = null) => {
    setModalType(type);
    setSelectedPlan(plan);
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedPlan(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-8 animate-slide-left">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold">Plan Management</h1>

          <button
            onClick={() => openModal("add")}
            className="flex items-center gap-2 bg-cignalRed px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            <PlusIcon className="h-5 w-5" />
            Add Plan
          </button>
        </div>

        {/* SEARCH BAR */}
        <input
          type="text"
          placeholder="Search plans by name or amount..."
          className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 outline-none focus:ring-2 focus:ring-red-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* TABLE */}
        <div className="overflow-x-auto mt-6">
          <table className="w-full text-left border-collapse bg-slate-900 rounded-lg overflow-hidden">
            <thead className="bg-slate-800 text-slate-300 uppercase text-xs">
              <tr>
                <th className="p-3">Plan Name</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Description</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredPlans.map((plan) => (
                <tr key={plan.id} className="border-b border-slate-700">
                  <td className="p-3">{plan.name}</td>
                  <td className="p-3">₱{plan.amount}</td>
                  <td className="p-3">{plan.description}</td>

                  <td className="p-3 flex items-center justify-center gap-3">
                    <button
                      className="text-blue-400 hover:text-blue-300"
                      onClick={() => openModal("view", plan)}
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>

                    <button
                      className="text-yellow-400 hover:text-yellow-300"
                      onClick={() => openModal("edit", plan)}
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>

                    <button
                      className="text-red-400 hover:text-red-300"
                      onClick={() => openModal("delete", plan)}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </main>

      {/* ALL MODALS */}
      <PlanModal
        type={modalType}
        plan={selectedPlan}
        onClose={closeModal}
        onSave={(savedPlan) => {
          if (modalType === "add") {
            setPlans([...plans, { id: Date.now(), ...savedPlan }]);
          } else if (modalType === "edit") {
            setPlans(plans.map((p) => (p.id === savedPlan.id ? savedPlan : p)));
          } else if (modalType === "delete") {
            setPlans(plans.filter((p) => p.id !== selectedPlan.id));
          }
          closeModal();
        }}
      />

    </div>
  );
}
