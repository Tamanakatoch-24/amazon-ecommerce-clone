import { useState, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";
import { CartContext } from "../context/CartContext";
import Navbar from "../components/Navbar";
import AmazonFooter from "../components/AmazonFooter";

function Home() {
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const fallbackImage =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23eceff1' width='300' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='16' fill='%23333'%3EImage unavailable%3C/text%3E%3C/svg%3E";

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const heroImage = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1400&q=80";

  const categoryOptions = useMemo(() => {
    return [...new Set(products
      .map((p) => String(p.category || "").trim())
      .filter(Boolean))].sort((a, b) => a.localeCompare(b));
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const selectedCategory = String(category || "all").toLowerCase().trim();

    return products.filter((p) => {
      const categoryName = String(p.category || "").trim();
      const productCategory = categoryName.toLowerCase();

      const searchable = [
        p.name,
        p.brand,
        p.category,
        p.categoryPath,
        p.asin
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesText = query.length === 0 || searchable.includes(query);
      const matchesCategory = selectedCategory === "all" || productCategory === selectedCategory;
      return matchesText && matchesCategory;
    });
  }, [search, category]);

  const promoSections = [
    {
      title: "Appliances for your home | Up to 55% off",
      cta: "See more",
      items: [
        { label: "Air conditioners", image: products[0]?.images[0] },
        { label: "Refrigerators", image: products[1]?.images[0] },
        { label: "Microwaves", image: products[2]?.images[0] },
        { label: "Washing machines", image: products[3]?.images[0] }
      ]
    },
    {
      title: "Revamp your home in style",
      cta: "Explore all",
      items: [
        { label: "Cushion covers, bedsheets & more", image: products[4]?.images[0] },
        { label: "Figurines, vases & more", image: products[5]?.images[0] },
        { label: "Home storage", image: products[3]?.images[0] },
        { label: "Lighting solutions", image: products[1]?.images[0] }
      ]
    },
    {
      title: "Starting ₹49 | Deals on home essentials",
      cta: "Explore all",
      items: [
        { label: "Cleaning supplies", image: products[2]?.images[0] },
        { label: "Bathroom accessories", image: products[0]?.images[0] },
        { label: "Home tools", image: products[5]?.images[0] },
        { label: "Wallpapers", image: products[4]?.images[0] }
      ]
    },
    {
      title: "Automotive essentials | Up to 60% off",
      cta: "See more",
      items: [
        { label: "Cleaning accessories", image: products[0]?.images[0] },
        { label: "Tyre & rim care", image: products[5]?.images[0] },
        { label: "Helmets", image: products[2]?.images[0] },
        { label: "Vacuum cleaner", image: products[1]?.images[0] }
      ]
    }
  ];

  const feedSource = filtered.slice(0, 128);
  const smallBusinessItems = filtered.slice(0, 7);

  const feedHeadings = [
    "Appliances for your home | Up to 55% off",
    "Revamp your home in style",
    "Starting ₹49 | Deals on home essentials",
    "Automotive essentials | Up to 60% off",
    "Min. 40% off | Bedroom furniture",
    "Up to 70% off | Everyday home value",
    "Top picks in kitchen and dining",
    "Fashion essentials for your family"
  ];

  const scrollRows = Array.from({ length: Math.max(1, Math.ceil(feedSource.length / 16)) }, (_, rowIndex) => {
    return Array.from({ length: 4 }, (_, colIndex) => {
      const baseIndex = rowIndex * 16 + colIndex * 4;
      const items = feedSource.slice(baseIndex, baseIndex + 4);

      return items.length > 0 ? {
        title: feedHeadings[(rowIndex * 4 + colIndex) % feedHeadings.length],
        cta: "See more",
        items: items.map((item) => ({
          label: item?.name || "Product",
          image: item?.images?.[0],
          id: item?.id
        }))
      } : null;
    }).filter(Boolean);
  }).filter(row => row.length > 0);

  return (
    <div className="home-page">
      <Navbar
        searchTerm={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search Amazon.in"
        selectedCategory={category}
        onCategoryChange={setCategory}
        categoryOptions={categoryOptions}
      />

      <section className="hero-banner">
        <button type="button" className="hero-arrow" aria-label="Previous offer">
          ❮
        </button>

        <div className="hero-content">
          <p>Starting ₹99</p>
          <h1>Bestselling mobile accessories</h1>
          <span>Wide Selection | Top Brands</span>
        </div>

        <img
          src={heroImage}
          alt="Hero Offer"
        />

        <button type="button" className="hero-arrow" aria-label="Next offer">
          ❯
        </button>
      </section>

      <section className="promo-grid">
        {promoSections.map((section) => (
          <article key={section.title} className="promo-tile">
            <h3>{section.title}</h3>

            <div className="promo-tile-grid">
              {section.items.map((item) => (
                <div key={`${section.title}-${item.label}`} className="promo-item">
                  <img
                    src={item.image}
                    alt={item.label}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = fallbackImage;
                    }}
                  />
                  <p>{item.label}</p>
                </div>
              ))}
            </div>

            <a href="#">{section.cta}</a>
          </article>
        ))}
      </section>

      <section className="home-scroll-feed">
        {scrollRows.map((row, rowIndex) => (
          <div key={`feed-row-${rowIndex}`} className="home-feed-row">
            {row.map((tile) => (
              <article key={`${rowIndex}-${tile.title}`} className="home-feed-tile">
                <h3>{tile.title}</h3>

                <div className="home-feed-grid">
                  {tile.items.map((item, itemIndex) => (
                    <button
                      key={`${tile.title}-${item.label}-${itemIndex}`}
                      type="button"
                      className="home-feed-item"
                      onClick={() => item.id && navigate(`/product/${item.id}`)}
                    >
                      <img
                        src={item.image}
                        alt={item.label}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = fallbackImage;
                        }}
                      />
                      <p>{item.label}</p>
                    </button>
                  ))}
                </div>

                <a href="#">{tile.cta}</a>
              </article>
            ))}
          </div>
        ))}
      </section>

      <section className="smallbiz-shell">
        <div className="smallbiz-card">
          <div className="smallbiz-head">
            <h2>Min.35% off | Best selling products from Small Businesses</h2>
            <a href="#">See more</a>
          </div>

          <div className="smallbiz-row">
            {smallBusinessItems.map((item) => (
              <article key={item.id} className="smallbiz-item" onClick={() => navigate(`/product/${item.id}`)}>
                <img
                  src={item.images?.[0]}
                  alt={item.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = fallbackImage;
                  }}
                />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-signin-strip">
        <div className="home-signin-card">
          <h3>See personalized recommendations</h3>
          <button type="button" onClick={() => navigate("/auth")}>Sign in</button>
          <p>
            New customer? <a href="#" onClick={(e) => { e.preventDefault(); navigate("/auth"); }}>Start here.</a>
          </p>
        </div>
      </section>

      <section className="products-shell" style={{ marginTop: "16px" }}>
        <div className="products-header">
          <h2>Products for you</h2>
          <small>{filtered.length} items</small>
        </div>

        <div className="grid">
          {filtered.slice(0, 8).map(p => (
            <ProductCard key={p.id} product={p} addToCart={addToCart} />
          ))}
        </div>
      </section>

      <AmazonFooter />
    </div>
  );
}

export default Home;