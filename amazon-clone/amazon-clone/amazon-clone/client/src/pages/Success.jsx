import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Success() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};
  const { orderId = "OD" + Date.now() + Math.floor(Math.random() * 1000), orderData = {} } = state;
  const emailStatus = state.emailStatus;

  const currentDate = new Date();
  const estimatedDelivery = new Date(currentDate);
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);

  const formatDate = (date) => {
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <div className="success-page-wrap">
      <Navbar />

      <main className="success-container">
        <div className="success-card">
          <div className="success-icon">✓</div>

          <h1>Order Placed Successfully!</h1>

          <p className="success-message">
            Thank you for your order. We're processing it right now.
          </p>

          <div className="order-confirmation">
            <div className="confirmation-row">
              <span className="label">Order ID</span>
              <strong className="order-id">{orderId}</strong>
            </div>

            <div className="confirmation-row">
              <span className="label">Ordered on</span>
              <span>{formatDate(currentDate)}</span>
            </div>

            <div className="confirmation-row">
              <span className="label">Estimated Delivery</span>
              <span>{formatDate(estimatedDelivery)}</span>
            </div>

            {(orderData.fullName || orderData.shippingAddress || orderData.address) && (
              <div className="confirmation-row">
                <span className="label">Delivery Address</span>
                <span>
                  {orderData.shippingAddress || orderData.address || `${orderData.addressLine || ""}, ${orderData.city || ""}, ${orderData.state || ""} - ${orderData.zipCode || ""}`}
                </span>
              </div>
            )}

            {orderData.items && orderData.items.length > 0 && (
              <div className="order-items-summary">
                <h3>Items Ordered</h3>
                {orderData.items.map((item) => (
                  <div key={item.id} className="summary-item">
                    <p>{item.name}</p>
                    <p className="item-qty">Qty: {item.qty}</p>
                  </div>
                ))}
              </div>
            )}

            {orderData.total !== undefined && (
              <div className="order-total-summary">
                <strong>Order Total: ₹{orderData.total}</strong>
              </div>
            )}
          </div>

          <div className="success-actions">
            <button type="button" className="success-btn-primary" onClick={() => navigate("/")}>
              Continue Shopping
            </button>

            <button
              type="button"
              className="success-btn-secondary"
              onClick={() => navigate("/track-order", { state: { orderId, orderData, currentDate: currentDate.toISOString() } })}
            >
              Track Order
            </button>
          </div>

          <p className="success-footer">
            A confirmation email has been sent to <strong>{orderData.email || orderData.userEmail || "your email"}</strong>
          </p>

          {emailStatus && (
            <p className="success-footer" style={{ marginTop: "8px" }}>
              Email status: <strong>{emailStatus.success ? "Sent" : "Queued"}</strong>
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

export default Success;