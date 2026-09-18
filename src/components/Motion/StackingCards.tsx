'use client';

import React, { ReactNode } from 'react';

interface StackingCardsContainerProps {
  children: ReactNode;
  className?: string;
}

export function StackingCardsContainer({
  children,
  className = '',
}: StackingCardsContainerProps) {
  return (
    <div className={`relative flex flex-col gap-6 md:gap-8 pb-12 ${className}`}>
      {children}
    </div>
  );
}

interface StackingCardItemProps {
  children: ReactNode;
  index: number;
  totalCards?: number;
  topOffset?: number; // base top offset in px (e.g. 84px below navbar)
  stepOffset?: number; // incremental offset per card in px
  className?: string;
}

export function StackingCardItem({
  children,
  index,
  totalCards = 5,
  topOffset = 88,
  stepOffset = 18,
  className = '',
}: StackingCardItemProps) {
  const currentTop = topOffset + index * stepOffset;
  const zIndex = 10 + index;

  return (
    <div
      className={`stacking-card-sticky transform-gpu ${className}`}
      style={{
        top: `${currentTop}px`,
        zIndex,
      }}
    >
      {children}
    </div>
  );
}
