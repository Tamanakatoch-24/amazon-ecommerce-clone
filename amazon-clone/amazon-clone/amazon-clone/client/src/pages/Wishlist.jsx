import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { WishlistContext } from "../context/WishlistContext";
import { CartContext } from "../context/CartContext";

function Wishlist() {
    const navigate = useNavigate();
    const { wishlist, removeFromWishlist } = useContext(WishlistContext);
    const { addToCart } = useContext(CartContext);

    return (
        <div className="wishlist-page-wrap">
            <Navbar />
            <main className="wishlist-shell">
                <section className="wishlist-card">
                    <h1>Your Wishlist</h1>
                    <p className="wishlist-sub">{wishlist.length} items</p>

                    {wishlist.length === 0 ? (
                        <p className="wishlist-empty">Your wishlist is empty.</p>
                    ) : (
                        <div className="wishlist-grid">
                            {wishlist.map((item) => (
                                <article key={item.id} className="wishlist-item">
                                    <img src={item.images?.[0]} alt={item.name} onClick={() => navigate(`/product/${item.id}`)} />
                                    <h3 onClick={() => navigate(`/product/${item.id}`)}>{item.name}</h3>
                                    <p>₹{item.price}</p>
                                    <div className="wishlist-actions">
                                        <button type="button" onClick={() => addToCart(item)}>Add to Cart</button>
                                        <button type="button" onClick={() => removeFromWishlist(item.id)}>Remove</button>
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

export default Wishlist;
