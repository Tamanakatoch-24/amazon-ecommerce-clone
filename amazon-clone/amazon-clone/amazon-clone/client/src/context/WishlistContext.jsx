import { createContext, useMemo, useState } from "react";

export const WishlistContext = createContext();

const WISHLIST_STORAGE_KEY = "amazon_clone_wishlist";

function WishlistProvider({ children }) {
    const [wishlist, setWishlist] = useState(() => {
        try {
            const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    });

    const persist = (nextState) => {
        setWishlist(nextState);
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(nextState));
    };

    const isInWishlist = (productId) => wishlist.some((item) => item.id === productId);

    const addToWishlist = (product) => {
        if (isInWishlist(product.id)) {
            return;
        }
        persist([...wishlist, product]);
    };

    const removeFromWishlist = (productId) => {
        persist(wishlist.filter((item) => item.id !== productId));
    };

    const toggleWishlist = (product) => {
        if (isInWishlist(product.id)) {
            removeFromWishlist(product.id);
            return;
        }
        addToWishlist(product);
    };

    const value = useMemo(() => ({
        wishlist,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist
    }), [wishlist]);

    return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export default WishlistProvider;
