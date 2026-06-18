// Flow 2 — Grocery shopping.
// Browse → product detail → cart → either book a delivery slot then checkout,
// or check out first and pick a slot afterwards.

/* Category icons. Sourced from Icons/, inlined so currentColor follows chip state.
   No source icon exists for "All" — using a clean 3-bar mark as a default. */
const CatIcon = {
  all: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="3" y="5" width="18" height="3" rx="1.5" />
      <rect x="3" y="10.5" width="18" height="3" rx="1.5" />
      <rect x="3" y="16" width="18" height="3" rx="1.5" />
    </svg>
  ),
  fresh: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 21.5C3.206 20.5 4.194 18.2 6.5 17M10.5 8.5C14.6925 7.44 19.3325 4.12 21 2.5C21 10 19.0995 14.236 18 15.5C13 21.25 7.5325 18.58 6.5 16.5C4.0725 11.6115 7.535 9.25 10.5 8.5Z"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  meats: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M13.6198 8.38192L15.5858 6.41492C15.3532 6.18239 15.1815 5.89609 15.086 5.58138C14.9905 5.26667 14.974 4.93325 15.0381 4.61067C15.1022 4.28809 15.2449 3.98629 15.4535 3.73201C15.6621 3.47774 15.9302 3.27882 16.234 3.1529C16.5378 3.02697 16.868 2.97791 17.1953 3.01007C17.5226 3.04223 17.837 3.15462 18.1105 3.33727C18.384 3.51992 18.6082 3.76721 18.7634 4.05722C18.9185 4.34723 18.9997 4.67103 18.9998 4.99992C19.3287 4.99968 19.6527 5.0806 19.9429 5.2355C20.2331 5.3904 20.4807 5.61451 20.6636 5.88795C20.8465 6.16139 20.9591 6.47573 20.9915 6.80311C21.0239 7.13048 20.975 7.46079 20.8492 7.76476C20.7234 8.06873 20.5245 8.33697 20.2702 8.54572C20.016 8.75446 19.7142 8.89726 19.3915 8.96146C19.0689 9.02566 18.7353 9.00928 18.4205 8.91377C18.1057 8.81826 17.8194 8.64657 17.5868 8.41392L15.7668 10.2349M7.49977 15.9999L8.49977 16.9999M5.90377 18.5959C8.63677 21.3299 11.8038 22.5959 12.9738 21.4249C14.1458 20.2529 12.8798 17.0869 10.1458 14.3539C7.41277 11.6199 4.24577 10.3539 3.07577 11.5249C1.90377 12.6969 3.16977 15.8629 5.90377 18.5959Z"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12.9747 21.425C16.8797 17.519 17.8297 12.137 15.0957 9.40397C12.3627 6.66997 6.98068 7.61997 3.07568 11.525"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  bakery: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.0002 22.0002H5.00018C3.90018 22.0002 3.00018 21.1002 3.00018 20.0002V9.32023C2.40018 8.57023 2.05018 7.66023 2.00018 6.70023C1.95018 5.56023 2.36018 4.48023 3.15018 3.65023C4.17018 2.58023 5.74018 1.99023 7.57018 1.99023H17.3002C18.5902 1.99023 19.8502 2.53023 20.7502 3.47023C21.6002 4.36023 22.0402 5.51023 21.9902 6.70023C21.9494 7.65881 21.5984 8.57823 20.9902 9.32023V20.0002C20.9902 21.1002 20.0902 22.0002 18.9902 22.0002H19.0002ZM7.58018 4.00023C6.30018 4.00023 5.24018 4.37023 4.60018 5.04023C4.18018 5.48023 3.97018 6.02023 4.00018 6.62023C4.03018 7.23023 4.28018 7.81023 4.71018 8.25023C4.89018 8.44023 4.99018 8.69023 4.99018 8.95023V20.0102H18.9902V8.95023C18.9902 8.69023 19.0902 8.44023 19.2702 8.25023C19.7002 7.81023 19.9602 7.23023 19.9802 6.62023C20.0102 5.98023 19.7702 5.36023 19.3002 4.87023C18.7802 4.32023 18.0502 4.01023 17.3002 4.01023H7.58018V4.00023Z" />
      <path d="M12 7C11.7348 7 11.4804 7.10536 11.2929 7.29289C11.1054 7.48043 11 7.73478 11 8C11 8.26522 11.1054 8.51957 11.2929 8.70711C11.4804 8.89464 11.7348 9 12 9C12.2652 9 12.5196 8.89464 12.7071 8.70711C12.8946 8.51957 13 8.26522 13 8C13 7.73478 12.8946 7.48043 12.7071 7.29289C12.5196 7.10536 12.2652 7 12 7ZM15.5 10C15.3674 10 15.2402 10.0527 15.1464 10.1464C15.0527 10.2402 15 10.3674 15 10.5C15 10.6326 15.0527 10.7598 15.1464 10.8536C15.2402 10.9473 15.3674 11 15.5 11C15.6326 11 15.7598 10.9473 15.8536 10.8536C15.9473 10.7598 16 10.6326 16 10.5C16 10.3674 15.9473 10.2402 15.8536 10.1464C15.7598 10.0527 15.6326 10 15.5 10ZM16 6C15.7348 6 15.4804 6.10536 15.2929 6.29289C15.1054 6.48043 15 6.73478 15 7C15 7.26522 15.1054 7.51957 15.2929 7.70711C15.4804 7.89464 15.7348 8 16 8C16.2652 8 16.5196 7.89464 16.7071 7.70711C16.8946 7.51957 17 7.26522 17 7C17 6.73478 16.8946 6.48043 16.7071 6.29289C16.5196 6.10536 16.2652 6 16 6Z" />
    </svg>
  ),
  grains: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path opacity="0.25" d="M13 4V7.5C11.6739 7.5 10.4021 8.02678 9.46447 8.96447C8.52678 9.90215 8 11.1739 8 12.5C8 11.1739 7.47322 9.90215 6.53553 8.96447C5.59785 8.02678 4.32608 7.5 3 7.5V4C3.78279 3.99944 4.5547 4.18337 5.25313 4.53687C5.97625 2.51187 8 1.5 8 1.5C8 1.5 10.0244 2.51188 10.75 4.53625C11.4475 4.18321 12.2183 3.9995 13 4Z" />
      <path d="M13 3.49995C12.3189 3.4999 11.6438 3.62708 11.0094 3.87495C10.1144 2.0187 8.30625 1.0962 8.22375 1.05432C8.15429 1.01956 8.07768 1.00146 8 1.00146C7.92232 1.00146 7.84571 1.01956 7.77625 1.05432C7.69312 1.0962 5.88562 2.0187 4.99062 3.87495C4.35622 3.62708 3.6811 3.4999 3 3.49995C2.86739 3.49995 2.74021 3.55263 2.64645 3.64639C2.55268 3.74016 2.5 3.86734 2.5 3.99995V8.99995C2.5 10.4586 3.07946 11.8576 4.11091 12.889C5.14236 13.9205 6.54131 14.4999 8 14.4999C9.45869 14.4999 10.8576 13.9205 11.8891 12.889C12.9205 11.8576 13.5 10.4586 13.5 8.99995V3.99995C13.5 3.86734 13.4473 3.74016 13.3536 3.64639C13.2598 3.55263 13.1326 3.49995 13 3.49995ZM7.5 13.4724C6.40043 13.3481 5.38505 12.8236 4.64737 11.9988C3.90968 11.1739 3.50128 10.1065 3.5 8.99995V8.02745C4.59957 8.15176 5.61495 8.67632 6.35263 9.50114C7.09032 10.326 7.49872 11.3934 7.5 12.4999V13.4724ZM7.5 9.3412C7.04147 8.68765 6.44615 8.14175 5.7554 7.74144C5.06465 7.34113 4.29503 7.096 3.5 7.02307V4.52745C4.59957 4.65176 5.61495 5.17632 6.35263 6.00114C7.09032 6.82596 7.49872 7.89338 7.5 8.99995V9.3412ZM5.88438 4.31932C6.46063 3.11807 7.53625 2.35995 8 2.07495C8.465 2.3587 9.5375 3.11245 10.115 4.31932C9.1904 4.89105 8.45476 5.72255 8 6.70995C7.54507 5.72247 6.80921 4.89095 5.88438 4.31932ZM12.5 8.99995C12.4987 10.1065 12.0903 11.1739 11.3526 11.9988C10.615 12.8236 9.59957 13.3481 8.5 13.4724V12.4999C8.50128 11.3934 8.90968 10.326 9.64736 9.50114C10.385 8.67632 11.4004 8.15176 12.5 8.02745V8.99995ZM12.5 7.02307C11.705 7.096 10.9354 7.34113 10.2446 7.74144C9.55385 8.14175 8.95853 8.68765 8.5 9.3412V8.99995C8.50128 7.89338 8.90968 6.82596 9.64736 6.00114C10.385 5.17632 11.4004 4.65176 12.5 4.52745V7.02307Z" />
    </svg>
  ),
  organic: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M15.4768 2.99316C15.4697 2.87084 15.4179 2.7554 15.3312 2.66876C15.2446 2.58212 15.1291 2.53031 15.0068 2.52316C11.7718 2.33566 9.17431 3.31941 8.05806 5.16191C7.32056 6.38004 7.32181 7.85941 8.04806 9.27066C7.63462 9.76272 7.3325 10.3384 7.16244 10.9582L6.14556 9.93754C6.63431 8.91691 6.61556 7.85316 6.08306 6.96941C5.25806 5.60754 3.35369 4.87754 0.989312 5.01629C0.866991 5.02343 0.75155 5.07524 0.664908 5.16188C0.578267 5.24853 0.526456 5.36397 0.519312 5.48629C0.379937 7.85066 1.11056 9.75504 2.47244 10.58C2.92183 10.8547 3.43827 11 3.96494 11C4.47612 10.9937 4.97934 10.8726 5.43744 10.6457L6.99994 12.2082V14C6.99994 14.1326 7.05262 14.2598 7.14638 14.3536C7.24015 14.4474 7.36733 14.5 7.49994 14.5C7.63255 14.5 7.75972 14.4474 7.85349 14.3536C7.94726 14.2598 7.99994 14.1326 7.99994 14V12.1569C7.99766 11.3615 8.26836 10.5893 8.76681 9.96941C9.4099 10.3055 10.1231 10.4854 10.8487 10.4944C11.5502 10.4967 12.2386 10.305 12.8381 9.94066C14.6806 8.82566 15.6668 6.22816 15.4768 2.99316ZM2.98806 9.72504C2.02931 9.14441 1.48681 7.77004 1.49994 6.00004C3.26994 5.98504 4.64431 6.52941 5.22494 7.48816C5.52806 7.98816 5.57744 8.57129 5.37869 9.17191L3.85306 7.64629C3.75853 7.55648 3.63266 7.50715 3.50228 7.50882C3.37189 7.51049 3.24732 7.56302 3.15512 7.65522C3.06292 7.74742 3.01039 7.872 3.00872 8.00238C3.00705 8.13276 3.05638 8.25863 3.14619 8.35316L4.67181 9.87879C4.07119 10.0775 3.48869 10.0282 2.98806 9.72504ZM12.3199 9.08629C11.4824 9.59316 10.4981 9.63191 9.49806 9.21129L12.8537 5.85504C12.9435 5.76051 12.9928 5.63463 12.9912 5.50425C12.9895 5.37387 12.937 5.2493 12.8448 5.1571C12.7526 5.0649 12.628 5.01236 12.4976 5.01069C12.3672 5.00902 12.2413 5.05835 12.1468 5.14816L8.79056 8.50004C8.36806 7.50004 8.40619 6.51504 8.91556 5.67816C9.78681 4.24066 11.8531 3.43941 14.4987 3.50129C14.5587 6.14629 13.7587 8.21504 12.3199 9.08629Z" />
    </svg>
  ),
};

const SHOP_CATEGORIES = [
  { id: "all",     label: "All",     icon: "all" },
  { id: "fresh",   label: "Fresh",   icon: "fresh" },
  { id: "meats",   label: "Meats",   icon: "meats" },
  { id: "bakery",  label: "Bakery",  icon: "bakery" },
  { id: "grains",  label: "Grains",  icon: "grains" },
  { id: "organic", label: "Organic", icon: "organic" },
];

const SHOP_PRODUCTS = [
  { id: "p1", name: "Mixed Veg Basket", cat: "fresh",   price: 10.00, oldPrice: 11.50, rating: 4.8, time: "10 min", image: "assets/products/Mixed%20Veg.png",       desc: "Hand-picked seasonal vegetables — peppers, leafy greens, cucumbers, and herbs. Sourced from local farms within 50 miles." },
  { id: "p2", name: "Tender Steak",     cat: "meats",   price: 15.00, rating: 4.6, time: "12 min", image: "assets/products/Steak.png",            desc: "Premium aged cut from grass-fed cattle. Perfect for grilling or pan-searing." },
  { id: "p3", name: "Sourdough Loaf",   cat: "bakery",  price: 4.50,  rating: 4.9, time: "8 min",  image: "assets/products/sourdough.png",        desc: "Stone-baked overnight, naturally leavened with a deep crust and tender crumb." },
  { id: "p4", name: "Heritage Grains",  cat: "grains",  price: 6.00,  rating: 4.7, time: "9 min",  image: "assets/products/Grains.png",           desc: "Whole-grain mix — farro, spelt, and pearl barley. Hearty and nutrient-dense." },
  { id: "p5", name: "Organic Greens",   cat: "organic", price: 7.50,  rating: 4.5, time: "10 min", image: "assets/products/Organic%20greens.png", desc: "Certified organic salad mix — washed, ready to serve. Crisp, tender, never bitter." },
  { id: "p6", name: "Farm Eggs (12)",   cat: "fresh",   price: 5.00,  rating: 4.9, time: "8 min",  image: "assets/products/Eggs.png",             desc: "Pasture-raised, dated this morning. Rich golden yolks." },
  { id: "p7", name: "Country Pâté",     cat: "meats",   price: 8.50,  rating: 4.4, time: "10 min", image: "assets/products/Country%20Pate.png",   desc: "House-made coarse pâté with thyme and brandy. Best served chilled with bread." },
  { id: "p8", name: "Wholegrain Roll",  cat: "bakery",  price: 2.25,  rating: 4.6, time: "8 min",  image: "assets/products/Wholegrain%20rolls.png", desc: "Soft inside, seedy outside. Great for sandwiches." },
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
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 16, height: 16 }}>
                {CatIcon[c.icon]}
              </span>
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
                <img src={p.image} alt={p.name} className="shop-product-img" />
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
          <img src={product.image} alt={product.name} className="shop-hero-img" />
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
                    <img src={l.image} alt={l.name} className="shop-cart-img" />
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
                  <img src={p.image} alt={p.name} className="shop-product-img" />
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
  CatIcon,
  SHOP_CATEGORIES, SHOP_PRODUCTS, SHOP_DELIVERY_FEE,
  SHOP_ORDERS, SHOP_WISHLIST_IDS, SHOP_PROFILE, SHOP_TABS,
  shopCartLineItems, shopCartSubtotal, shopCartCount,
  ShopHome, ShopProduct, ShopCart, ShopOrderPlaced, QtyStepper,
  ShopOrders, ShopWishlist, ShopProfile, ShopBottomNav,
});
