import { useMemo, useState, useEffect, useRef } from "react";

// ------------------ Types ------------------

type ProductKey =
  | "sheer"
  | "blackout"
  | "duo"
  | "roller_premium"
  | "zebra"
  | "motor_curtains"
  | "motor_blinds"
  | "wave_sheer"
  | "wave_blackout"
  | "wave_duo";

type Product = {
  key: ProductKey;
  name: string;
  blurb: string;
  ratePerSqM: number;
  image: string;
};

// ------------------ Data ------------------

const PRODUCTS: Product[] = [
  {
    key: "sheer",
    name: "Sheer Curtains",
    blurb: "Airy, light-filtering",
    ratePerSqM: 533 / 6,
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1200&auto=format&fit=crop",
  },
  {
    key: "blackout",
    name: "Blackout Curtains",
    blurb: "Room-darkening comfort",
    ratePerSqM: 826 / 6,
    image:
      "https://images.unsplash.com/photo-1544551950-db18acf4c5be?q=80&w=1200&auto=format&fit=crop",
  },
  {
    key: "duo",
    name: "Sheer & Blackout Curtains",
    blurb: "Day & night flexibility",
    ratePerSqM: 1244 / 6,
    image:
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1200&auto=format&fit=crop",
  },
  {
    key: "roller_premium",
    name: "Roller Blinds Premium",
    blurb: "Minimal & modern",
    ratePerSqM: 561 / 3,
    image:
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1200&auto=format&fit=crop",
  },
  {
    key: "zebra",
    name: "Zebra Blinds",
    blurb: "Day-night stripes",
    ratePerSqM: 1104 / 3,
    image:
      "https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1200&auto=format&fit=crop",
  },
  {
    key: "motor_curtains",
    name: "Motorized Curtains",
    blurb: "Wireless convenience",
    ratePerSqM: 2085 / 6,
    image:
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1200&auto=format&fit=crop",
  },
  {
    key: "motor_blinds",
    name: "Motorized Blinds",
    blurb: "One-tap control",
    ratePerSqM: 1392 / 3,
    image:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop",
  },
  {
    key: "wave_sheer",
    name: "Wave Style Sheer Curtains",
    blurb: "Soft ripple finish",
    ratePerSqM: 752 / 6,
    image: "https://picsum.photos/id/1015/1200/800",
  },
  {
    key: "wave_blackout",
    name: "Wave Style Blackout Curtains",
    blurb: "Elegant & darkening",
    ratePerSqM: 1162 / 6,
    image: "https://picsum.photos/id/1016/1200/800",
  },
  {
    key: "wave_duo",
    name: "Wave Style Sheer & Blackout",
    blurb: "Best of both",
    ratePerSqM: 1855 / 6,
    image: "https://picsum.photos/id/1018/1200/800",
  },
];

// ------------------ Small UI Atoms ------------------

function CompactPrice({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  const fmtLocal = (n: number) =>
    new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n);
  return (
    <div className="leading-tight">
      <div className="text-[10px] text-slate-500">{label}</div>
      <div
        className={`text-[13px] font-semibold ${
          highlight ? "text-emerald-600" : "text-slate-900"
        }`}
      >
        AED {fmtLocal(value)}
      </div>
    </div>
  );
}

function Tile({
  active,
  title,
  subtitle,
  image,
  market,
  ours,
  onClick,
}: {
  active: boolean;
  title: string;
  subtitle: string;
  image: string;
  market: number;
  ours: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`group rounded-xl text-left w-full border transition-all overflow-hidden bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
        active
          ? "border-emerald-400 shadow-[0_6px_16px_rgba(16,185,129,0.12)] scale-[1.01]"
          : "border-slate-200 hover:border-emerald-300 active:scale-[0.98]"
      }`}
    >
      <div className="flex flex-row md:flex-col items-stretch gap-2 md:gap-3 p-2">
        <div className="w-16 h-16 md:w-full md:h-24 rounded-lg overflow-hidden bg-slate-100 shrink-0">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </div>

        <div className="flex-1 px-0.5 md:px-1 min-w-0">
          <div className="font-semibold text-slate-900 text-[12px] md:text-sm truncate">
            {title}
          </div>
          <div className="text-[11px] text-slate-500 truncate">{subtitle}</div>

          <div className="mt-1 grid grid-cols-2 gap-1">
            <CompactPrice label="Market" value={market} />
            <CompactPrice label="Your price (-40%)" value={ours} highlight />
          </div>
        </div>
      </div>
    </button>
  );
}

// ------------------ Modal ------------------

function Modal({
  open,
  onClose,
  children,
  title,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}) {
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) {
      document.addEventListener("keydown", onKey);
      // prevent background scroll when modal is open
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.removeEventListener("keydown", onKey);
        document.body.style.overflow = prev;
      };
    }
    return () => {};
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      aria-modal
      role="dialog"
    >
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/40"
        onClick={(e) => {
          if (e.target === overlayRef.current) onClose();
        }}
      />
      {/* Panel */}
      <div className="relative z-10 w-full max-w-xl sm:max-w-lg md:max-w-xl rounded-2xl bg-white shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 sticky top-0 bg-white rounded-t-2xl">
          <h3 className="font-semibold text-slate-900">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 hover:bg-slate-100"
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="#0f172a"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <div className="p-4 overflow-y-auto flex-1 iosMomentum">{children}</div>
      </div>
    </div>
  );
}

// ------------------ Main Component ------------------

export default function CurtainEstimator() {
  const [widthStr, setWidthStr] = useState("200");
  const [heightStr, setHeightStr] = useState("300");
  const [product, setProduct] = useState<ProductKey>("sheer");

  // Visit/Quote Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [preferred, setPreferred] = useState("WhatsApp");
  const [rushVisit, setRushVisit] = useState(true);

  // Local editable fields inside modal (so user can tweak before sending)
  const [mWidthStr, setMWidthStr] = useState(widthStr);
  const [mHeightStr, setMHeightStr] = useState(heightStr);
  const [mProduct, setMProduct] = useState<ProductKey>(product);

  const toNum = (s: string) => {
    const n = parseFloat(s);
    return Number.isFinite(n) ? n : 0;
  };

  const widthCm = useMemo(() => toNum(widthStr), [widthStr]);
  const heightCm = useMemo(() => toNum(heightStr), [heightStr]);
  const wM = useMemo(() => +(Math.max(0, widthCm) / 100).toFixed(2), [widthCm]);
  const hM = useMemo(
    () => +(Math.max(0, heightCm) / 100).toFixed(2),
    [heightCm]
  );
  const areaSqM = useMemo(() => +(wM * hM).toFixed(2), [wM, hM]);

  // --- helpers for the easy-to-understand area block ---
  const areaSqCm = useMemo(
    () => Math.round(Math.max(0, widthCm) * Math.max(0, heightCm)),
    [widthCm, heightCm]
  );
  const fmt = (n: number) =>
    new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(n);

  const activeProduct = PRODUCTS.find((p) => p.key === product)!;
  const marketEstimate = Math.round(areaSqM * activeProduct.ratePerSqM);
  const yourPrice = Math.round(marketEstimate * 0.6);

  const offers = [
    "Free home visit & measuring",
    "Today only: extra 5% off",
    "Installation included on orders over AED 1500",
  ];

  const sanitize = (v: string) => v.replace(/[^0-9.]/g, "");

  // Build default message whenever modal opens
  useEffect(() => {
    if (!modalOpen) return;
    const prod = PRODUCTS.find((p) => p.key === mProduct)!;
    const w = toNum(mWidthStr);
    const h = toNum(mHeightStr);
    const areaM2 = +((Math.max(0, w) / 100) * (Math.max(0, h) / 100)).toFixed(
      2
    );
    const market = Math.round(areaM2 * prod.ratePerSqM);
    const ours = Math.round(market * 0.6);
    setMessage(
      `Hi! I'd like a free visit for ${prod.name}. Size: ${mWidthStr}cm × ${mHeightStr}cm (~${areaM2} m²). Your price estimate: AED ${ours}.`
    );
  }, [modalOpen, mProduct, mWidthStr, mHeightStr]);

  const canSubmit = name.trim().length > 1 && /\d{5,}/.test(phone);

  function openModal() {
    setMWidthStr(widthStr);
    setMHeightStr(heightStr);
    setMProduct(product);
    setModalOpen(true);
  }

  function submitRequest() {
    // Apply edits from modal back to the main estimator
    setWidthStr(mWidthStr);
    setHeightStr(mHeightStr);
    setProduct(mProduct);

    const payload = {
      name,
      phone,
      preferred,
      rushVisit,
      message,
      product: mProduct,
      widthCm: mWidthStr,
      heightCm: mHeightStr,
    };

    console.log("Booking payload", payload);

    // WhatsApp deep-link to business number (no leading 0 after country code)
    const encodedMsg = encodeURIComponent(
      message + `\nName: ${name}\nPhone: ${phone}\nPreferred: ${preferred}`
    );
    const whatsappURL = `https://wa.me/97156778999?text=${encodedMsg}`;
    window.open(whatsappURL, "_blank");

    alert("Thanks! Redirecting you to WhatsApp chat.");
    setModalOpen(false);
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-slate-50 text-slate-900 overflow-x-hidden">
      <style>{`
        .iosMomentum { -webkit-overflow-scrolling: touch; }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      `}</style>

      {/* Offer bar */}
      <div className="h-7 bg-emerald-50 border-b border-emerald-100 text-emerald-700 text-[11px] flex items-center overflow-hidden">
        <div className="whitespace-nowrap animate-[marquee_18s_linear_infinite] px-4">
          {offers.concat(offers).map((msg, i) => (
            <span key={i} className="mx-6">
              {msg}
            </span>
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="h-12 px-3 sm:px-5 flex items-center justify-between bg-white border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-emerald-100 grid place-items-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 3h4v18H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"
                fill="#10b981"
              />
              <rect x="8" y="3" width="12" height="18" rx="2" fill="#d1fae5" />
            </svg>
          </div>
          <div className="font-bold text-base tracking-tight">CurtainCraft</div>
        </div>
        <button
          className="bg-emerald-500 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-600 text-sm"
          onClick={openModal}
        >
          Book a Free Visit
        </button>
      </header>

      <main className="mx-auto max-w-7xl p-3 space-y-2 pb-10">
        {/* Controls */}
        <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
            <div className="flex gap-2 order-2 sm:order-1">
              {[
                { label: "1.5×2m", w: "150", h: "200" },
                { label: "2×3m", w: "200", h: "300" },
              ].map((s) => (
                <button
                  key={s.label}
                  onClick={() => {
                    setWidthStr(s.w);
                    setHeightStr(s.h);
                  }}
                  className="px-2.5 py-1.5 rounded-md border border-slate-300 text-xs hover:bg-slate-50"
                >
                  {s.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 order-1 sm:order-2">
              <label className="block">
                <span className="text-[11px] font-semibold text-slate-500">
                  Width
                </span>
                <input
                  className="mt-0.5 w-full rounded-md border border-slate-300 px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  type="text"
                  value={widthStr}
                  onChange={(e) => setWidthStr(sanitize(e.target.value))}
                />
              </label>
              <label className="block">
                <span className="text-[11px] font-semibold text-slate-500">
                  Height
                </span>
                <input
                  className="mt-0.5 w-full rounded-md border border-slate-300 px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  type="text"
                  value={heightStr}
                  onChange={(e) => setHeightStr(sanitize(e.target.value))}
                />
              </label>
            </div>

            {/* Area (easy to understand) */}
            <div className="justify-self-start sm:justify-self-end text-left sm:text-right order-3 sm:order-3">
              <div className="text-[11px] font-semibold text-slate-500">
                Area
              </div>
              <div className="text-sm font-semibold">
                {areaSqCm.toLocaleString()} sq cm ({fmt(areaSqM)} sq mtr)
              </div>
              <div className="text-[11px] text-slate-500">
                In meters: {fmt(wM)} m × {fmt(hM)} m
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="rounded-xl border border-slate-200 bg-white p-2 grid grid-cols-[1fr_auto_auto] items-center gap-2 shadow-sm">
          <div>
            <div className="text-[11px] text-slate-500">Selected</div>
            <div className="text-sm font-semibold">{activeProduct.name}</div>
          </div>
          <CompactPrice label="Market" value={marketEstimate} />
          <CompactPrice label="Your price (-40%)" value={yourPrice} highlight />
        </div>

        {/* Product grid */}
        <section className="rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
          <div className="text-[11px] text-slate-500 font-semibold px-0.5">
            Browse products
          </div>

          <div className="mt-2 -mx-1 sm:mx-0">
            <div
              className="iosMomentum grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 overflow-y-auto h-[calc(100dvh-14rem)] pr-1 pb-6"
              style={{
                WebkitOverflowScrolling: "touch",
                scrollBehavior: "smooth",
                paddingBottom:
                  "calc(env(safe-area-inset-bottom, 0px) + 1.5rem)",
              }}
            >
              {PRODUCTS.map((p) => {
                const market = Math.round(areaSqM * p.ratePerSqM);
                const ours = Math.round(market * 0.6);
                const isActive = p.key === product;
                return (
                  <div key={p.key} className="min-h-[100px]">
                    <Tile
                      active={isActive}
                      title={p.name}
                      subtitle={p.blurb}
                      image={p.image}
                      market={market}
                      ours={ours}
                      onClick={() => setProduct(p.key)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* Booking Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Free Home Visit"
      >
        <div className="grid gap-4">
          {/* Selected item (editable) */}
          <div className="rounded-lg border border-slate-200 p-3">
            <div className="text-[11px] font-semibold text-slate-500 mb-2">
              Selected Item
            </div>
            <div className="flex items-start gap-3">
              <img
                src={PRODUCTS.find((p) => p.key === mProduct)!.image}
                alt={PRODUCTS.find((p) => p.key === mProduct)!.name}
                className="w-20 h-16 rounded-md object-cover"
              />
              <div className="flex-1 grid sm:grid-cols-2 gap-2">
                <label className="block">
                  <span className="text-[11px] font-semibold text-slate-500">
                    Product
                  </span>
                  <select
                    className="mt-0.5 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                    value={mProduct}
                    onChange={(e) => setMProduct(e.target.value as ProductKey)}
                  >
                    {PRODUCTS.map((p) => (
                      <option key={p.key} value={p.key}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-[11px] font-semibold text-slate-500">
                    Width (cm)
                  </span>
                  <input
                    className="mt-0.5 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                    type="text"
                    value={mWidthStr}
                    onChange={(e) =>
                      setMWidthStr(e.target.value.replace(/[^0-9.]/g, ""))
                    }
                  />
                </label>
                <label className="block">
                  <span className="text-[11px] font-semibold text-slate-500">
                    Height (cm)
                  </span>
                  <input
                    className="mt-0.5 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                    type="text"
                    value={mHeightStr}
                    onChange={(e) =>
                      setMHeightStr(e.target.value.replace(/[^0-9.]/g, ""))
                    }
                  />
                </label>
                <div className="text-sm text-slate-600 self-end">
                  <span className="text-[11px] font-semibold text-slate-500">
                    Quick Est.
                  </span>{" "}
                  <span className="font-semibold">
                    {(() => {
                      const prod = PRODUCTS.find((p) => p.key === mProduct)!;
                      const w = toNum(mWidthStr);
                      const h = toNum(mHeightStr);
                      const areaM2 = +(
                        (Math.max(0, w) / 100) *
                        (Math.max(0, h) / 100)
                      ).toFixed(2);
                      const market = Math.round(areaM2 * prod.ratePerSqM);
                      const ours = Math.round(market * 0.6);
                      return `AED ${ours} (~${areaM2} m²)`;
                    })()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact details */}
          <div className="grid sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="text-[11px] font-semibold text-slate-500">
                Name
              </span>
              <input
                className="mt-0.5 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="text-[11px] font-semibold text-slate-500">
                Phone (WhatsApp)
              </span>
              <input
                className="mt-0.5 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                type="tel"
                placeholder="05xxxxxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-[11px] font-semibold text-slate-500">
                Message
              </span>
              <textarea
                className="mt-0.5 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm min-h-[80px]"
                placeholder="Any notes or timing preferences?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </label>
          </div>

          {/* Options */}
          <div className="grid sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="text-[11px] font-semibold text-slate-500">
                Preferred Contact
              </span>
              <select
                className="mt-0.5 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                value={preferred}
                onChange={(e) => setPreferred(e.target.value)}
              >
                <option>WhatsApp</option>
                <option>Call</option>
                {/* <option>SMS</option>
                <option>Email</option> */}
              </select>
            </label>
            <label className="inline-flex items-center gap-2 mt-6">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300"
                checked={rushVisit}
                onChange={(e) => setRushVisit(e.target.checked)}
              />
              <span className="text-sm text-slate-700">
                Request same-day visit if available
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={() => setModalOpen(false)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-sm hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={submitRequest}
              disabled={!canSubmit}
              className={`px-3 py-1.5 rounded-lg text-sm text-white ${
                canSubmit
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-emerald-300 cursor-not-allowed"
              }`}
            >
              Submit Request
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
