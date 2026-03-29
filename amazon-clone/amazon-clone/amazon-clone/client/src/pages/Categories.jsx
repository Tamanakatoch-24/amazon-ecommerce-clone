import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { products } from "../data/products";
import Navbar from "../components/Navbar";
import AmazonFooter from "../components/AmazonFooter";

function Categories() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [sortBy, setSortBy] = useState("relevance");
    const [page, setPage] = useState(1);

    const fallbackImage =
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23eceff1' width='300' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='16' fill='%23333'%3EImage unavailable%3C/text%3E%3C/svg%3E";

    const categoryOptions = useMemo(() => {
        return [...new Set(products
            .map((p) => String(p.category || "").trim())
            .filter(Boolean))].sort((a, b) => a.localeCompare(b));
    }, []);

    const filteredProducts = useMemo(() => {
        const query = search.trim().toLowerCase();
        const selectedCategory = String(category || "all").toLowerCase().trim();
        const parsedMin = minPrice === "" ? null : Number(minPrice);
        const parsedMax = maxPrice === "" ? null : Number(maxPrice);

        const base = products.filter((p) => {
            const productCategory = String(p.category || "").toLowerCase().trim();
            const searchable = [p.name, p.brand, p.category, p.categoryPath, p.asin]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            const price = Number(p.price || 0);
            const matchesText = query.length === 0 || searchable.includes(query);
            const matchesCategory = selectedCategory === "all" || productCategory === selectedCategory;
            const matchesMin = parsedMin === null || price >= parsedMin;
            const matchesMax = parsedMax === null || price <= parsedMax;

            return matchesText && matchesCategory && matchesMin && matchesMax;
        });

        if (sortBy === "price-low") {
            return [...base].sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
        }

        if (sortBy === "price-high") {
            return [...base].sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
        }

        if (sortBy === "name") {
            return [...base].sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")));
        }

        return base;
    }, [search, category, minPrice, maxPrice, sortBy]);

    const pageSize = 40;
    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
    const safePage = Math.min(page, totalPages);
    const pagedProducts = filteredProducts.slice((safePage - 1) * pageSize, safePage * pageSize);

    const groupedByCategory = useMemo(() => {
        const grouped = {};
        pagedProducts.forEach((product) => {
            const cat = String(product.category || "Uncategorized");
            if (!grouped[cat]) {
                grouped[cat] = [];
            }
            grouped[cat].push(product);
        });

        return Object.keys(grouped)
            .sort((a, b) => a.localeCompare(b))
            .map((cat) => ({ name: cat, products: grouped[cat] }));
    }, [pagedProducts]);

    const onChangeFilter = (setter) => (value) => {
        setter(value);
        setPage(1);
    };

    return (
        <div className="categories-page-wrap">
            <Navbar
                searchTerm={search}
                onSearchChange={onChangeFilter(setSearch)}
                selectedCategory={category}
                onCategoryChange={onChangeFilter(setCategory)}
                categoryOptions={categoryOptions}
                searchPlaceholder="Search by name, brand, category or ASIN"
            />

            <main className="categories-shell">
                <div className="categories-header">
                    <h1>Kaggle Dataset Products</h1>
                    <p>
                        Showing {filteredProducts.length} products from {products.length} total
                    </p>

                    <div className="categories-filters-row">
                        <label>
                            Min Price
                            <input
                                type="number"
                                min="0"
                                value={minPrice}
                                onChange={(e) => onChangeFilter(setMinPrice)(e.target.value)}
                                placeholder="0"
                            />
                        </label>

                        <label>
                            Max Price
                            <input
                                type="number"
                                min="0"
                                value={maxPrice}
                                onChange={(e) => onChangeFilter(setMaxPrice)(e.target.value)}
                                placeholder="1000"
                            />
                        </label>

                        <label>
                            Sort
                            <select value={sortBy} onChange={(e) => onChangeFilter(setSortBy)(e.target.value)}>
                                <option value="relevance">Relevance</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="name">Name: A to Z</option>
                            </select>
                        </label>
                    </div>
                </div>

                {groupedByCategory.map((section) => (
                    <section key={section.name} className="category-section">
                        <div className="category-header">
                            <h2>{section.name}</h2>
                            <small>{section.products.length} products on this page</small>
                        </div>

                        <div className="category-grid">
                            {section.products.map((product) => (
                                <article key={product.id} className="category-product-card">
                                    <div className="category-product-image">
                                        <img
                                            src={product.images?.[0] || fallbackImage}
                                            alt={product.name}
                                            onError={(e) => {
                                                e.currentTarget.onerror = null;
                                                e.currentTarget.src = fallbackImage;
                                            }}
                                        />
                                    </div>

                                    <div className="category-product-info">
                                        <h3 onClick={() => navigate(`/product/${product.id}`)} title="Open product details">
                                            {product.name}
                                        </h3>

                                        <p className="category-product-price">₹{Number(product.price || 0).toFixed(2)}</p>

                                        <div className="category-product-actions">
                                            <button
                                                type="button"
                                                className="category-view-btn"
                                                onClick={() => navigate(`/product/${product.id}`)}
                                            >
                                                View Details
                                            </button>

                                            <a
                                                className="category-link-btn"
                                                href={product.productUrl || `https://www.amazon.com/s?k=${encodeURIComponent(product.name)}`}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                Amazon Link
                                            </a>
                                        </div>

                                        <p className="category-product-link">{product.productUrl || "No direct URL"}</p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>
                ))}

                {filteredProducts.length === 0 && (
                    <section className="category-section">
                        <div className="categories-empty">No products found for current filters.</div>
                    </section>
                )}

                <div className="categories-pagination">
                    <button type="button" disabled={safePage <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                        Previous
                    </button>
                    <span>Page {safePage} of {totalPages}</span>
                    <button type="button" disabled={safePage >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
                        Next
                    </button>
                </div>
            </main>

            <AmazonFooter />
        </div>
    );
}

export default Categories;
