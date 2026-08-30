'use client';

import { useEffect, useState } from 'react';

export default function DynamicDotBackground() {
  const [previousRgb, setPreviousRgb] = useState<string>('');
  const [nextRgb, setNextRgb] = useState<string>('');
  const [crossfade, setCrossfade] = useState(false);

  useEffect(() => {
    const getAccentRgb = () => {
      const styles = window.getComputedStyle(document.documentElement);
      let rgb = styles.getPropertyValue('--accent-rgb');
      if (rgb == null) return '';
      // Remove all spaces for consistent comparison
      return rgb.replace(/\s/g, '');
    };

    const handleChange = () => {
      const currentRgb = getAccentRgb();
      if (currentRgb !== previousRgb) {
        setNextRgb(currentRgb);
        setCrossfade(true);
        // After transition ends, update previous and reset
        const timeoutId = setTimeout(() => {
          setPreviousRgb(currentRgb);
          setCrossfade(false);
        }, 500);
        return () => clearTimeout(timeoutId);
      }
    };

    // Initial check
    const initialRgb = getAccentRgb();
    if (initialRgb !== previousRgb) {
      setPreviousRgb(initialRgb);
    }

    // Poll for changes every 300ms
    const intervalId = setInterval(handleChange, 300);
    return () => clearInterval(intervalId);
  }, [previousRgb]);

  // Helper to slightly lighten the accent color for better visibility
  const adjustAccent = (rgb: string): string => {
    // Expect format "255,255,255" without spaces
    const match = rgb.match(/^(\d+),(\d+),(\d+)$/);
    if (!match) return rgb;
    let r = parseInt(match[1], 10);
    let g = parseInt(match[2], 10);
    let b = parseInt(match[3], 10);
    // Boost brightness by 40 (clamped at 255) for better visibility
    const boost = 40;
    r = Math.min(255, r + boost);
    g = Math.min(255, g + boost);
    b = Math.min(255, b + boost);
    return `${r},${g},${b}`;
  };

  const getGradient = (rgb: string) => {
    // If no accent data (empty) or default white, return none to show black page background
    if (!rgb) return 'none';
    const normalized = rgb.replace(/\s/g, '');
    if (normalized === '' || normalized === '255,255,255') {
      return 'none';
    }
    const adjustedRgb = adjustAccent(rgb);
    // Increased opacity values for better visibility
    return `radial-gradient(circle at center, rgba(${adjustedRgb},0.25) 0%, rgba(${adjustedRgb},0.15) 50%, transparent 70%)`;
  };

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none">
      <div className="mask-layer" aria-hidden="true">
        {/* Two crossfading layers */}
        <div
          className="layer"
          style={{
            backgroundImage: getGradient(previousRgb),
            opacity: crossfade ? 0 : 1,
            transition: 'opacity 0.5s ease',
          }}
        />
        <div
          className="layer"
          style={{
            backgroundImage: getGradient(nextRgb),
            opacity: crossfade ? 1 : 0,
            transition: 'opacity 0.5s ease',
          }}
        />
      </div>
    </div>
  );
}
