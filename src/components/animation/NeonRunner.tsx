"use client";

import { useRef } from "react";
import { useGameLogic } from "./hooks/useGameLogic";
import { useCanvasDrawing } from "./hooks/useCanvasDrawing";
import { NeonRunnerProps, MOBILE_BREAKPOINT } from "@/types/neonRunner.types";

export function NeonRunner({
    isTyping,
    isSuccess,
    isError,
    mode,
}: NeonRunnerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const gameRefs = useGameLogic({ isTyping, isSuccess, isError, mode });

    useCanvasDrawing({
        canvasRef,
        isTyping,
        isSuccess,
        ...gameRefs,
    });

    return (
        <>
            <canvas
                ref={canvasRef}
                className="absolute inset-0 h-full w-full"
                style={{ zIndex: 0 }}
                // Fix #7 — aria label for screen readers
                aria-label="Neon runner background animation"
                role="img"
            />
            {/* Fix #7 — mobile hint: show tap-to-jump if on small screen */}
            <p
                className="absolute bottom-24 left-1/2 -translate-x-1/2 text-xs text-cyan-400/50 pointer-events-none select-none"
                style={{
                    display:
                        typeof window !== "undefined" &&
                            window.innerWidth < MOBILE_BREAKPOINT
                            ? "block"
                            : "none",
                    zIndex: 1,
                }}
            >
                tap to jump
            </p>
        </>
    );
}