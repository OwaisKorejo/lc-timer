"use client";

import { useEffect, useRef, useState } from "react";

// English Paper 1, Wednesday 9 June 2027, 9:30am Irish time
const TARGET = Date.parse("2027-06-09T09:30:00+01:00");
const DAY = 86_400_000;
const UNITS = ["h", "m", "s", "ms"];

const toggleTheme = (e: React.MouseEvent) => {
  const root = document.documentElement;
  const dark =
    root.dataset.theme === "dark" ||
    (!root.dataset.theme && matchMedia("(prefers-color-scheme: dark)").matches);
  const apply = () => {
    root.dataset.theme = dark ? "light" : "dark";
    try {
      localStorage.setItem("theme", root.dataset.theme);
    } catch {}
  };

  if (
    !document.startViewTransition ||
    matchMedia("(prefers-reduced-motion: reduce)").matches
  )
    return apply();

  // new theme splashes outward from the click until it covers the far corner
  const { clientX: x, clientY: y } = e;
  const radius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y),
  );
  document.startViewTransition(apply).ready.then(() =>
    root.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${radius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 700,
        easing: "cubic-bezier(0.65, 0, 0.35, 1)",
        pseudoElement: "::view-transition-new(root)",
      },
    ),
  );
};

export default function Home() {
  const [days, setDays] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const parts = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    let id = 0;
    const tick = () => {
      const left = TARGET - Date.now();
      if (left <= 0) {
        setDone(true);
        setDays(0);
        return;
      }
      setDays(Math.floor(left / DAY));
      // written straight to the DOM so React doesn't re-render every frame
      const millis = Math.floor(left % DAY);
      const secs = Math.floor(millis / 1000);
      [
        [Math.floor(secs / 3600), 2],
        [Math.floor(secs / 60) % 60, 2],
        [secs % 60, 2],
        [millis % 1000, 3],
      ].forEach(([value, width], i) => {
        const el = parts.current[i];
        if (el) el.textContent = String(value).padStart(width, "0");
      });
      id = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (days !== null) document.title = `${days}d · lc`;
  }, [days]);

  return (
    <main className="relative flex flex-1 flex-col items-center justify-center gap-10 px-6 select-none">
      <button
        onClick={toggleTheme}
        aria-label="toggle dark mode"
        className="absolute top-5 right-5 cursor-pointer p-1 text-muted transition-colors duration-300 hover:text-foreground"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
          <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.25" />
          <path d="M8 1.5a6.5 6.5 0 0 1 0 13z" fill="currentColor" />
        </svg>
      </button>

      <p className="text-xs tracking-wide text-muted">wed 9 june 2027 · 9:30</p>

      <div
        className={`flex flex-col items-center gap-4 font-mono font-light tabular-nums transition-opacity duration-700 ${
          days === null ? "opacity-0" : "opacity-100"
        }`}
      >
        <h1 className="flex items-baseline gap-3">
          <span className="text-[28vw] leading-none tracking-tighter sm:text-[13rem]">
            {done ? "now" : days}
          </span>
          {!done && (
            <span className="text-xl text-muted sm:text-3xl">
              {days === 1 ? "day" : "days"}
            </span>
          )}
        </h1>
        <p className={`flex gap-3 text-lg sm:gap-4 sm:text-2xl ${done ? "invisible" : ""}`}>
          {UNITS.map((unit, i) => (
            <span key={unit}>
              <span
                ref={(el) => {
                  parts.current[i] = el;
                }}
              />
              <span className="text-muted">{unit}</span>
            </span>
          ))}
        </p>
      </div>

      <p className="text-sm tracking-wide text-muted">till the leaving cert</p>

      <a
        href="https://owaiskorejo.com"
        target="_blank"
        rel="noopener noreferrer"
        className="group absolute bottom-6 flex items-center gap-1.5 text-base tracking-wide text-foreground"
      >
        <span>
          made for fun by <span className="underline underline-offset-4">owais</span>
        </span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        >
          <path d="M2 8 8 2M3.5 2H8v4.5" />
        </svg>
      </a>
    </main>
  );
}
