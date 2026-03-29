import { useContext, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { products } from "../data/products";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import Navbar from "../components/Navbar";

function ProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const product = products.find((p) => p.id == id);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [qty, setQty] = useState(1);

  const { addToCart } = useContext(CartContext);
  const { isInWishlist, toggleWishlist } = useContext(WishlistContext);
  const inWishlist = product ? isInWishlist(product.id) : false;

  const fallbackImage =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='720' height='720'%3E%3Crect fill='%23eceff1' width='720' height='720'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='26' fill='%23333'%3EImage unavailable%3C/text%3E%3C/svg%3E";

  const galleryImages = useMemo(() => {
    if (!product) {
      return [];
    }

    const base = product.images && product.images.length ? product.images : [fallbackImage];
    return [...base, ...base, ...base].slice(0, 8);
  }, [product]);

  const highlights = useMemo(() => {
    if (!product?.description) {
      return [];
    }

    return String(product.description)
      .split("|")
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(0, 6);
  }, [product]);

  const technicalInfo = [
    { label: "Material type", value: product?.category === "fashion" ? "Mesh, Suede" : "Mixed" },
    { label: "Closure type", value: "Pull-On" },
    { label: "Heel type", value: "No Heel" },
    { label: "Water resistance level", value: "Not Water Resistant" },
    { label: "Sole material", value: "Rubber" },
    { label: "Style", value: product?.category ? product.category.charAt(0).toUpperCase() + product.category.slice(1) : "Casual" },
    { label: "Country of Origin", value: "India" }
  ];

  if (!product) {
    return (
      <div className="pd-page-wrap">
        <Navbar />
        <main className="pd-main-shell" style={{ padding: "20px" }}>
          <h2>Product not found</h2>
          <button type="button" onClick={() => navigate("/")}>Go back home</button>
        </main>
      </div>
    );
  }

  const currentImage = galleryImages[selectedImageIndex] || fallbackImage;

  const onAddToCart = () => {
    for (let i = 0; i < qty; i += 1) {
      addToCart(product);
    }
  };

  return (
    <div className="pd-page-wrap">
      <Navbar />

      <div className="pd-fashion-strip">
        <strong>Amazon Fashion</strong>
        <span>Women</span>
        <span>Men</span>
        <span>Kids</span>
        <span>Bags & Luggage</span>
        <span>Sportswear</span>
        <span>Sales & Deals</span>
      </div>

      <main className="pd-main-shell">
        <div className="pd-breadcrumbs">
          Shoes & Handbags &gt; Shoes &gt; Women&apos;s Shoes &gt; Casual Shoes &gt; Sneakers
        </div>

        <section className="pd-layout">
          <div className="pd-gallery-col">
            <div className="pd-thumbs">
              {galleryImages.map((img, index) => (
                <button
                  key={`${product.id}-thumb-${index}`}
                  type="button"
                  className={index === selectedImageIndex ? "pd-thumb is-active" : "pd-thumb"}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img
                    src={img}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = fallbackImage;
                    }}
                  />
                </button>
              ))}
            </div>

            <div className="pd-main-image-wrap">
              <img
                src={currentImage}
                alt={product.name}
                className="pd-main-image"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = fallbackImage;
                }}
              />
            </div>
          </div>

          <div className="pd-center-col">
            <a href="#" className="pd-store-link">Visit the Skechers Store</a>
            <h1>{product.name}</h1>

            <div className="pd-rating-row">
              <span>4.3</span>
              <span className="pd-stars">★★★★★</span>
              <a href="#">(1,297)</a>
            </div>

            <p className="pd-bought-note">100+ bought in past month</p>

            <div className="pd-price-block">
              <p className="pd-price-row">
                <span className="pd-discount">-39%</span>
                <strong>₹{product.price}</strong>
              </p>
              <p className="pd-mrp">M.R.P.: <span>₹{Math.max(product.price * 1.6, product.price + 20).toFixed(0)}</span></p>
              <p className="pd-tax">Inclusive of all taxes</p>
              <p className="pd-emi">EMI starts at ₹119. No Cost EMI available <a href="#">EMI options</a></p>
            </div>

            <section className="pd-offers">
              <h3>Offers</h3>
              <div className="pd-offer-cards">
                <article>
                  <strong>Cashback</strong>
                  <p>Upto ₹73.00 cashback as Amazon Pay Balance when...</p>
                  <a href="#">1 offer</a>
                </article>
                <article>
                  <strong>No Cost EMI</strong>
                  <p>Upto ₹79.43 EMI interest savings on Amazon Pay ICICI...</p>
                  <a href="#">2 offers</a>
                </article>
                <article>
                  <strong>Bank Offer</strong>
                  <p>Upto ₹1,000.00 discount on select Credit Cards</p>
                  <a href="#">25 offers</a>
                </article>
              </div>
            </section>

            <section className="pd-details-block">
              <h2>Product details</h2>
              <h3>Top highlights</h3>

              <div className="pd-tech-table">
                {technicalInfo.map((row) => (
                  <div key={row.label} className="pd-tech-row">
                    <strong>{row.label}</strong>
                    <span>{row.value}</span>
                  </div>
                ))}
              </div>

              <h3>About this item</h3>
              <ul>
                {highlights.slice(0, 5).map((item, index) => (
                  <li key={`${product.id}-hl-${index}`}>{item}</li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="pd-buy-col">
            <p className="pd-buy-price">₹{product.price}<span>00</span></p>
            <p className="pd-delivery">Delivering to Mohali 160062 - <a href="#">Update location</a></p>
            <p className="pd-stock">In stock</p>

            <label className="pd-qty-label">
              Quantity:
              <select value={qty} onChange={(e) => setQty(Number(e.target.value))}>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
              </select>
            </label>

            <button type="button" className="pd-add-cart-btn" onClick={onAddToCart}>
              Add to cart
            </button>
            <button type="button" className="pd-buy-now-btn" onClick={() => navigate("/checkout")}>
              Buy Now
            </button>

            <label className="pd-gift-line">
              <input type="checkbox" /> Add gift options
            </label>

            <button
              type="button"
              className={`pd-wish-btn ${inWishlist ? "is-wishlisted" : ""}`}
              onClick={() => toggleWishlist(product)}
            >
              {inWishlist ? "✓ Added to Wish List" : "Add to Wish List"}
            </button>
          </aside>
        </section>
      </main>
    </div>
  );
}

export default ProductDetail;