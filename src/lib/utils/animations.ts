// ─── lib/utils/animations.ts ────────────────────────────────────────────────────

"use client";

import { useEffect, useRef, useState } from "react";

export function useCountUp(end: number, duration: number = 1400): number {
    const [value, setValue] = useState(0);
    const frameRef = useRef<number>(0);
    const startRef = useRef<number>(0);

    useEffect(() => {
        setValue(0);
        startRef.current = performance.now();

        const animate = (now: number) => {
            const elapsed = now - startRef.current;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            setValue(Math.round(eased * end));

            if (progress < 1) {
                frameRef.current = requestAnimationFrame(animate);
            }
        };

        frameRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frameRef.current);
    }, [end, duration]);

    return value;
}

export function glowBorderStyle(color: string = "var(--brand-primary)"): React.CSSProperties {
    return {
        position: "relative",
        overflow: "hidden",
        borderRadius: "inherit",
        isolation: "isolate",
        boxShadow: `0 0 15px ${color}22`, // Using the color for a subtle, premium glow
    };
}