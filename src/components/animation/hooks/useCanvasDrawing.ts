"use client";

import { useRef, useEffect } from "react";
import { CHAR_X, MOBILE_BREAKPOINT } from "@/types/neonRunner.types";
import {
    drawTrack,
    drawCoins,
    drawObstacles,
    drawCharacter,
    drawBumpFlash,
    drawCollectBurst,
    drawHUD,
} from "../utils/drawingUtils";
import { GameRefs } from "./useGameLogic";

interface UseCanvasDrawingProps extends GameRefs {
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    isTyping: boolean;
    isSuccess: boolean;
}

export const useCanvasDrawing = ({
    canvasRef,
    scrollXRef,
    charYRef,
    frameRef,
    scoreRef,
    showBumpRef,
    showCollectRef,
    coinsRef,
    obstaclesRef,
    isTyping,
    isSuccess,
    updateGame,
}: UseCanvasDrawingProps): void => {
    const animationRef = useRef<number>(0);
    const isTypingRef = useRef(isTyping);
    const isSuccessRef = useRef(isSuccess);


    useEffect(() => {
        isTypingRef.current = isTyping;
    }, [isTyping]);

    useEffect(() => {
        isSuccessRef.current = isSuccess;
    }, [isSuccess]);


    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const isMobile = window.innerWidth < MOBILE_BREAKPOINT;

        const setCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        setCanvasSize();

        // Fix #2 — debounced resize: rapid resizing no longer kills the loop
        let resizeTimer: ReturnType<typeof setTimeout> | null = null;
        const handleResize = () => {
            if (resizeTimer) clearTimeout(resizeTimer);
            resizeTimer = setTimeout(setCanvasSize, 150);
        };
        window.addEventListener("resize", handleResize);

        let lastTime = 0;

        const animate = (currentTime: number) => {
            // Fix #5 — frameTime flows from RAF timestamp, not Date.now() inside draw
            const frameTime = currentTime;
            const delta = Math.min(50, currentTime - (lastTime || currentTime));
            lastTime = currentTime;

            updateGame(delta);

            const groundY = canvas.height - 80;

            // Background
            ctx.fillStyle = "#0a0a1a";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            if (!isMobile) {
                drawTrack(ctx, canvas.width, groundY);
            } else {
                ctx.strokeStyle = "#ff00ff";
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(0, groundY);
                ctx.lineTo(canvas.width, groundY);
                ctx.stroke();
            }

            drawCoins(
                ctx,
                coinsRef.current,
                scrollXRef.current,
                groundY,
                canvas.width,
                frameTime,
            );

            drawObstacles(
                ctx,
                obstaclesRef.current,
                scrollXRef.current,
                groundY,
                canvas.width,
            );

            drawCharacter(
                ctx,
                CHAR_X,
                charYRef.current,
                groundY,
                frameRef.current,
                isTypingRef.current,
                isSuccessRef.current,
                frameTime,
            );

            if (showBumpRef.current) {
                drawBumpFlash(ctx, canvas.width, canvas.height);
            }

            if (showCollectRef.current) {
                drawCollectBurst(ctx, CHAR_X, charYRef.current, groundY);
            }

            drawHUD(ctx, scoreRef.current, isTypingRef.current);

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationRef.current);
            window.removeEventListener("resize", handleResize);
            if (resizeTimer) clearTimeout(resizeTimer);
        };
    }, [
        canvasRef,
        updateGame,
        scrollXRef,
        charYRef,
        frameRef,
        scoreRef,
        showBumpRef,
        showCollectRef,
        coinsRef,
        obstaclesRef,
    ]);
};