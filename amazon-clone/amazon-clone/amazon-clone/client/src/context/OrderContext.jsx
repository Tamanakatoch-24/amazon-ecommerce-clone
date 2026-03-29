import { createContext, useMemo, useState } from "react";

export const OrderContext = createContext();

const ORDER_STORAGE_KEY = "amazon_clone_orders";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function OrderProvider({ children }) {
    const [orders, setOrders] = useState(() => {
        try {
            const raw = localStorage.getItem(ORDER_STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    });

    const persist = (nextOrders) => {
        setOrders(nextOrders);
        localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(nextOrders));
    };

    const placeOrder = async ({ orderId, userEmail, userName, items, total, paymentMethod, shippingAddress }) => {
        const now = new Date().toISOString();
        const newOrder = {
            id: orderId || "OD" + Date.now() + Math.floor(Math.random() * 1000),
            userEmail: userEmail || "guest@amazon.in",
            userName: userName || "Guest",
            items: items || [],
            total: total || 0,
            paymentMethod: paymentMethod || "upi",
            shippingAddress: shippingAddress || "Not provided",
            status: "Ordered",
            createdAt: now,
            tracking: {
                orderedAt: now,
                shippedAt: null,
                outForDeliveryAt: null,
                deliveredAt: null
            }
        };

        const nextOrders = [newOrder, ...orders];
        persist(nextOrders);

        let emailResult = { success: false, message: "Notification service not reachable" };
        try {
            const response = await fetch(`${API_BASE_URL}/api/notifications/order`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    orderId: newOrder.id,
                    customerName: newOrder.userName,
                    customerEmail: newOrder.userEmail,
                    totalAmount: newOrder.total,
                    itemCount: newOrder.items.reduce((acc, item) => acc + (item.qty || 1), 0)
                })
            });

            const data = await response.json();
            emailResult = {
                success: Boolean(data?.success),
                message: data?.message || "Notification sent"
            };
        } catch {
            emailResult = { success: false, message: "Order saved, email will be retried later" };
        }

        return {
            order: newOrder,
            emailResult
        };
    };

    const getOrdersByUser = (email) => {
        const normalized = String(email || "").trim().toLowerCase();
        return orders.filter((order) => String(order.userEmail).toLowerCase() === normalized);
    };

    const value = useMemo(() => ({
        orders,
        placeOrder,
        getOrdersByUser
    }), [orders]);

    return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export default OrderProvider;
