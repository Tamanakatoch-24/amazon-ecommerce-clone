import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { WishlistContext } from "../context/WishlistContext";

function ProductCard({ product, addToCart }) {
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useContext(WishlistContext);
  const fallbackImage =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23eceff1' width='300' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='16' fill='%23333'%3EImage unavailable%3C/text%3E%3C/svg%3E";

  return (
    <div className="card">
      <img
        src={product.images[0]}
        alt={product.name}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = fallbackImage;
        }}
        onClick={() => navigate(`/product/${product.id}`)}
      />

      <h4 onClick={() => navigate(`/product/${product.id}`)}>
        {product.name}
      </h4>

      <small>{product.category}</small>
      <p>₹{product.price}</p>

      <button type="button" onClick={() => toggleWishlist(product)}>
        {isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
      </button>

      <button type="button" onClick={() => addToCart(product)}>
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;