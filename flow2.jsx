// Flow 2 — Grocery shopping.
// Browse → product detail → cart → either book a delivery slot then checkout,
// or check out first and pick a slot afterwards.

const SHOP_CATEGORIES = [
  { id: "all",     label: "All",     emoji: "🥗" },
  { id: "fresh",   label: "Fresh",   emoji: "🥦" },
  { id: "meats",   label: "Meats",   emoji: "🥩" },
  { id: "bakery",  label: "Bakery",  emoji: "🍞" },
  { id: "grains",  label: "Grains",  emoji: "🌾" },
  { id: "organic", label: "Organic", emoji: "🌱" },
];

const SHOP_PRODUCTS = [
  { id: "p1", name: "Mixed Veg Basket", cat: "fresh",   price: 10.00, oldPrice: 11.50, rating: 4.8, time: "10 min", emoji: "🥬", desc: "Hand-picked seasonal vegetables — peppers, leafy greens, cucumbers, and herbs. Sourced from local farms within 50 miles." },
  { id: "p2", name: "Tender Steak",     cat: "meats",   price: 15.00, rating: 4.6, time: "12 min", emoji: "🥩", desc: "Premium aged cut from grass-fed cattle. Perfect for grilling or pan-searing." },
  { id: "p3", name: "Sourdough Loaf",   cat: "bakery",  price: 4.50,  rating: 4.9, time: "8 min",  emoji: "🍞", desc: "Stone-baked overnight, naturally leavened with a deep crust and tender crumb." },
  { id: "p4", name: "Heritage Grains",  cat: "grains",  price: 6.00,  rating: 4.7, time: "9 min",  emoji: "🌾", desc: "Whole-grain mix — farro, spelt, and pearl barley. Hearty and nutrient-dense." },
  { id: "p5", name: "Organic Greens",   cat: "organic", price: 7.50,  rating: 4.5, time: "10 min", emoji: "🥗", desc: "Certified organic salad mix — washed, ready to serve. Crisp, tender, never bitter." },
  { id: "p6", name: "Farm Eggs (12)",   cat: "fresh",   price: 5.00,  rating: 4.9, time: "8 min",  emoji: "🥚", desc: "Pasture-raised, dated this morning. Rich golden yolks." },
  { id: "p7", name: "Country Pâté",     cat: "meats",   price: 8.50,  rating: 4.4, time: "10 min", emoji: "🥓", desc: "House-made coarse pâté with thyme and brandy. Best served chilled with bread." },
  { id: "p8", name: "Wholegrain Roll",  cat: "bakery",  price: 2.25,  rating: 4.6, time: "8 min",  emoji: "🥖", desc: "Soft inside, seedy outside. Great for sandwiches." },
];

const SHOP_DELIVERY_FEE = 2.00;

const SHOP_ORDERS = [
  { id: "ORD-2401", date: "May 24, 2026", status: "Delivered", total: 24.50, items: 4 },
  { id: "ORD-2398", date: "May 17, 2026", status: "Delivered", total: 32.75, items: 6 },
  { id: "ORD-2395", date: "May 10, 2026", status: "Delivered", total: 18.00, items: 3 },
  { id: "ORD-2381", date: "Apr 28, 2026", status: "Delivered", total: 41.20, items: 7 },
];

const SHOP_WISHLIST_IDS = ["p1", "p3", "p6", "p5"];

const SHOP_PROFILE = {
  name: "Bukunmi Isijola",
  email: "isijolabukunmi@gmail.com",
  address: "Green Valley Point",
  joined: "Member since May 2025",
};

function shopCartLineItems(cart) {
  // turn { [id]: qty } into [{...product, qty}]
  return Object.entries(cart)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => {
      const p = SHOP_PRODUCTS.find((x) => x.id === id);
      return p ? { ...p, qty } : null;
    })
    .filter(Boolean);
}

function shopCartSubtotal(cart) {
  return shopCartLineItems(cart).reduce((sum, l) => sum + l.price * l.qty, 0);
}

function shopCartCount(cart) {
  return Object.values(cart).reduce((s, q) => s + q, 0);
}

/* ---- Shop Home (browse) ---------------------------------------- */
function ShopHome({ onOpenProduct }) {
  const [catId, setCatId] = useState("all");
  const filtered = catId === "all" ? SHOP_PRODUCTS : SHOP_PRODUCTS.filter((p) => p.cat === catId);

  return (
    <div className="screen">
      <StatusBar />
      <div className="screen-body shop-tab-body">
        <div style={{ marginBottom: 20 }}>
          <h2 className="h-section" style={{ margin: 0, fontSize: 32 }}>Your healthy market</h2>
          <p style={{ margin: "6px 0 0", fontFamily: "var(--font-body)", fontSize: 14, color: "var(--text-mid)" }}>
            Fresh groceries, delivered on your schedule.
          </p>
        </div>

        {/* Categories */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          {SHOP_CATEGORIES.map((c) =>
            <button key={c.id}
                    onClick={() => setCatId(c.id)}
                    className={"shop-cat-chip" + (c.id === catId ? " active" : "")}>
              <span style={{ fontSize: 16, lineHeight: 1 }}>{c.emoji}</span>
              <span>{c.label}</span>
            </button>
          )}
        </div>

        {/* Recommended for you */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
          <h3 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 20, color: "var(--green-deep)", fontWeight: 600 }}>
            Recommended for you
          </h3>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {filtered.map((p) =>
            <button key={p.id} className="shop-card" onClick={() => onOpenProduct(p.id)}>
              <div className="shop-card-thumb">
                <span style={{ fontSize: 44 }}>{p.emoji}</span>
                {p.oldPrice && <span className="shop-card-badge">SALE</span>}
              </div>
              <div className="shop-card-body">
                <div className="shop-card-name">{p.name}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--font-body)", fontSize: 12, color: "var(--text-mid)" }}>
                  <span style={{ color: "var(--green-deep)", fontWeight: 700 }}>★ {p.rating}</span>
                  <span>·</span>
                  <span>{p.time}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, color: "var(--green-deep)" }}>
                    ${p.price.toFixed(2)}
                  </span>
                  {p.oldPrice && (
                    <span style={{ fontSize: 12, color: "var(--text-soft)", textDecoration: "line-through" }}>
                      ${p.oldPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---- Shop Product Detail --------------------------------------- */
function ShopProduct({ productId, cart, onAdd, onBack, onOpenCart }) {
  const product = SHOP_PRODUCTS.find((p) => p.id === productId);
  const [qty, setQty] = useState(1);
  const count = shopCartCount(cart);

  if (!product) {
    return (
      <div className="screen">
        <StatusBar />
        <div className="screen-body" style={{ padding: 16 }}>
          <BtnSmall onClick={onBack} />
          <p style={{ marginTop: 24 }}>Product not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="screen">
      <StatusBar />
      <div className="screen-body" style={{ padding: "9px 16px 24px", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 18 }}>
          <BtnSmall onClick={onBack} />
          <button onClick={onOpenCart} aria-label="Open cart" className="cart-pill">
            <span style={{ fontSize: 16 }}>🛒</span>
            {count > 0 && <span className="cart-pill-count">{count}</span>}
          </button>
        </div>

        <div className="shop-hero">
          <span style={{ fontSize: 96 }}>{product.emoji}</span>
        </div>

        <h2 className="h-section" style={{ margin: "18px 0 0", fontSize: 28 }}>{product.name}</h2>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8, fontFamily: "var(--font-body)", fontSize: 13 }}>
          <span style={{ color: "var(--green-deep)", fontWeight: 700 }}>★ {product.rating}</span>
          <span style={{ color: "var(--text-mid)" }}>· Delivered in {product.time}</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14 }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 600, color: "var(--green-deep)" }}>
            ${product.price.toFixed(2)}
          </span>
          {product.oldPrice && (
            <span style={{ fontSize: 14, color: "var(--text-soft)", textDecoration: "line-through" }}>
              ${product.oldPrice.toFixed(2)}
            </span>
          )}
          {product.oldPrice && (
            <span style={{
              fontSize: 11, padding: "3px 8px", borderRadius: 999,
              background: "var(--lime)", color: "var(--green-deep)", fontWeight: 700, letterSpacing: 0.5
            }}>
              {Math.round((1 - product.price / product.oldPrice) * 100)}% off
            </span>
          )}
        </div>

        <div style={{ marginTop: 24 }}>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--green-deep)", fontWeight: 500, marginBottom: 6 }}>
            Description
          </div>
          <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: 14, color: "var(--text-dark)", lineHeight: 1.5 }}>
            {product.desc}
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 28 }}>
          <QtyStepper value={qty} onChange={setQty} />
          <BtnPrimary style={{ flex: 1 }} onClick={() => { onAdd(product.id, qty); onOpenCart(); }}>
            Add to Cart
          </BtnPrimary>
        </div>
      </div>
    </div>
  );
}

/* ---- Shop Cart ------------------------------------------------- */
function ShopCart({ cart, onChangeQty, onRemove, onBookSlot, onContinueShopping }) {
  const lines = shopCartLineItems(cart);
  const subtotal = shopCartSubtotal(cart);
  const empty = lines.length === 0;
  const discount = subtotal >= 20 ? subtotal * 0.05 : 0; // 5% off over $20
  const total = subtotal + (empty ? 0 : SHOP_DELIVERY_FEE) - discount;

  return (
    <div className="screen">
      <StatusBar />
      <div className="screen-body shop-tab-body">
        <h2 className="h-section" style={{ margin: "0 0 18px", fontSize: 28 }}>Cart</h2>

        {empty ? (
          <div style={{ marginTop: 60, textAlign: "center", fontFamily: "var(--font-body)", color: "var(--text-mid)" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🛒</div>
            <div style={{ fontSize: 15 }}>Your cart is empty.</div>
            <div style={{ fontSize: 13, marginTop: 6, color: "var(--text-soft)" }}>Browse the shop and add a few items.</div>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {lines.map((l) =>
                <div key={l.id} className="shop-cart-row">
                  <div className="shop-cart-thumb">
                    <span style={{ fontSize: 30 }}>{l.emoji}</span>
                  </div>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
                    <div className="shop-cart-name">{l.name}</div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--text-mid)" }}>
                      ${l.price.toFixed(2)} each
                    </div>
                    <QtyStepper compact value={l.qty} onChange={(q) => onChangeQty(l.id, q)} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                    <button onClick={() => onRemove(l.id)} aria-label={`Remove ${l.name}`}
                            style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4, color: "var(--text-soft)", fontSize: 16 }}>
                      ✕
                    </button>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, color: "var(--green-deep)" }}>
                      ${(l.price * l.qty).toFixed(2)}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Summary */}
            <div style={{ marginTop: 20, padding: "18px 18px 4px", background: "var(--card-pale)", border: "1px solid var(--border-sage)", borderRadius: 14, display: "flex", flexDirection: "column", gap: 10 }}>
              <SummaryRow label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
              <SummaryRow label="Delivery fee" value={`$${SHOP_DELIVERY_FEE.toFixed(2)}`} />
              {discount > 0 && <SummaryRow label="Discount (5%)" value={`-$${discount.toFixed(2)}`} accent />}
              <div style={{ height: 1, background: "var(--border-sage)", margin: "6px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingBottom: 12 }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, color: "var(--green-deep)" }}>Total</span>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "var(--green-deep)" }}>
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 10 }}>
              <BtnPrimary full onClick={onBookSlot}>Book delivery slot</BtnPrimary>
              <BtnTertiary full onClick={onContinueShopping}>Continue shopping</BtnTertiary>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SummaryRow({ label, value, accent }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontFamily: "var(--font-body)", fontSize: 14 }}>
      <span style={{ color: "var(--text-dark)" }}>{label}</span>
      <span style={{ color: accent ? "var(--green-deep)" : "var(--text-dark)", fontWeight: accent ? 600 : 400 }}>{value}</span>
    </div>
  );
}

/* ---- Shop Order Placed (book-later path) ----------------------- */
function ShopOrderPlaced({ total, onPickSlot, onSkip }) {
  return (
    <div className="screen">
      <StatusBar />
      <div className="screen-body" style={{ padding: 0 }}>
        <div style={{
          margin: "0 5px",
          height: 201,
          borderRadius: 20,
          border: "0.5px solid var(--border-sage)",
          backgroundImage: "linear-gradient(rgba(156,175,166,0.15), rgba(156,175,166,0.15)), url(assets/complete.jpg)",
          backgroundSize: "cover", backgroundPosition: "center",
          position: "relative"
        }}>
          <div style={{
            position: "absolute", left: 16, top: 16,
            background: "var(--green-deep)", color: "#fff",
            padding: "6px 12px", borderRadius: 14,
            fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
            display: "flex", gap: 6, alignItems: "center"
          }}>
            <span>✓</span> Order placed
          </div>
        </div>

        <div style={{ padding: "36px 20px 0", display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <h2 className="h-section" style={{ margin: 0 }}>Order placed</h2>
            <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: 14, color: "var(--text-mid)" }}>
              Your order is ready. Pick a delivery slot now or we'll prompt you later.
            </p>
          </div>

          <div style={{ padding: "16px 18px", background: "var(--card-pale)", border: "1px solid var(--border-sage)", borderRadius: 14, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--text-dark)" }}>Order total</span>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "var(--green-deep)" }}>
              ${total.toFixed(2)}
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <BtnPrimary full onClick={onPickSlot}>Pick delivery slot</BtnPrimary>
            <BtnTertiary full onClick={onSkip}>Skip for now</BtnTertiary>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- Quantity stepper ------------------------------------------ */
function QtyStepper({ value, onChange, compact }) {
  const size = compact ? 28 : 38;
  const btn = {
    width: size, height: size, borderRadius: 999,
    border: "1px solid var(--green-deep)",
    background: "transparent", color: "var(--green-deep)",
    fontSize: compact ? 16 : 20, fontWeight: 600, cursor: "pointer",
    display: "grid", placeItems: "center",
    fontFamily: "var(--font-body)",
  };
  const dec = () => onChange(Math.max(1, value - 1));
  const inc = () => onChange(Math.min(99, value + 1));
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: compact ? 8 : 12 }}>
      <button type="button" onClick={dec} aria-label="Decrease" style={btn}>−</button>
      <span style={{ minWidth: 20, textAlign: "center", fontFamily: "var(--font-body)", fontSize: compact ? 14 : 16, fontWeight: 600, color: "var(--green-deep)" }}>
        {value}
      </span>
      <button type="button" onClick={inc} aria-label="Increase" style={{ ...btn, background: "var(--green-deep)", color: "#fff" }}>+</button>
    </div>
  );
}

/* ---- Shop Orders ----------------------------------------------- */
function ShopOrders() {
  return (
    <div className="screen">
      <StatusBar />
      <div className="screen-body shop-tab-body">
        <h2 className="h-section" style={{ margin: "0 0 18px", fontSize: 28 }}>Orders</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {SHOP_ORDERS.map((o) =>
            <div key={o.id} className="shop-order-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 16, color: "var(--green-deep)" }}>
                  {o.id}
                </div>
                <span className="shop-order-status">{o.status}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 10 }}>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-mid)" }}>
                  {o.date} · {o.items} {o.items === 1 ? "item" : "items"}
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--green-deep)" }}>
                  ${o.total.toFixed(2)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---- Shop Wishlist --------------------------------------------- */
function ShopWishlist({ onOpenProduct }) {
  const items = SHOP_WISHLIST_IDS
    .map((id) => SHOP_PRODUCTS.find((p) => p.id === id))
    .filter(Boolean);

  return (
    <div className="screen">
      <StatusBar />
      <div className="screen-body shop-tab-body">
        <h2 className="h-section" style={{ margin: "0 0 18px", fontSize: 28 }}>Wishlist</h2>

        {items.length === 0 ? (
          <div style={{ marginTop: 60, textAlign: "center", color: "var(--text-mid)", fontFamily: "var(--font-body)" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>♡</div>
            <div style={{ fontSize: 15 }}>No saved items yet.</div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {items.map((p) =>
              <button key={p.id} className="shop-card" onClick={() => onOpenProduct(p.id)}>
                <div className="shop-card-thumb">
                  <span style={{ fontSize: 44 }}>{p.emoji}</span>
                </div>
                <div className="shop-card-body">
                  <div className="shop-card-name">{p.name}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--font-body)", fontSize: 12, color: "var(--text-mid)" }}>
                    <span style={{ color: "var(--green-deep)", fontWeight: 700 }}>★ {p.rating}</span>
                    <span>·</span>
                    <span>{p.time}</span>
                  </div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, color: "var(--green-deep)" }}>
                    ${p.price.toFixed(2)}
                  </div>
                </div>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---- Shop Profile ---------------------------------------------- */
function ShopProfile({ onOpenFlow0, onOpenFlow1, onSignOut }) {
  const menu = [
    { icon: "📅", label: "Delivery preferences", sub: "Set days, times, and priorities", onClick: onOpenFlow0 },
    { icon: "🚚", label: "Saved slots",          sub: "View and edit your preferred windows", onClick: onOpenFlow1 },
    { icon: "📍", label: "Addresses",            sub: SHOP_PROFILE.address },
    { icon: "💳", label: "Payment methods",      sub: "Visa ending in 4242" },
    { icon: "❔", label: "Help & support",        sub: "Get in touch with our team" },
  ];

  return (
    <div className="screen">
      <StatusBar />
      <div className="screen-body shop-tab-body">
        <h2 className="h-section" style={{ margin: "0 0 18px", fontSize: 28 }}>Profile</h2>

        <div style={{ display: "flex", gap: 14, alignItems: "center", padding: "18px 18px", background: "var(--card-pale)", border: "1px solid var(--border-sage)", borderRadius: 14, marginBottom: 18 }}>
          <div style={{ width: 56, height: 56, borderRadius: 999, background: "var(--green-deep)", color: "var(--lime)", display: "grid", placeItems: "center", fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700 }}>
            {SHOP_PROFILE.name.charAt(0)}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, color: "var(--green-deep)" }}>
              {SHOP_PROFILE.name}
            </div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-mid)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {SHOP_PROFILE.email}
            </div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--text-soft)" }}>
              {SHOP_PROFILE.joined}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {menu.map((m, i) =>
            <button key={i} className="shop-profile-row" onClick={m.onClick}>
              <span className="shop-profile-row-icon">{m.icon}</span>
              <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 500, color: "var(--text-dark)" }}>{m.label}</div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--text-mid)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.sub}</div>
              </div>
              <span style={{ color: "var(--text-soft)", fontSize: 18 }}>›</span>
            </button>
          )}
        </div>

        <button onClick={onSignOut} style={{
          marginTop: 20,
          width: "100%",
          padding: "14px 16px",
          borderRadius: 14,
          border: "1px solid var(--border-sage)",
          background: "transparent",
          fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 500,
          color: "var(--text-mid)",
          cursor: "pointer"
        }}>
          Sign out
        </button>
      </div>
    </div>
  );
}

/* ---- Shop Bottom Nav ------------------------------------------- */
const NavIcon = {
  home: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12L12 3l9 9"/><path d="M5 10v10h14V10"/>
    </svg>
  ),
  cart: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/>
      <path d="M3 4h2l3 12h12l2-8H6"/>
    </svg>
  ),
  orders: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2h12v20l-3-2-3 2-3-2-3 2V2z"/>
      <path d="M9 8h6M9 12h6M9 16h4"/>
    </svg>
  ),
  wishlist: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  profile: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4"/>
      <path d="M4 21c0-4 4-7 8-7s8 3 8 7"/>
    </svg>
  ),
};

const SHOP_TABS = [
  { key: "s-home",     label: "Home",     icon: "home" },
  { key: "s-cart",     label: "Cart",     icon: "cart" },
  { key: "s-orders",   label: "Orders",   icon: "orders" },
  { key: "s-wishlist", label: "Wishlist", icon: "wishlist" },
  { key: "s-profile",  label: "Profile",  icon: "profile" },
];

function ShopBottomNav({ current, onTab, cartCount }) {
  return (
    <nav className="shop-nav">
      {SHOP_TABS.map((t) => {
        const active = t.key === current;
        return (
          <button key={t.key} type="button"
                  onClick={() => onTab(t.key)}
                  className={"shop-nav-item" + (active ? " active" : "")}
                  aria-label={t.label} aria-current={active ? "page" : undefined}>
            <span className="shop-nav-icon-wrap">
              {NavIcon[t.icon]}
              {t.key === "s-cart" && cartCount > 0 && (
                <span className="shop-nav-badge">{cartCount}</span>
              )}
            </span>
            <span className="shop-nav-label">{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

Object.assign(window, {
  SHOP_CATEGORIES, SHOP_PRODUCTS, SHOP_DELIVERY_FEE,
  SHOP_ORDERS, SHOP_WISHLIST_IDS, SHOP_PROFILE, SHOP_TABS,
  shopCartLineItems, shopCartSubtotal, shopCartCount,
  ShopHome, ShopProduct, ShopCart, ShopOrderPlaced, QtyStepper,
  ShopOrders, ShopWishlist, ShopProfile, ShopBottomNav,
});
