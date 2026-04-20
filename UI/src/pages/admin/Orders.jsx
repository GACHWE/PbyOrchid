import React, { useState, useEffect, useCallback } from "react";
import {
  getAllOrders,
  confirmOrder,
  deliverOrder,
  cancelOrder,
} from "../../api/orders";
import { showToast } from "../../utils/toast";   // ← updated import
import { RefreshCw } from "lucide-react";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastFetched, setLastFetched] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      const data = await getAllOrders(0, 50, "createdAt,desc");
      setOrders(data.content);
      setLastFetched(new Date());
    } catch (err) {
      console.error(err);
      showToast("Failed to fetch orders", "error");   // ← updated
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 50000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const handleConfirm = async (orderId) => {
    try {
      await confirmOrder(orderId);
      showToast("Order confirmed, stock deducted", "success");   // ← updated
      fetchOrders();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleDeliver = async (orderId) => {
    try {
      await deliverOrder(orderId);
      showToast("Order marked as delivered", "success");
      fetchOrders();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleCancel = async (orderId) => {
    if (window.confirm("Cancel this order?")) {
      try {
        await cancelOrder(orderId);
        showToast("Order cancelled", "success");
        fetchOrders();
      } catch (err) {
        showToast(err.message, "error");
      }
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      PENDING: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
      CONFIRMED: "bg-blue-500/20 text-blue-500 border-blue-500/30",
      DELIVERED: "bg-green-500/20 text-green-500 border-green-500/30",
      CANCELLED: "bg-red-500/20 text-red-500 border-red-500/30",
    };
    return `px-3 py-1 rounded-full text-xs font-bold border ${styles[status] || styles.PENDING}`;
  };

  if (loading) return <div className="p-8 text-center">Loading orders...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-black italic">Order Management</h1>
        <button
          onClick={fetchOrders}
          className="btn-outline flex items-center gap-2"
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>
      {lastFetched && (
        <p className="text-xs text-app-text-muted mb-4">
          Last updated: {lastFetched.toLocaleTimeString()}
        </p>
      )}
      <div className="overflow-x-auto">
        <table className="w-full bg-app-card border border-app-border rounded-2xl">
          <thead className="border-b border-app-border">
            <tr className="text-left text-xs font-bold uppercase tracking-widest">
              <th className="p-4">Order ID</th>
              <th className="p-4">Buyer ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">WhatsApp</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
              <th className="p-4">Created</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-app-border/50 hover:bg-app-bg/20"
              >
                <td className="p-4 font-mono text-xs">
                  {order.id.slice(0, 8)}...
                </td>
                <td className="p-4 font-mono text-xs">
                  {order.buyerId?.slice(0, 8)}...
                </td>
                <td className="p-4">{order.recipientName || "—"}</td>
                <td className="p-4">{order.whatsappNumber || "—"}</td>
                <td className="p-4 font-bold">${order.totalAmount}</td>
                <td className="p-4">
                  <span className={getStatusBadge(order.status)}>
                    {order.status}
                  </span>
                </td>
                <td className="p-4 text-sm">
                  {new Date(order.createdAt).toLocaleString()}
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    {order.status === "PENDING" && (
                      <button
                        onClick={() => handleConfirm(order.id)}
                        className="btn-primary py-1 px-3 text-xs"
                      >
                        Confirm
                      </button>
                    )}
                    {order.status === "CONFIRMED" && (
                      <button
                        onClick={() => handleDeliver(order.id)}
                        className="btn-primary py-1 px-3 text-xs"
                      >
                        Deliver
                      </button>
                    )}
                    {(order.status === "PENDING" ||
                      order.status === "CONFIRMED") && (
                      <button
                        onClick={() => handleCancel(order.id)}
                        className="btn-outline py-1 px-3 text-xs border-red-500 text-red-500"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}