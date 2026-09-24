"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

type Slide = {
  image: string;
  index: string;
  title: string;
  subtitle: string;
};

const AUTO_ADVANCE_MS = 6000;

export function HeroBackgroundSlider({ slides }: { slides: Slide[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) {
      return;
    }
    const timer = setInterval(() => {
      setCurrent((value) => (value + 1) % slides.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) {
    return null;
  }

  const active = slides[current];
  const next = () => setCurrent((value) => (value + 1) % slides.length);
  const prev = () => setCurrent((value) => (value - 1 + slides.length) % slides.length);

  return (
    <div className="absolute inset-0 overflow-hidden bg-jungle-950">
      {slides.map((slide, index) => (
        <Image
          key={slide.image}
          src={slide.image}
          alt={slide.title}
          fill
          priority={index === 0}
          className={`object-cover transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-jungle-950/95 via-jungle-950/45 to-jungle-950/20" />

      <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-jungle-950/70 px-5 py-3.5 backdrop-blur-sm sm:px-8">
        <div className="flex min-w-0 items-center gap-2.5 text-xs text-white/80">
          <span className="font-mono font-semibold tracking-wider text-ceylon-gold">{active.index}</span>
          <span className="font-editorial truncate text-sm text-white italic">{active.title}</span>
          <span className="hidden text-white/40 sm:inline">·</span>
          <span className="hidden truncate sm:inline">{active.subtitle}</span>
        </div>

        <div className="flex shrink-0 items-center gap-4">
          <div className="flex items-center gap-1.5">
            {slides.map((slide, index) => (
              <button
                key={slide.image}
                type="button"
                onClick={() => setCurrent(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  index === current ? "w-5 bg-ceylon-gold" : "w-1.5 bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous slide"
              className="flex h-7 w-7 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:border-white/60"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next slide"
              className="flex h-7 w-7 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:border-white/60"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
