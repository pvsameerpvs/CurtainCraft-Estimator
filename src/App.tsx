import { useMemo, useState, useEffect, useRef } from "react";

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
  const fmt = (n: number) =>
    new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n);
  return (
    <div className="leading-tight">
      <div className="text-[10px] text-slate-500">{label}</div>
      <div
        className={`text-[13px] font-semibold ${
          highlight ? "text-emerald-600" : "text-slate-900"
        }`}
      >
        AED {fmt(value)}
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

// ------------------ Main Component ------------------

export default function CurtainEstimator() {
  const [widthStr, setWidthStr] = useState("200");
  const [heightStr, setHeightStr] = useState("300");
  const [product, setProduct] = useState<ProductKey>("sheer");

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

  const activeProduct = PRODUCTS.find((p) => p.key === product)!;
  const marketEstimate = Math.round(areaSqM * activeProduct.ratePerSqM);
  const yourPrice = Math.round(marketEstimate * 0.6);

  const offers = [
    "Free home visit & measuring",
    "Today only: extra 5% off",
    "Installation included on orders over AED 1500",
  ];

  const sanitize = (v: string) => v.replace(/[^0-9.]/g, "");

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-slate-50 text-slate-900 overflow-x-hidden">
      <style>{`
        .iosMomentum { -webkit-overflow-scrolling: touch; }
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
        <button className="bg-emerald-500 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-600 text-sm">
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

            <div className="text-right order-3 sm:order-3">
              <div className="text-[11px] font-semibold text-slate-500">
                Area
              </div>
              <div className="text-sm font-semibold">
                {widthStr || "0"} × {heightStr || "0"} cm = {areaSqM} m²
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
              className="
                iosMomentum
                grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2
                overflow-y-auto h-[calc(100dvh-14rem)] pr-1 pb-6
              "
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
    </div>
  );
}
