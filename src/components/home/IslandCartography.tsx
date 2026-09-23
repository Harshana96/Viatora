"use client";

import { useState } from "react";

type Waypoint = {
  slug: string;
  name: string;
  location: string;
  description: string;
  highlight: string | null;
};

// Fixed illustrative pin positions -- decorative overview only, not the functional
// route map (that's the real Mapbox-driven map on each package's itinerary page,
// generated from actual Place coordinates).
const PIN_POSITIONS = [
  { x: 160, y: 155, labelX: 174, labelY: 159 },
  { x: 162, y: 242, labelX: 176, labelY: 246 },
  { x: 115, y: 368, labelX: 30, labelY: 372 },
  { x: 188, y: 348, labelX: 202, labelY: 352 },
];

export function IslandCartography({ waypoints }: { waypoints: Waypoint[] }) {
  const [selected, setSelected] = useState(0);
  const active = waypoints[selected];
  const pins = waypoints.slice(0, PIN_POSITIONS.length);

  return (
    <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
      <div className="flex flex-col space-y-3 lg:col-span-5">
        {waypoints.map((waypoint, index) => {
          const isActive = index === selected;
          return (
            <button
              key={waypoint.slug}
              type="button"
              onClick={() => setSelected(index)}
              className={`p-5 text-left transition-all duration-200 ${
                isActive
                  ? "border-t border-r border-b border-l-4 border-parchment-300 border-l-foreground bg-surface shadow-sm"
                  : "border-t border-r border-b border-l-4 border-parchment-200 border-l-transparent bg-foreground/[0.03] hover:border-parchment-400"
              }`}
            >
              <div className="flex items-center justify-between text-[11px]">
                <span
                  className={`font-mono font-semibold tracking-wider uppercase ${
                    isActive ? "text-accent" : "text-muted"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")} · {waypoint.location}
                </span>
              </div>
              <h4 className="font-editorial mt-1 text-2xl font-bold text-foreground">{waypoint.name}</h4>
              <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed font-light text-muted">
                {waypoint.description}
              </p>
              <div className="mt-3 flex items-center justify-between border-t border-parchment-100 pt-2 text-[11px] text-muted">
                <span className="font-editorial text-xs text-foreground italic">View destination →</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="relative flex min-h-[420px] flex-col justify-between overflow-hidden border border-parchment-300 bg-[#FAF4EA] p-6 shadow-inner lg:col-span-7 dark:bg-[#0f2019]">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: "radial-gradient(#1A1613 1px, transparent 1px)", backgroundSize: "24px 24px" }}
        />

        <div className="relative z-10 flex items-center justify-between border-b border-stone-300/60 pb-3 font-mono text-[10px] tracking-[0.2em] text-muted uppercase">
          <span>Island Overview · Illustrative</span>
          <span className="font-editorial text-stone-700 italic capitalize dark:text-stone-300">Indian Ocean</span>
        </div>

        <div className="relative mx-auto my-4 w-full max-w-sm">
          <svg className="h-auto w-full drop-shadow-sm select-none" viewBox="0 0 320 480">
            <path
              d="M 148 24 C 178 44, 212 85, 222 135 C 232 185, 246 245, 230 310 C 220 355, 198 405, 168 435 C 146 450, 118 448, 102 422 C 82 385, 78 335, 78 285 C 78 232, 88 182, 98 132 C 108 86, 120 38, 148 24 Z"
              fill="#F2E6D4"
              stroke="#B39E84"
              strokeWidth="1.5"
            />
            <path
              d="M 126 215 C 152 195, 185 205, 185 248 C 180 282, 148 295, 130 274 Z"
              fill="#E2D0B6"
              stroke="#C4AD91"
              strokeWidth="1"
            />
            {pins.map((waypoint, index) => {
              const pos = PIN_POSITIONS[index];
              const isActive = index === selected;
              return (
                <g
                  key={waypoint.slug}
                  className="cursor-pointer transition-transform duration-300"
                  onClick={() => setSelected(index)}
                  transform={isActive ? `scale(1.1) translate(${-pos.x * 0.05}, ${-pos.y * 0.05})` : undefined}
                >
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isActive ? 7 : 6}
                    fill={isActive ? "#B94B22" : "#142923"}
                    stroke="#FAF4EA"
                    strokeWidth="2"
                  />
                  {isActive ? (
                    <circle cx={pos.x} cy={pos.y} r="14" fill="#B94B22" fillOpacity="0.2" className="animate-pulse" />
                  ) : null}
                  <text
                    x={pos.labelX}
                    y={pos.labelY}
                    fontFamily="'Cormorant Garamond', serif"
                    fontSize="14"
                    fontWeight="700"
                    fill="#1A1613"
                  >
                    {waypoint.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {active ? (
          <div className="relative z-10 border border-parchment-300 bg-surface p-5 shadow-md">
            <div className="flex items-center justify-between border-b border-parchment-200 pb-2">
              <span className="font-mono text-[10px] font-semibold tracking-widest text-accent uppercase">
                {active.location}
              </span>
            </div>
            <div className="mt-2.5 space-y-1">
              <h5 className="font-editorial text-2xl font-bold text-foreground">{active.name}</h5>
              <p className="text-xs leading-relaxed font-light text-muted">{active.description}</p>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-parchment-100 pt-3 text-xs">
              {active.highlight ? <span className="font-mono text-[11px] text-muted">{active.highlight}</span> : <span />}
              <a
                href={`/destinations/${active.slug}`}
                className="font-editorial text-sm text-foreground italic underline transition-colors hover:text-accent"
              >
                Explore this waypoint →
              </a>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
