import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCustomerDashboard } from "./shopify";

/* ---------------- TYPES ---------------- */

type TabType =
  | "profile"
  | "orders"
  | "addresses"
  | "settings"
  | "request-access";

/* ---------------- DASHBOARD ---------------- */

export default function Dashboard() {
  const [customer, setCustomer] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("customerAccessToken");

    if (!token) {
      navigate("/");
      return;
    }

    const loadCustomer = async () => {
      try {
        const data = await fetchCustomerDashboard(token);
        setCustomer(data);
      } catch {
        localStorage.removeItem("customerAccessToken");
        navigate("/");
      }
    };

    loadCustomer();
  }, []);

  const logout = () => {
    localStorage.removeItem("customerAccessToken");
    navigate("/");
  };

  if (!customer) {
    return <p className="text-center mt-20">Loading dashboard...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* ---------------- SIDEBAR ---------------- */}
      <aside className="w-64 bg-white border-r p-6">
        <h2 className="text-xl font-bold mb-6">My Account</h2>

        <SidebarItem
          label="Profile"
          active={activeTab === "profile"}
          onClick={() => setActiveTab("profile")}
        />

        <SidebarItem
          label="Orders"
          active={activeTab === "orders"}
          onClick={() => setActiveTab("orders")}
        />

        <SidebarItem
          label="Addresses"
          active={activeTab === "addresses"}
          onClick={() => setActiveTab("addresses")}
        />

        <SidebarItem
          label="Request Access"
          active={activeTab === "request-access"}
          onClick={() => setActiveTab("request-access")}
        />

        <SidebarItem
          label="Settings"
          active={activeTab === "settings"}
          onClick={() => setActiveTab("settings")}
        />

        <button onClick={logout} className="mt-8 text-red-600 font-medium">
          Logout
        </button>
      </aside>

      {/* ---------------- CONTENT ---------------- */}
      <main className="flex-1 p-8">
        {activeTab === "profile" && <ProfileTab customer={customer} />}
        {activeTab === "orders" && <OrdersTab orders={customer.orders.edges} />}
        {activeTab === "addresses" && <AddressesTab />}
        {activeTab === "request-access" && (
          <RequestAccessTab customer={customer} />
        )}
        {activeTab === "settings" && <SettingsTab />}
      </main>
    </div>
  );
}

/* ---------------- SIDEBAR ITEM ---------------- */

function SidebarItem({ label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded mb-2 ${
        active ? "bg-purple-600 text-white" : "hover:bg-gray-100"
      }`}
    >
      {label}
    </button>
  );
}

/* ---------------- PROFILE ---------------- */

function ProfileTab({ customer }: any) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <p>
        <strong>Name:</strong> {customer.firstName} {customer.lastName}
      </p>
      <p>
        <strong>Email:</strong> {customer.email}
      </p>
    </div>
  );
}

/* ---------------- ORDERS ---------------- */

function OrdersTab({ orders }: any) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Order History</h1>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <div key={order.node.id} className="bg-white p-4 rounded shadow">
              <p>
                <strong>Order:</strong> {order.node.orderNumber}
              </p>
              <p>
                <strong>Total:</strong> {order.node.totalPrice.amount}{" "}
                {order.node.totalPrice.currencyCode}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(order.node.processedAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- ADDRESSES ---------------- */

function AddressesTab() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Addresses</h1>
      <p>Address management coming soon…</p>
    </div>
  );
}

/* ---------------- REQUEST ACCESS ---------------- */

function RequestAccessTab({ customer }: any) {
  const [form, setForm] = useState({
    company: "",
    location: "",
    machines: "",
    role: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitRequest = async () => {
    setLoading(true);
    setSuccess("");

    try {
      await fetch("/.netlify/functions/request-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: customer.email,
          form,
        }),
      });

      setSuccess(
        "Your request has been submitted. We will review and notify you."
      );
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Request Access</h1>

      <Input label="Company" name="company" onChange={handleChange} />
      <Input label="Location" name="location" onChange={handleChange} />
      <Input
        label="How many machines?"
        name="machines"
        onChange={handleChange}
      />
      <Input label="Role" name="role" onChange={handleChange} />

      <textarea
        name="message"
        placeholder="Anything else you'd like us to know?"
        className="w-full border rounded px-3 py-2 mb-4"
        onChange={handleChange}
      />

      <button
        onClick={submitRequest}
        disabled={loading}
        className="bg-purple-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Submitting..." : "Send Request"}
      </button>

      {success && <p className="text-green-600 mt-4">{success}</p>}
    </div>
  );
}

/* ---------------- SETTINGS ---------------- */

function SettingsTab() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Account Settings</h1>
      <p>Password & preferences settings</p>
    </div>
  );
}

/* ---------------- INPUT ---------------- */

function Input({ label, ...props }: any) {
  return (
    <div className="mb-3">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input {...props} className="w-full border rounded px-3 py-2" />
    </div>
  );
}
