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

    fetchCustomerDashboard(token)
      .then(setCustomer)
      .catch(() => {
        localStorage.removeItem("customerAccessToken");
        navigate("/");
      });
  }, []);

  const logout = () => {
    localStorage.removeItem("customerAccessToken");
    navigate("/");
  };

  if (!customer) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading your account…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* ---------------- SIDEBAR ---------------- */}
      <aside className="w-64 bg-white border-r px-4 py-6">
        <h2 className="text-xl font-semibold mb-8">My Account</h2>

        <NavItem
          label="Profile"
          tab="profile"
          activeTab={activeTab}
          setTab={setActiveTab}
        />
        <NavItem
          label="Orders"
          tab="orders"
          activeTab={activeTab}
          setTab={setActiveTab}
        />
        <NavItem
          label="Addresses"
          tab="addresses"
          activeTab={activeTab}
          setTab={setActiveTab}
        />
        <NavItem
          label="Request Access"
          tab="request-access"
          activeTab={activeTab}
          setTab={setActiveTab}
        />
        <NavItem
          label="Settings"
          tab="settings"
          activeTab={activeTab}
          setTab={setActiveTab}
        />

        <button
          onClick={logout}
          className="mt-10 text-sm text-red-600 hover:underline"
        >
          Log out
        </button>
      </aside>

      {/* ---------------- CONTENT ---------------- */}
      <main className="flex-1 p-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">
            Welcome, {customer.firstName}
          </h1>
          <p className="text-gray-500 text-sm">
            Manage your account and requests
          </p>
        </div>

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

/* ---------------- NAV ITEM ---------------- */

function NavItem({ label, tab, activeTab, setTab }: any) {
  const active = activeTab === tab;

  return (
    <button
      onClick={() => setTab(tab)}
      className={`w-full flex items-center px-3 py-2 rounded mb-1 text-sm transition
        ${
          active
            ? "bg-purple-50 text-purple-700 border-l-4 border-purple-600"
            : "text-gray-600 hover:bg-gray-100"
        }`}
    >
      {label}
    </button>
  );
}

/* ---------------- PROFILE ---------------- */

function ProfileTab({ customer }: any) {
  return (
    <Card>
      <h2 className="text-lg font-semibold mb-4">Profile</h2>
      <InfoRow
        label="Name"
        value={`${customer.firstName} ${customer.lastName}`}
      />
      <InfoRow label="Email" value={customer.email} />
    </Card>
  );
}

/* ---------------- ORDERS ---------------- */

function OrdersTab({ orders }: any) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Order History</h2>

      {orders.length === 0 ? (
        <Card>No orders found.</Card>
      ) : (
        orders.map((order: any) => (
          <Card key={order.node.id}>
            <InfoRow label="Order" value={order.node.orderNumber} />
            <InfoRow
              label="Total"
              value={`${order.node.totalPrice.amount} ${order.node.totalPrice.currencyCode}`}
            />
            <InfoRow
              label="Date"
              value={new Date(order.node.processedAt).toLocaleDateString()}
            />
          </Card>
        ))
      )}
    </div>
  );
}

/* ---------------- ADDRESSES ---------------- */

function AddressesTab() {
  return <Card>Address management coming soon.</Card>;
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

  const handleChange = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submitRequest = async () => {
    setLoading(true);
    setSuccess("");

    try {
      await fetch("/.netlify/functions/request-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: customer.email, form }),
      });

      setSuccess("Request submitted successfully.");
    } catch {
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h2 className="text-lg font-semibold mb-4">Request Access</h2>

      <Input label="Company" name="company" onChange={handleChange} />
      <Input label="Location" name="location" onChange={handleChange} />
      <Input label="Machines" name="machines" onChange={handleChange} />
      <Input label="Role" name="role" onChange={handleChange} />

      <textarea
        name="message"
        placeholder="Additional notes"
        className="w-full border rounded-lg px-3 py-2 mb-4"
        onChange={handleChange}
      />

      <button
        onClick={submitRequest}
        disabled={loading}
        className="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition"
      >
        {loading ? "Submitting…" : "Submit request"}
      </button>

      {success && <p className="text-green-600 mt-3">{success}</p>}
    </Card>
  );
}

/* ---------------- SETTINGS ---------------- */

function SettingsTab() {
  return <Card>Password & preferences coming soon.</Card>;
}

/* ---------------- UI HELPERS ---------------- */

function Card({ children }: any) {
  return <div className="bg-white rounded-xl shadow-sm p-6">{children}</div>;
}

function InfoRow({ label, value }: any) {
  return (
    <div className="flex justify-between text-sm mb-2">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function Input({ label, ...props }: any) {
  return (
    <div className="mb-3">
      <label className="block text-sm text-gray-600 mb-1">{label}</label>
      <input {...props} className="w-full border rounded-lg px-3 py-2" />
    </div>
  );
}
