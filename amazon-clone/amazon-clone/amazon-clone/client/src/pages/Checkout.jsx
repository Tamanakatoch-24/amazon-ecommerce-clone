import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";

function Checkout() {
  const { cart } = useContext(CartContext);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [deliveryAddress] = useState({
    name: "Avi",
    address: "Chandigarh University, MOHALI, PUNJAB, 140308, India"
  });

  const [selectedPayment, setSelectedPayment] = useState("upi");

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const savings = Math.floor(subtotal * 0.15);
  const formatPrice = (value) =>
    new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value);

  const handleProceedToPayment = () => {
    if (!currentUser) {
      navigate("/auth");
      return;
    }

    const orderId = "OD" + Date.now() + Math.floor(Math.random() * 1000);
    navigate("/payment-processing", {
      state: {
        orderId,
        orderData: {
          ...deliveryAddress,
          email: currentUser.email,
          userName: currentUser.name,
          paymentMethod: selectedPayment,
          items: cart,
          total: subtotal
        },
        summary: {
          subtotal,
          savings
        }
      }
    });
  };

  if (cart.length === 0) {
    return (
      <div className="checkout-page-wrap">
        <Navbar />
        <main className="checkout-container">
          <div className="checkout-empty">
            <h2>Your cart is empty</h2>
            <button className="checkout-back-btn" onClick={() => navigate("/")}>
              Continue Shopping
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="checkout-sec-wrap">
      <div className="checkout-sec-header">
        <div className="sec-header-content">
          <h1>Secure checkout</h1>
          <span className="cart-icon">Cart</span>
        </div>
      </div>

      <main className="checkout-sec-container">
        <div className="checkout-sec-layout">
          <section className="checkout-sec-left">
            <div className="sec-section">
              <h2 className="sec-section-title">Delivering to {deliveryAddress.name}</h2>
              <p className="sec-address">{deliveryAddress.address}</p>
              <button type="button" className="sec-change-btn" onClick={() => { }}>
                Change
              </button>
              <a href="#" className="sec-add-instructions">
                Add delivery instructions
              </a>
            </div>

            <div className="sec-section">
              <h2 className="sec-section-title">Payment method</h2>

              <div className="payment-option">
                <label className="payment-radio">
                  <input type="radio" value="amazon-pay" checked={selectedPayment === "amazon-pay"} onChange={(e) => setSelectedPayment(e.target.value)} />
                  <span className="radio-label">Your available balance</span>
                </label>
                <p className="sec-info-text">Amazon Pay Balance Rs.0.00 Unavailable</p>
                <p className="sec-help-text">Insufficient balance. <a href="#">Add money & get rewarded</a></p>
              </div>

              <div className="payment-option">
                <label className="payment-radio">
                  <input type="radio" value="upi" checked={selectedPayment === "upi"} onChange={(e) => setSelectedPayment(e.target.value)} />
                  <span className="radio-label">UPI</span>
                </label>
                <p className="sec-sub-text">Punjab National Bank ...3777</p>
              </div>

              <h3 className="sec-sub-heading">Another payment method</h3>

              <div className="payment-option">
                <label className="payment-radio">
                  <input type="radio" value="card" checked={selectedPayment === "card"} onChange={(e) => setSelectedPayment(e.target.value)} />
                  <span className="radio-label">Credit or debit card</span>
                </label>
                <div className="card-logos">VISA | Mastercard | Amex | Diners | RuPay</div>
              </div>

              <div className="payment-option">
                <label className="payment-radio">
                  <input type="radio" value="netbanking" checked={selectedPayment === "netbanking"} onChange={(e) => setSelectedPayment(e.target.value)} />
                  <span className="radio-label">Net Banking</span>
                </label>
                <select className="sec-select">
                  <option>Choose an Option</option>
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>SBI</option>
                </select>
              </div>

              <div className="payment-option">
                <label className="payment-radio">
                  <input type="radio" value="scanpay" checked={selectedPayment === "scanpay"} onChange={(e) => setSelectedPayment(e.target.value)} />
                  <span className="radio-label">Scan and Pay with UPI</span>
                </label>
                <p className="sec-info-text">You will need to Scan the QR code on the payment page to complete the payment.</p>
              </div>

              <div className="payment-option">
                <label className="payment-radio">
                  <input type="radio" value="otheupi" checked={selectedPayment === "otheupi"} onChange={(e) => setSelectedPayment(e.target.value)} />
                  <span className="radio-label">Other UPI Apps</span>
                </label>
              </div>

              <div className="payment-option">
                <label className="payment-radio">
                  <input type="radio" value="emi" checked={selectedPayment === "emi"} onChange={(e) => setSelectedPayment(e.target.value)} />
                  <span className="radio-label">EMI</span>
                </label>
              </div>

              <div className="payment-option">
                <label className="payment-radio">
                  <input type="radio" value="cod" checked={selectedPayment === "cod"} onChange={(e) => setSelectedPayment(e.target.value)} />
                  <span className="radio-label">Cash on Delivery/Pay on Delivery</span>
                </label>
                <p className="sec-unavail-text">Unavailable for this payment</p>
              </div>
            </div>

            <div className="sec-section">
              <h2 className="sec-section-title">Review items and shipping</h2>
              <div className="sec-review-footer">
                <p className="sec-footer-text">Need help? Check our <a href="#">help pages</a> or <a href="#">contact us 24x7</a></p>
                <p className="sec-footer-note">When your order is placed, we'll send you an e-mail message acknowledging receipt of your order. If you choose to pay using an electronic payment method (credit card, debit card or net banking), you will be directed to your bank's website to complete the payment...</p>
                <a href="#" className="sec-return-policy">See Amazon.in's Return Policy.</a>
              </div>
              <button type="button" className="sec-back-to-cart" onClick={() => navigate("/cart")}>Back to cart</button>
            </div>
          </section>

          <aside className="checkout-sec-right">
            <button type="button" className="sec-use-payment-btn" onClick={handleProceedToPayment}>Use this payment method</button>

            <div className="sec-order-summary">
              <div className="summary-row"><span>Items:</span><span>--</span></div>
              <div className="summary-row"><span>Delivery:</span><span>--</span></div>
              <div className="summary-row"><span>Total:</span><span>--</span></div>
              <div className="summary-row savings"><span>Savings (2): <a href="#">^</a></span><span className="savings-amount">₹{formatPrice(savings)}</span></div>
              <div className="summary-row"><span>FREE Delivery</span><span>--</span></div>
              <a href="#" className="buy-more-link">Buy More Save More</a>
              <div className="summary-divider"></div>
              <h3 className="summary-total-label">Order Total:</h3>
              <p className="summary-total-amount">₹{formatPrice(subtotal)}</p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default Checkout;
