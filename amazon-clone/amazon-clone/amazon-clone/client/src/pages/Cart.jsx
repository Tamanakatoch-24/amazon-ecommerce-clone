import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import Navbar from "../components/Navbar";
import { products } from "../data/products";

function Cart() {
  const { cart, addToCart, removeFromCart, updateQty } = useContext(CartContext);
  const navigate = useNavigate();

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);

  const fallbackImage =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Crect fill='%23eceff1' width='220' height='220'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='14' fill='%23333'%3EImage unavailable%3C/text%3E%3C/svg%3E";

  const relatedItems = products.filter((p) => !cart.some((c) => c.id === p.id)).slice(0, 6);

  const formatPrice = (value) =>
    new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0
    }).format(value);

  const onDecrease = (item) => {
    const nextQty = item.qty - 1;
    if (nextQty <= 0) {
      removeFromCart(item.id);
      return;
    }
    updateQty(item.id, nextQty);
  };

  const onIncrease = (item) => {
    updateQty(item.id, item.qty + 1);
  };

  return (
    <div className="cart-page-wrap">
      <Navbar />

      <main className="cart-layout">
        <section className="cart-main-panel">
          <header className="cart-main-header">
            <h1>Shopping Cart</h1>
            <span>Price</span>
          </header>

          {cart.length === 0 ? (
            <div className="cart-empty">Your Amazon Cart is empty.</div>
          ) : (
            <>
              {cart.map((item) => (
                <article key={item.id} className="cart-item-row">
                  <img
                    src={item.images?.[0]}
                    alt={item.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = fallbackImage;
                    }}
                  />

                  <div className="cart-item-info">
                    <h2>{item.name}</h2>
                    <p className="cart-item-stock">In stock</p>
                    <p className="cart-item-delivery">FREE delivery Tue, 31 Mar on first order</p>
                    <p className="cart-item-meta">Category: {item.category}</p>

                    <div className="cart-item-actions">
                      <div className="cart-qty-pill">
                        <button type="button" onClick={() => onDecrease(item)}>
                          −
                        </button>
                        <span>{item.qty}</span>
                        <button type="button" onClick={() => onIncrease(item)}>
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        className="cart-link-btn"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Delete
                      </button>

                      <button type="button" className="cart-link-btn" onClick={() => navigate("/")}>
                        See more like this
                      </button>
                    </div>
                  </div>

                  <p className="cart-item-price">₹{formatPrice(item.price * item.qty)}</p>
                </article>
              ))}

              <footer className="cart-main-subtotal">
                Subtotal ({totalItems} items): <strong>₹{formatPrice(subtotal)}</strong>
              </footer>
            </>
          )}
        </section>

        <aside className="cart-side-panel">
          <div className="cart-side-card">
            <p className="cart-delivery-note">Your order is eligible for FREE Delivery.</p>

            <p className="cart-side-subtotal">
              Subtotal ({totalItems} items): <strong>₹{formatPrice(subtotal)}</strong>
            </p>

            <p style={{ margin: "6px 0 0", fontSize: "13px", color: "#565959" }}>
              Shipping: <strong style={{ color: "#007600", fontWeight: "600" }}>FREE</strong>
            </p>

            <div style={{ borderTop: "1px solid #e7e7e7", marginTop: "12px", paddingTop: "12px" }}>
              <p style={{ margin: "0 0 4px 0", fontSize: "13px", fontWeight: "400", color: "#565959" }}>
                Total:
              </p>
              <p style={{ margin: "0", fontSize: "20px", fontWeight: "700" }}>
                ₹{formatPrice(subtotal)}
              </p>
            </div>

            <label className="cart-gift-line">
              <input type="checkbox" /> This order contains a gift
            </label>

            <button
              type="button"
              className="cart-proceed-btn"
              disabled={cart.length === 0}
              onClick={() => navigate("/checkout")}
            >
              Proceed to Buy
            </button>

            <button type="button" className="cart-emi-btn">
              EMI Available
            </button>
          </div>

          <div className="cart-side-card cart-reco-card">
            <h3>Customers who bought items in your cart also bought</h3>

            {relatedItems.map((item) => (
              <article key={item.id} className="cart-reco-item">
                <img
                  src={item.images?.[0]}
                  alt={item.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = fallbackImage;
                  }}
                />
                <div>
                  <p>{item.name}</p>
                  <strong>₹{formatPrice(item.price)}</strong>
                  <button type="button" onClick={() => addToCart(item)}>
                    Add to cart
                  </button>
                </div>
              </article>
            ))}
          </div>
        </aside>
      </main>
    </div>
  );
}

export default Cart;