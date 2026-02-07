"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { works } from "@/data/works";

function useGlitchText(text: string, paused: boolean) {
  const [display, setDisplay] = useState(text);
  const chars = "░▒▓█▄▀■□▪▫●○◆◇◈※†‡¶§∞≈≠±×÷";

  useEffect(() => {
    if (paused) {
      setDisplay(text);
      return;
    }

    let timeout: ReturnType<typeof setTimeout>;

    const glitchBurst = () => {
      let frame = 0;
      const totalFrames = 10;
      const interval = setInterval(() => {
        frame++;
        if (frame >= totalFrames) {
          setDisplay(text);
          clearInterval(interval);
          // Schedule next burst in 3-8s
          timeout = setTimeout(glitchBurst, 3000 + Math.random() * 5000);
          return;
        }
        const result = text
          .split("")
          .map((ch) =>
            Math.random() < 0.3
              ? chars[Math.floor(Math.random() * chars.length)]
              : ch
          )
          .join("");
        setDisplay(result);
      }, 50);

      return interval;
    };

    // Start first burst after short delay
    timeout = setTimeout(glitchBurst, 500 + Math.random() * 2000);

    return () => clearTimeout(timeout);
  }, [text, paused]);

  return display;
}

function GlitchName({ variants }: { variants: string[] }) {
  const [current, setCurrent] = useState(variants[0]);
  const chars = "░▒▓█▄▀■□▪▫◆◇";

  useEffect(() => {
    if (variants.length <= 1) return;

    let timeout: ReturnType<typeof setTimeout>;

    const cycle = () => {
      // Pick a random different variant
      const next = variants[Math.floor(Math.random() * variants.length)];

      // Scramble phase
      let frame = 0;
      const scrambleFrames = 6;
      const interval = setInterval(() => {
        frame++;
        if (frame >= scrambleFrames) {
          setCurrent(next);
          clearInterval(interval);
          // Next cycle in 2-6s
          timeout = setTimeout(cycle, 2000 + Math.random() * 4000);
          return;
        }
        // Show garbled text same length as next
        const maxLen = Math.max(current.length, next.length);
        const garbled = Array.from({ length: maxLen }, (_, i) => {
          if (Math.random() < frame / scrambleFrames && i < next.length) {
            return next[i];
          }
          return chars[Math.floor(Math.random() * chars.length)];
        }).join("");
        setCurrent(garbled);
      }, 45);
    };

    timeout = setTimeout(cycle, 1500 + Math.random() * 3000);
    return () => clearTimeout(timeout);
  }, [variants]);

  return <span className="glitch-name">{current}</span>;
}

function FloatingGlyphs() {
  const glyphs = "⟨⟩⌐¬░▒▓∷∴∵⊕⊗⊘⊙⊚⋮⋯⋰⋱│┃┆┇┊┋╎╏";
  const [items, setItems] = useState<
    { ch: string; x: number; y: number; delay: number; dur: number }[]
  >([]);

  useEffect(() => {
    setItems(
      Array.from({ length: 18 }, () => ({
        ch: glyphs[Math.floor(Math.random() * glyphs.length)],
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 8,
        dur: 4 + Math.random() * 6,
      }))
    );
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="glyphs" aria-hidden="true">
      {items.map((g, i) => (
        <span
          key={i}
          className="glyphs__item"
          style={{
            left: `${g.x}%`,
            top: `${g.y}%`,
            animationDelay: `${g.delay}s`,
            animationDuration: `${g.dur}s`,
          }}
        >
          {g.ch}
        </span>
      ))}
    </div>
  );
}

export default function Gallery({ initialWorkId }: { initialWorkId?: string }) {
  const [activeIndex, setActiveIndex] = useState(() => {
    if (!initialWorkId) return 0;
    const idx = works.findIndex((w) => w.id === initialWorkId);
    return idx !== -1 ? idx : 0;
  });
  const [fading, setFading] = useState(false);
  const [titleHovered, setTitleHovered] = useState(false);
  const [showExhibition, setShowExhibition] = useState(false);
  const activeIndexRef = useRef(activeIndex);
  activeIndexRef.current = activeIndex;

  const active = works[activeIndex];
  const glitchedTitle = useGlitchText(active.title, titleHovered);

  // Handle browser back/forward
  useEffect(() => {
    const onPopState = () => {
      const path = window.location.pathname.replace(/^\//, "");
      const idx = path ? works.findIndex((w) => w.id === path) : 0;
      const target = idx !== -1 ? idx : 0;
      if (target !== activeIndexRef.current) {
        setFading(true);
        setTimeout(() => {
          setActiveIndex(target);
          setFading(false);
        }, 200);
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const switchWork = useCallback(
    (index: number) => {
      if (index === activeIndex) return;
      setFading(true);
      setTimeout(() => {
        setActiveIndex(index);
        setFading(false);
        window.history.pushState(null, "", `/${works[index].id}`);
      }, 200);
    },
    [activeIndex]
  );

  return (
    <div className="shell">
      <FloatingGlyphs />
      <div className="scanlines" aria-hidden="true" />
      {/* Terminal prompt */}
      <div className="prompt">
        <span className="prompt__user">nekits</span>@art:~$ ls works/
        <span className="prompt__cursor" />
      </div>

      {/* Main two-column layout */}
      <div className="main">
        {/* Sidebar — works list */}
        <nav>
          <div className="sidebar__label">Works</div>
          <ul className="works-list">
            {works.map((work, i) => (
              <li key={work.id} className="works-list__item">
                <button
                  className={`works-list__btn ${
                    i === activeIndex ? "works-list__btn--active" : ""
                  }`}
                  onClick={() => switchWork(i)}
                >
                  <span className="works-list__marker">
                    {i === activeIndex ? ">" : " "}
                  </span>
                  {work.id}/
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Viewer */}
        <div
          className="viewer"
          style={{
            opacity: fading ? 0 : 1,
            transform: fading ? "translateY(4px)" : "translateY(0)",
            transition: "opacity 0.3s ease, transform 0.3s ease",
          }}
        >
          <div className="viewer__label">Viewer</div>
          <h1
            className="viewer__title"
            data-text={active.title}
            onMouseEnter={() => setTitleHovered(true)}
            onMouseLeave={() => setTitleHovered(false)}
          >
            {glitchedTitle}
          </h1>
          <div className="viewer__meta">
            {active.series} — {active.technique}
            <br />
            {active.date} / {active.context}
          </div>

          {/* View toggle + images */}
          {active.exhibitionImage && (
            <div className="view-toggle">
              <button
                className={`view-toggle__btn ${!showExhibition ? "view-toggle__btn--active" : ""}`}
                onClick={() => setShowExhibition(false)}
                aria-label="Source"
              >
                <span className="view-toggle__square" />
                <span className="view-toggle__square" />
                <span className="view-toggle__square" />
              </button>
              <button
                className={`view-toggle__btn ${showExhibition ? "view-toggle__btn--active" : ""}`}
                onClick={() => setShowExhibition(true)}
                aria-label="Exhibition"
              >
                <span className="view-toggle__rect" />
              </button>
            </div>
          )}

          {/* Image triptych / exhibition */}
          {showExhibition && active.exhibitionImage ? (
            <div className="exhibition">
              <Image
                src={active.exhibitionImage}
                alt={`${active.title} — exhibition`}
                width={1200}
                height={675}
                className="exhibition__img"
              />
            </div>
          ) : (
            <div className="images">
              {active.images.map((src, i) => (
                <div key={i} className="images__item">
                  <Image
                    src={src}
                    alt={`${active.title} — ${i + 1}`}
                    width={400}
                    height={533}
                    className="images__img"
                    priority={i === 0}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Curator text */}
          <div className="textblock">
            <div className="textblock__header">
              <GlitchName variants={active.curatorNameVariants} /> {">"} <span>analysis.txt</span>
            </div>
            <div className="textblock__body">
              {active.curatorText.split("\n\n").map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="reviews">
            {active.reviews.map((review, i) => (
              <div key={i} className="review">
                <div className="review__header">
                  <GlitchName variants={review.authorLineVariants} />{" "}
                  {">"} review.txt
                </div>
                <div className="review__body">
                  {review.text.split("\n\n").map((p, j) => (
                    <p key={j}>{p}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="footer">
        <span>nekits © {new Date().getFullYear()} — all works generated in wartime darkness</span>
        <br />
        <span className="footer__disclaimer">*фото мої, все інше ШІ булшіт.</span>
      </div>
    </div>
  );
}
