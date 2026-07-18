"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGSAP } from "@/lib/gsap";

/**
 * useGSAPEffect — lightweight hook replacing the repeated
 * useEffect + gsap.context + ctx.revert pattern.
 *
 * @param {Function} callback - Animation setup function (runs inside gsap.context)
 * @param {React.RefObject} scopeRef - Ref to scope animations to (optional)
 * @param {Array} deps - Dependency array (like useEffect)
 *
 * Usage:
 *   useGSAPEffect((ctx) => {
 *     gsap.from(headerRef.current.children, { y: 40, opacity: 0, ... });
 *   }, sectionRef, []);
 */
export function useGSAPEffect(callback, scopeRef, deps = []) {
  const ctxRef = useRef(null);

  useEffect(() => {
    // Safety: ensure plugins are registered even if provider hasn't fired yet
    registerGSAP();

    // Kill previous context if deps changed (e.g. activeIndex)
    if (ctxRef.current) {
      ctxRef.current.revert();
    }

    ctxRef.current = gsap.context((self) => {
      callback(self);
    }, scopeRef?.current || undefined);

    return () => {
      if (ctxRef.current) {
        ctxRef.current.revert();
        ctxRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
