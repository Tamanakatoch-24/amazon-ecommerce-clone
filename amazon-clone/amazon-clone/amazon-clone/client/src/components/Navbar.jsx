import { Link } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";

function Navbar({
  searchTerm = "",
  onSearchChange,
  searchPlaceholder = "Search Amazon.in",
  selectedCategory = "all",
  onCategoryChange,
  categoryOptions = []
}) {
  const fallbackCategories = ["Electronics", "Fashion", "Home & Kitchen", "Mobiles"];
  const resolvedCategories = categoryOptions.length ? categoryOptions : fallbackCategories;

  const { cart } = useContext(CartContext);
  const { currentUser, logout } = useContext(AuthContext);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const closeAccountMenu = () => {
    setAccountMenuOpen(false);
  };

  const onMenuPlaceholderClick = (event) => {
    event.preventDefault();
    closeAccountMenu();
  };

  useEffect(() => {
    const onDocClick = (event) => {
      if (!menuRef.current) {
        return;
      }

      if (!menuRef.current.contains(event.target)) {
        setAccountMenuOpen(false);
      }
    };

    const onEscape = (event) => {
      if (event.key === "Escape") {
        setAccountMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEscape);

    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEscape);
    };
  }, []);

  return (
    <header className="amazon-header">
      <div className="header-main">
        <Link to="/" className="header-logo" aria-label="Amazon Home">
          amazon<span>.in</span>
        </Link>

        <div className="header-location">Delivering to Ludhiana 141008</div>

        <div className="header-search">
          <select
            aria-label="Search category"
            value={selectedCategory}
            onChange={(e) => onCategoryChange?.(e.target.value)}
          >
            <option value="all">All</option>
            {resolvedCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={searchTerm}
            placeholder={searchPlaceholder}
            onChange={(e) => onSearchChange?.(e.target.value)}
            aria-label="Search products"
          />

          <button type="button" aria-label="Search">
            🔍
          </button>
        </div>

        <div className="header-actions">
          <div className="header-action header-lang">🇮🇳 EN</div>

          <div className="header-account-wrap" ref={menuRef}>
            <button
              type="button"
              className="header-account-trigger"
              onClick={() => setAccountMenuOpen((prev) => !prev)}
            >
              <small>{currentUser ? `Hello, ${currentUser.name}` : "Hello, sign in"}</small>
              <strong>Account & Lists</strong>
            </button>

            {accountMenuOpen && (
              <>
                <div className="header-account-overlay" onClick={closeAccountMenu} />
                <div className="header-account-menu">
                  <div className="header-account-top">
                    <Link to="/auth" className="header-account-signin" onClick={closeAccountMenu}>
                      Sign in
                    </Link>
                    <p>
                      New customer? <Link to="/auth" onClick={closeAccountMenu}>Start here.</Link>
                    </p>
                  </div>

                  <div className="header-account-content">
                    <div className="header-account-col">
                      <h4>Your Lists</h4>
                      <Link to="/wishlist" onClick={closeAccountMenu}>Create a Wish List</Link>
                      <a href="#" onClick={onMenuPlaceholderClick}>Wish from Any Website</a>
                      <a href="#" onClick={onMenuPlaceholderClick}>Baby Wishlist</a>
                      <a href="#" onClick={onMenuPlaceholderClick}>Discover Your Style</a>
                      <a href="#" onClick={onMenuPlaceholderClick}>Explore Showroom</a>
                    </div>

                    <div className="header-account-col">
                      <h4>Your Account</h4>
                      <Link to="/auth" onClick={closeAccountMenu}>Your Account</Link>
                      <Link to="/orders" onClick={closeAccountMenu}>Your Orders</Link>
                      <Link to="/wishlist" onClick={closeAccountMenu}>Your Wish List</Link>
                      <a href="#" onClick={onMenuPlaceholderClick}>Keep shopping for</a>
                      <a href="#" onClick={onMenuPlaceholderClick}>Your Recommendations</a>
                      <a href="#" onClick={onMenuPlaceholderClick}>Your Prime Membership</a>
                      <a href="#" onClick={onMenuPlaceholderClick}>Your Prime Video</a>
                      <a href="#" onClick={onMenuPlaceholderClick}>Your Subscribe & Save Items</a>
                      <a href="#" onClick={onMenuPlaceholderClick}>Memberships & Subscriptions</a>
                      <a href="#" onClick={onMenuPlaceholderClick}>Your Seller Account</a>
                      <a href="#" onClick={onMenuPlaceholderClick}>Manage Your Content and Devices</a>
                      <a href="#" onClick={onMenuPlaceholderClick}>Register for a free Business Account</a>
                      {currentUser && (
                        <button type="button" className="header-menu-signout" onClick={() => { logout(); closeAccountMenu(); }}>
                          Sign Out
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <Link to="/orders" className="header-action" style={{ textDecoration: "none", color: "inherit" }}>
            <small>Returns</small>
            <strong>& Orders</strong>
          </Link>

          <Link to="/cart" className="header-cart">
            <span>Cart</span>
            <strong>{cart.length}</strong>
          </Link>
        </div>
      </div>

      <nav className="header-subnav" aria-label="Primary">
        <span>☰ All</span>
        <span>Fresh</span>
        <span>MX Player</span>
        <span>Sell</span>
        <span>Bestsellers</span>
        <span>Mobiles</span>
        <span>Today's Deals</span>
        <span>Customer Service</span>
        <span>Prime</span>
        <span>New Releases</span>
        <span>Fashion</span>
        <span>Electronics</span>
        <span>Amazon Pay</span>
        <span>Home & Kitchen</span>
        <span>Computers</span>
        <span>Toys & Games</span>
        <span>Books</span>
        <Link to="/categories" style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}>
          Browse All Categories
        </Link>
      </nav>
    </header>
  );
}

export default Navbar;