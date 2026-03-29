import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { OrderContext } from "../context/OrderContext";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

function PaymentProcessing() {
    const navigate = useNavigate();
    const location = useLocation();
    const { placeOrder } = useContext(OrderContext);
    const { clearCart } = useContext(CartContext);
    const { currentUser } = useContext(AuthContext);
    const [placing, setPlacing] = useState(false);

    const state = location.state || {};
    const orderId = state.orderId || "OD" + Date.now() + Math.floor(Math.random() * 1000);
    const orderData = state.orderData || {};

    const handleCompletePayment = async () => {
        if (placing) {
            return;
        }

        setPlacing(true);

        const placed = await placeOrder({
            orderId,
            userEmail: currentUser?.email || orderData.email,
            userName: currentUser?.name || orderData.name,
            items: orderData.items || [],
            total: orderData.total || 0,
            paymentMethod: orderData.paymentMethod,
            shippingAddress: orderData.address || orderData.shippingAddress
        });

        clearCart();

        navigate("/success", {
            state: {
                orderId: placed.order.id,
                orderData: {
                    ...orderData,
                    ...placed.order,
                    email: placed.order.userEmail,
                    name: placed.order.userName
                },
                emailStatus: placed.emailResult
            }
        });
    };

    return (
        <div className="pay-processing-wrap">
            <header className="pay-top-strip">
                <div className="pay-top-strip-inner">
                    <div className="pay-logo">amazon pay</div>
                </div>
            </header>

            <div className="pay-step-bar">
                <div className="pay-step-inner">
                    <div className="pay-brand">amazon.in</div>
                    <div className="pay-steps">SIGN IN</div>
                    <div className="pay-steps">DELIVERY & PAYMENT</div>
                    <div className="pay-steps">PLACE ORDER</div>
                    <div className="pay-steps active">COMPLETE PAYMENT</div>
                </div>
            </div>

            <main className="pay-main-card-wrap">
                <section className="pay-main-card">
                    <h1>Complete your payment</h1>

                    <div className="pay-icon-row">
                        <span className="pay-icon">Rs</span>
                        <span className="pay-arrow">{" >> "}</span>
                        <span className="pay-icon success">OK</span>
                    </div>

                    <div className="pay-instructions">
                        <div className="pay-line">
                            <span className="step-dot">1</span>
                            <p>
                                Go to Amazon mobile app or <strong>Click</strong> on the notification from the Amazon mobile app
                            </p>
                        </div>
                        <div className="pay-line">
                            <span className="step-dot">2</span>
                            <p>
                                <strong>Check</strong> pending transactions from the Amazon Pay page
                            </p>
                        </div>
                        <div className="pay-line">
                            <span className="step-dot complete">3</span>
                            <p>
                                <strong>Complete</strong> the payment by entering UPI PIN
                            </p>
                        </div>
                    </div>

                    <p className="pay-expire-text">This page will automatically expire in 10 mins</p>
                    <div className="pay-progress-line" />

                    <p className="pay-note">Please do not refresh the page or hit back button until the transaction is complete.</p>
                    <p className="pay-link-line">
                        Open this URL in Mobile browser if you did not get notification from Amazon Application
                    </p>

                    <button type="button" className="pay-complete-btn" onClick={handleCompletePayment} disabled={placing}>
                        {placing ? "Processing..." : "Complete Payment"}
                    </button>
                </section>
            </main>
        </div>
    );
}

export default PaymentProcessing;
