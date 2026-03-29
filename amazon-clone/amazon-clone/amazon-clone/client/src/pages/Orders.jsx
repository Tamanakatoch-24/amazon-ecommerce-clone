import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";
import { OrderContext } from "../context/OrderContext";

function Orders() {
    const navigate = useNavigate();
    const { currentUser } = useContext(AuthContext);
    const { getOrdersByUser } = useContext(OrderContext);

    if (!currentUser) {
        return (
            <div className="orders-page-wrap">
                <Navbar />
                <main className="orders-shell">
                    <section className="orders-card">
                        <h1>Your Orders</h1>
                        <p>Please sign in to view your order history.</p>
                        <button type="button" onClick={() => navigate("/auth")}>Sign in</button>
                    </section>
                </main>
            </div>
        );
    }

    const orders = getOrdersByUser(currentUser.email);

    return (
        <div className="orders-page-wrap">
            <Navbar />
            <main className="orders-shell">
                <section className="orders-card">
                    <h1>Your Orders</h1>
                    <p className="orders-sub">{orders.length} orders found</p>

                    {orders.length === 0 ? (
                        <p className="orders-empty">No orders yet. Start shopping to see your history.</p>
                    ) : (
                        <div className="orders-list">
                            {orders.map((order) => (
                                <article key={order.id} className="order-row">
                                    <div className="order-row-top">
                                        <div>
                                            <small>ORDER PLACED</small>
                                            <p>{new Date(order.createdAt).toLocaleDateString("en-IN")}</p>
                                        </div>
                                        <div>
                                            <small>TOTAL</small>
                                            <p>₹{order.total}</p>
                                        </div>
                                        <div>
                                            <small>SHIP TO</small>
                                            <p>{order.userName}</p>
                                        </div>
                                        <div>
                                            <small>ORDER #</small>
                                            <p>{order.id}</p>
                                        </div>
                                    </div>

                                    <div className="order-items-mini">
                                        {order.items.map((item) => (
                                            <div key={item.id} className="order-mini-item">
                                                <img src={item.images?.[0]} alt={item.name} />
                                                <div>
                                                    <h3>{item.name}</h3>
                                                    <p>Qty: {item.qty}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="order-row-actions">
                                        <button
                                            type="button"
                                            onClick={() => navigate("/track-order", { state: { orderId: order.id, orderData: order, currentDate: order.createdAt } })}
                                        >
                                            Track package
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default Orders;
