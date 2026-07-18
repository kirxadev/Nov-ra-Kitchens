"use client";

import { useEffect, useLayoutEffect } from "react";
import { registerGSAP, cleanupAllScrollTriggers, ScrollTrigger } from "@/lib/gsap";

// Use useLayoutEffect on client to ensure GSAP registers before children render animations
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * GSAPProvider — centralized GSAP lifecycle manager.
 *
 * Place this once in layout.js. It:
 * 1. Registers GSAP plugins BEFORE children mount (via useLayoutEffect).
 * 2. Kills ALL ScrollTrigger instances + tweens on unmount
 *    (triggered by Fast Refresh), preventing the
 *    "removeChild" crash and "Page Unresponsive" freeze.
 * 3. Refreshes ScrollTrigger after route transitions.
 */
export function GSAPProvider({ children }) {
  // Register BEFORE any child useEffect runs
  useIsomorphicLayoutEffect(() => {
    registerGSAP();

    return () => {
      // Fast Refresh unmount — nuke everything so re-mount starts clean
      cleanupAllScrollTriggers();
    };
  }, []);

  // Refresh ScrollTrigger positions after children mount/change
  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
    return () => clearTimeout(timer);
  });

  return children;
}
