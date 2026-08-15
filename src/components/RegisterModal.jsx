import { useState } from "react";
import { X, CheckCircle2 } from "lucide-react";
import { api } from "../api";

export default function RegisterModal({ event, onClose }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", date: "", location: "" });
  const [state, setState] = useState({ loading: false, error: "", success: false });

  if (!event) return null;

  const submit = async (e) => {
    e.preventDefault();
    setState({ loading: true, error: "", success: false });
    try {
      await api.post("/registrations", { ...form, eventId: event._id });
      setState({ loading: false, error: "", success: true });
    } catch (err) {
      setState({
        loading: false,
        success: false,
        error: err.response?.data?.message || "Unable to register. Please try again.",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm" onMouseDown={onClose}>
      <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl" onMouseDown={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold text-orange-600">Register</p>
            <h3 className="mt-1 font-display text-3xl font-bold">{event.title}</h3>
          </div>
          <button onClick={onClose} className="rounded-full bg-black/5 p-2"><X size={18} /></button>
        </div>

        {state.success ? (
          <div className="py-12 text-center">
            <CheckCircle2 className="mx-auto text-green-600" size={52} />
            <h4 className="mt-4 text-xl font-bold">You're registered!</h4>
            <p className="mt-2 text-sm text-black/55">We'll send event details to your email.</p>
            <button onClick={onClose} className="mt-6 rounded-xl bg-ink px-6 py-3 font-semibold text-white">Done</button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-7 space-y-4">
            {state.error && <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{state.error}</div>}
            {[
              ["name", "Full name", "text"],
              ["email", "Email address", "email"],
              ["phone", "Phone number", "tel"],
              ["date", "Preferred date", "date"],
              ["location", "Location", "text"],
            ].map(([key, label, type]) => (
              <label key={key} className="block">
                <span className="mb-1.5 block text-sm font-medium">{label}</span>
                <input
                  required
                  type={type}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                />
              </label>
            ))}
            <button disabled={state.loading} className="w-full rounded-xl bg-orange-600 py-3.5 font-bold text-white disabled:opacity-60">
              {state.loading ? "Registering..." : "Confirm registration"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
