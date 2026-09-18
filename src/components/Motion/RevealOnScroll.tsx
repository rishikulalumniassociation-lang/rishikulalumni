'use client';

import React, { useEffect, useRef, useState, ReactNode } from 'react';

interface RevealOnScrollProps {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
  delay?: number; // in milliseconds
  duration?: number; // in milliseconds
  threshold?: number;
  className?: string;
  distance?: number; // in px
  once?: boolean;
}

export default function RevealOnScroll({
  children,
  direction = 'up',
  delay = 0,
  duration = 700,
  threshold = 0.15,
  className = '',
  distance = 28,
  once = true,
}: RevealOnScrollProps) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) {
              observer.unobserve(element);
            }
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, once]);

  const getTransform = () => {
    if (isVisible) return 'none';
    switch (direction) {
      case 'up':
        return `translate3d(0, ${distance}px, 0)`;
      case 'down':
        return `translate3d(0, -${distance}px, 0)`;
      case 'left':
        return `translate3d(${distance}px, 0, 0)`;
      case 'right':
        return `translate3d(-${distance}px, 0, 0)`;
      case 'fade':
      default:
        return 'none';
    }
  };

  return (
    <div
      ref={elementRef}
      className={`transform-gpu ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transitionProperty: 'opacity, transform',
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
        willChange: isVisible ? 'auto' : 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}
