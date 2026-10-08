"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/motion";

/** IntersectionObserver reveal (WOW.js port) with reduced-motion bypass. */
export function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  as?: ElementType;
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reduced) {
      setVisible(true);
      return;
    }
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduced]);

  return (
    <Tag
      ref={ref as never}
      className={`reveal${visible ? " visible" : ""}${className ? ` ${className}` : ""}`}
      style={{ ["--reveal-delay" as string]: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

/**
 * EFFECT-04 — per-letter stagger headline.
 * Splits are aria-hidden; a clean sentence lives in sr-only text.
 */
export function StaggerText({
  text,
  keyword,
  className = "",
  baseDelay = 0,
}: {
  text: string;
  keyword?: string;
  className?: string;
  baseDelay?: number;
}) {
  const reduced = usePrefersReducedMotion();
  const [glitch, setGlitch] = useState(false);
  const words = text.split(" ");

  useEffect(() => {
    if (!keyword || reduced) return;
    const id = window.setTimeout(() => setGlitch(true), baseDelay + 900);
    return () => window.clearTimeout(id);
  }, [keyword, reduced, baseDelay]);

  let charIndex = 0;

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, wi) => {
          const isKeyword = keyword !== undefined && word.replace(/[^\w]/g, "") === keyword;
          const letters = Array.from(word).map((ch, ci) => {
            const style = {
              ["--i" as string]: String(charIndex),
              animationDelay: `${baseDelay + charIndex * 32}ms`,
            };
            charIndex += 1;
            return (
              <span key={`${wi}-${ci}`} className="char" style={style}>
                {ch}
              </span>
            );
          });
          charIndex += 1; // word space

          if (isKeyword) {
            return (
              <span key={wi} className={`glitch-word${glitch ? " glitch-run" : ""}`} data-text={word}>
                {letters}
              </span>
            );
          }
          return (
            <span key={wi}>
              {letters}
              {wi < words.length - 1 ? " " : ""}
            </span>
          );
        })}
      </span>
    </span>
  );
}
