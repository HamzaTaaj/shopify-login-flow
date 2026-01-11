import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCustomerDashboard } from "./shopify";

type TabType = "profile" | "orders" | "addresses" | "settings";

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
      {/* SIDEBAR */}
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
          label="Settings"
          active={activeTab === "settings"}
          onClick={() => setActiveTab("settings")}
        />

        <button onClick={logout} className="mt-8 text-red-600 font-medium">
          Logout
        </button>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 p-8">
        {activeTab === "profile" && <ProfileTab customer={customer} />}
        {activeTab === "orders" && <OrdersTab orders={customer.orders.edges} />}
        {activeTab === "addresses" && <AddressesTab />}
        {activeTab === "settings" && <SettingsTab />}
      </main>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

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
                <strong>Order:</strong> {order.node.name}
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

function AddressesTab() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Addresses</h1>
      <p>Address management coming next…</p>
    </div>
  );
}

function SettingsTab() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Account Settings</h1>
      <p>Password & preferences settings</p>
    </div>
  );
}
