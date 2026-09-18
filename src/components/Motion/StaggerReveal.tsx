'use client';

import React, { useEffect, useRef, useState, ReactNode } from 'react';

interface StaggerRevealProps {
  children: ReactNode[];
  staggerMs?: number;
  durationMs?: number;
  className?: string;
  itemClassName?: string;
  threshold?: number;
}

export default function StaggerReveal({
  children,
  staggerMs = 60,
  durationMs = 600,
  className = '',
  itemClassName = '',
  threshold = 0.1,
}: StaggerRevealProps) {
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
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(el);
          }
        });
      },
      { threshold }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  return (
    <div ref={containerRef} className={className}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;

        const delay = index * staggerMs;

        return (
          <div
            className={`transform-gpu ${itemClassName}`}
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translate3d(0, 0, 0)' : 'translate3d(0, 20px, 0)',
              transitionProperty: 'opacity, transform',
              transitionDuration: `${durationMs}ms`,
              transitionDelay: `${delay}ms`,
              transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
}
