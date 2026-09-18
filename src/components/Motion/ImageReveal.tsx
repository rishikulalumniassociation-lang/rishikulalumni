'use client';

import React, { useEffect, useRef, useState, ReactNode } from 'react';

interface ImageRevealProps {
  children: ReactNode;
  className?: string;
  durationMs?: number;
  delayMs?: number;
}

export default function ImageReveal({
  children,
  className = '',
  durationMs = 900,
  delayMs = 0,
}: ImageRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden relative ${className}`}
    >
      <div
        className="w-full h-full transform-gpu"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'scale(1) translateY(0)' : 'scale(1.06) translateY(12px)',
          clipPath: isVisible ? 'inset(0% 0% 0% 0%)' : 'inset(8% 0% 8% 0%)',
          transitionProperty: 'opacity, transform, clip-path',
          transitionDuration: `${durationMs}ms`,
          transitionDelay: `${delayMs}ms`,
          transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {children}
      </div>
    </div>
  );
}
