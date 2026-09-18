'use client';

import React, { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
  end: number;
  duration?: number; // ms
  prefix?: string;
  suffix?: string;
  className?: string;
}

export default function AnimatedCounter({
  end,
  duration = 1800,
  prefix = '',
  suffix = '',
  className = '',
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(end);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          observer.unobserve(el);

          const startTime = performance.now();
          const startValue = 0;

          const update = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(startValue + (end - startValue) * easeOut);
            setCount(current);

            if (progress < 1) {
              requestAnimationFrame(update);
            } else {
              setCount(end);
            }
          };

          requestAnimationFrame(update);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [end, duration]);

  return (
    <span ref={elementRef} className={className}>
      {prefix}{count.toLocaleString('en-IN')}{suffix}
    </span>
  );
}
