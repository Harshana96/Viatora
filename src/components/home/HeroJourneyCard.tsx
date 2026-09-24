"use client";

import { useState } from "react";

type Slide = {
  slug: string;
  name: string;
  durationDays: number;
  description: string;
  highlights: string[];
};

export function HeroJourneyCard({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);

  if (slides.length === 0) {
    return null;
  }

  const active = slides[index];
  const next = () => setIndex((current) => (current + 1) % slides.length);
  const prev = () => setIndex((current) => (current - 1 + slides.length) % slides.length);

  return (
    <div className="relative flex h-full flex-col justify-between overflow-hidden border border-parchment-300 bg-surface p-8 shadow-sm sm:p-10">
      <div key={active.slug} className="space-y-6">
        <div>
          <div className="flex items-center justify-between border-b border-parchment-200 pb-3">
            <span className="font-mono text-[10px] font-semibold tracking-[0.2em] text-accent uppercase">
              Curated Expedition
            </span>
            <span className="font-editorial text-xs text-muted italic">
              {active.durationDays - 1} nights / {active.durationDays} days
            </span>
          </div>
          <h3 className="font-editorial mt-4 text-3xl font-medium text-foreground sm:text-4xl">{active.name}</h3>
        </div>

        <p className="text-sm leading-relaxed font-light text-muted">{active.description}</p>

        {active.highlights.length > 0 ? (
          <div className="border-t border-parchment-200 pt-4">
            <div className="mb-3 font-mono text-[10px] font-semibold tracking-wider text-muted uppercase">
              Journey Highlights
            </div>
            <div className="grid grid-cols-1 gap-2.5 text-xs text-foreground sm:grid-cols-2">
              {active.highlights.slice(0, 4).map((highlight) => (
                <div key={highlight} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-parchment-200 pt-6">
        <div className="flex items-center gap-3">
          {slides.length > 1 ? (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous journey"
                className="flex h-8 w-8 items-center justify-center border border-border text-foreground transition-colors hover:border-foreground"
              >
                <span className="font-editorial text-sm">←</span>
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next journey"
                className="flex h-8 w-8 items-center justify-center border border-border text-foreground transition-colors hover:border-foreground"
              >
                <span className="font-editorial text-sm">→</span>
              </button>
            </div>
          ) : null}
        </div>

        <a
          href={`/tours/${active.slug}`}
          className="inline-flex items-center gap-2 bg-foreground px-6 py-3 text-xs font-medium tracking-[0.14em] text-background uppercase transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <span>Explore Itinerary</span>
          <span className="font-editorial text-sm">→</span>
        </a>
      </div>
    </div>
  );
}
