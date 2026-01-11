import { useState } from "react";
import { shopifyRegisterWithNotes } from "./shopify";

/* ---------------- TYPES ---------------- */

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  password: string; // ✅ REQUIRED FOR SHOPIFY
  company: string;
  location: string;
  machines: string;
  role: string;
  message: string;
};

/* ---------------- PAGE ---------------- */

export default function Register() {
  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    company: "",
    location: "",
    machines: "",
    role: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const update = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await shopifyRegisterWithNotes(form);
      setSuccess(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- SUCCESS STATE ---------------- */

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f9ff]">
        <div className="bg-white p-8 rounded-2xl shadow text-center max-w-md">
          <h2 className="text-2xl font-bold text-green-600">
            Request Submitted 🎉
          </h2>
          <p className="text-gray-600 mt-3">
            Your account has been created. Our team will contact you shortly.
          </p>
        </div>
      </div>
    );
  }

  /* ---------------- FORM ---------------- */

  return (
    <div className="min-h-screen bg-[#f5f9ff] flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white max-w-xl w-full p-8 rounded-2xl shadow"
      >
        <h2 className="text-xl font-semibold mb-4">Request Access</h2>

        {error && (
          <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name *"
            onChange={(v) => update("firstName", v)}
          />
          <Input label="Last Name *" onChange={(v) => update("lastName", v)} />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <Input
            label="Email *"
            type="email"
            onChange={(v) => update("email", v)}
          />
          <Input label="Company *" onChange={(v) => update("company", v)} />
        </div>

        {/* ✅ PASSWORD FIELD */}
        <Input
          label="Password *"
          type="password"
          className="mt-4"
          onChange={(v) => update("password", v)}
        />

        <Input
          label="Location"
          className="mt-4"
          onChange={(v) => update("location", v)}
        />

        <div className="grid grid-cols-2 gap-4 mt-4">
          <Input
            label="How many machines?"
            onChange={(v) => update("machines", v)}
          />
          <Select onChange={(v) => update("role", v)} />
        </div>

        <Textarea
          label="Anything else you'd like us to know?"
          className="mt-4"
          onChange={(v) => update("message", v)}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-60"
        >
          {loading ? "Submitting..." : "Send Request"}
        </button>
      </form>
    </div>
  );
}

/* ---------------- UI COMPONENTS ---------------- */

function Input({
  label,
  onChange,
  className = "",
  type = "text",
}: {
  label: string;
  onChange: (v: string) => void;
  className?: string;
  type?: string;
}) {
  return (
    <div className={className}>
      <label className="text-sm font-medium">{label}</label>
      <input
        type={type}
        className="w-full mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => onChange(e.target.value)}
        required={label.includes("*")}
      />
    </div>
  );
}

function Select({ onChange }: { onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-sm font-medium">I am a…</label>
      <select
        className="w-full mt-1 border rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500"
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select an option</option>
        <option value="Business Owner">Business Owner</option>
        <option value="Operations Manager">Operations Manager</option>
        <option value="Distributor">Distributor</option>
      </select>
    </div>
  );
}

function Textarea({
  label,
  onChange,
  className = "",
}: {
  label: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="text-sm font-medium">{label}</label>
      <textarea
        rows={4}
        className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
