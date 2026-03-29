import { useLocation, useNavigate } from "react-router-dom";

function TrackOrder() {
    const location = useLocation();
    const navigate = useNavigate();

    const state = location.state || {};
    const orderId = state.orderId || "OD" + Date.now() + Math.floor(Math.random() * 1000);
    const orderData = state.orderData || {};
    const items = orderData.items || [];

    const orderedAt = state.currentDate ? new Date(state.currentDate) : new Date();
    const shippedAt = new Date(orderedAt);
    shippedAt.setDate(shippedAt.getDate() + 1);
    const outForDeliveryAt = new Date(orderedAt);
    outForDeliveryAt.setDate(outForDeliveryAt.getDate() + 2);
    const deliveredAt = new Date(orderedAt);
    deliveredAt.setDate(deliveredAt.getDate() + 3);

    const formatDate = (date) =>
        date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });

    const currentStep = 2;

    return (
        <div className="track-page-wrap">
            <header className="track-header">
                <div className="track-header-inner">
                    <h1>Your package</h1>
                    <button type="button" className="track-back-btn" onClick={() => navigate("/")}>
                        Continue shopping
                    </button>
                </div>
            </header>

            <main className="track-shell">
                <section className="track-main-card">
                    <div className="track-top-row">
                        <div>
                            <p className="track-small-label">ORDER PLACED</p>
                            <p className="track-main-value">{formatDate(orderedAt)}</p>
                        </div>
                        <div>
                            <p className="track-small-label">TOTAL</p>
                            <p className="track-main-value">Rs.{orderData.total || 0}</p>
                        </div>
                        <div>
                            <p className="track-small-label">SHIP TO</p>
                            <p className="track-main-value">{orderData.userName || orderData.name || "Customer"}</p>
                        </div>
                        <div>
                            <p className="track-small-label">ORDER #</p>
                            <p className="track-main-value">{orderId}</p>
                        </div>
                    </div>

                    <div className="track-progress-head">
                        <h2>Arriving {formatDate(deliveredAt)}</h2>
                        <p>Your package is on the way</p>
                    </div>

                    <div className="track-progress-bar">
                        <div className="track-step done">
                            <span className="track-dot" />
                            <strong>Ordered</strong>
                            <small>{formatDate(orderedAt)}</small>
                        </div>
                        <div className="track-step done">
                            <span className="track-dot" />
                            <strong>Shipped</strong>
                            <small>{formatDate(shippedAt)}</small>
                        </div>
                        <div className={"track-step " + (currentStep >= 2 ? "active" : "")}>
                            <span className="track-dot" />
                            <strong>Out for delivery</strong>
                            <small>{formatDate(outForDeliveryAt)}</small>
                        </div>
                        <div className="track-step">
                            <span className="track-dot" />
                            <strong>Delivered</strong>
                            <small>{formatDate(deliveredAt)}</small>
                        </div>
                    </div>

                    <div className="track-line-fill">
                        <span />
                    </div>

                    <div className="track-package-list">
                        {items.length > 0 ? (
                            items.map((item) => (
                                <article key={item.id} className="track-item">
                                    <div className="track-item-image">
                                        <img
                                            src={item.images?.[0]}
                                            alt={item.name}
                                            onError={(e) => {
                                                e.currentTarget.onerror = null;
                                                e.currentTarget.src =
                                                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96'%3E%3Crect fill='%23eceff1' width='96' height='96'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='10' fill='%23333'%3ENo image%3C/text%3E%3C/svg%3E";
                                            }}
                                        />
                                    </div>
                                    <div className="track-item-info">
                                        <h3>{item.name}</h3>
                                        <p>Qty: {item.qty}</p>
                                    </div>
                                </article>
                            ))
                        ) : (
                            <p className="track-empty">No items found for this order.</p>
                        )}
                    </div>

                    <div className="track-actions">
                        <button type="button" onClick={() => navigate("/")}>
                            Buy it again
                        </button>
                        <button type="button" onClick={() => navigate("/orders")}>
                            View order details
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default TrackOrder;
