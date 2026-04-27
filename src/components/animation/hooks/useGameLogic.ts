"use client";

import { useRef, useEffect, useCallback } from "react";
import { Coin, Obstacle, CHAR_X } from "@/types/neonRunner.types";
import {
    generateCoins,
    generateObstacles,
    updateCoinsAndObstacles,
} from "../utils/gameUtils";

interface UseGameLogicProps {
    isTyping: boolean;
    isSuccess: boolean;
    isError: boolean;
    mode: "login" | "register";
}

export interface GameRefs {
    scrollXRef: React.MutableRefObject<number>;
    charYRef: React.MutableRefObject<number>;
    frameRef: React.MutableRefObject<number>;
    // Fix #1 & #4 — score/bump/collect as refs, not state
    // canvas reads them directly — no React re-renders triggered
    scoreRef: React.MutableRefObject<number>;
    showBumpRef: React.MutableRefObject<boolean>;
    showCollectRef: React.MutableRefObject<boolean>;
    coinsRef: React.MutableRefObject<Coin[]>;
    obstaclesRef: React.MutableRefObject<Obstacle[]>;
    updateGame: (deltaTime: number) => void;
}

export const useGameLogic = ({
    isTyping,
    isSuccess,
    isError,
    mode,
}: UseGameLogicProps): GameRefs => {
    const scrollXRef = useRef(0);
    const charYRef = useRef(0);
    const isJumpingRef = useRef(false);
    const jumpVelocityRef = useRef(0);
    const frameRef = useRef(0);

    // Fix #1 — was React state, now refs: no effect restarts on every coin
    const scoreRef = useRef(0);
    // Fix #4 — was React state, now refs: canvas reads directly, zero re-renders
    const showBumpRef = useRef(false);
    const showCollectRef = useRef(false);

    const coinsRef = useRef<Coin[]>([]);
    const obstaclesRef = useRef<Obstacle[]>([]);

    // Timeout refs for cleanup
    const bumpTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const collectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const successTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const clearBumpTimeout = () => {
        if (bumpTimeoutRef.current) clearTimeout(bumpTimeoutRef.current);
    };

    const triggerBump = (duration = 300) => {
        clearBumpTimeout();
        showBumpRef.current = true;
        bumpTimeoutRef.current = setTimeout(() => {
            showBumpRef.current = false;
        }, duration);
    };

    // Initialize game objects
    useEffect(() => {
        coinsRef.current = generateCoins();
        obstaclesRef.current = generateObstacles();
    }, []);

    // Mode switch — trigger bump flash
    useEffect(() => {
        triggerBump(300);
        return clearBumpTimeout;
    }, [mode]);

    // Success — character bounce
    useEffect(() => {
        if (!isSuccess) return;
        charYRef.current = -25;
        if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
        successTimeoutRef.current = setTimeout(() => {
            charYRef.current = 0;
        }, 500);
        return () => {
            if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
        };
    }, [isSuccess]);

    // Error — bump flash
    useEffect(() => {
        if (!isError) return;
        triggerBump(300);
        return clearBumpTimeout;
    }, [isError]);

    // updateGame — runs every animation frame
    const updateGame = useCallback(
        (deltaTime: number) => {
            const speed = isTyping ? 0.8 : 2.5;
            scrollXRef.current += speed * deltaTime * 0.06;

            // Jump physics
            if (isJumpingRef.current) {
                jumpVelocityRef.current += 0.8;
                charYRef.current += jumpVelocityRef.current;
                if (charYRef.current >= 0) {
                    charYRef.current = 0;
                    isJumpingRef.current = false;
                    jumpVelocityRef.current = 0;
                }
            }

            // Coin collision — Fix #6: uses CHAR_X constant
            coinsRef.current.forEach((coin) => {
                if (coin.collected) return;
                const screenX = coin.x - scrollXRef.current;
                if (Math.abs(screenX - CHAR_X) < 40 && !isJumpingRef.current) {
                    coin.collected = true;
                    scoreRef.current += 10;
                    // Fix #4 — direct ref mutation, no setState
                    showCollectRef.current = true;
                    if (collectTimeoutRef.current)
                        clearTimeout(collectTimeoutRef.current);
                    collectTimeoutRef.current = setTimeout(() => {
                        showCollectRef.current = false;
                    }, 200);
                }
            });

            // Obstacle collision — Fix #6: uses CHAR_X constant
            obstaclesRef.current.forEach((obs) => {
                const screenX = obs.x - scrollXRef.current;
                const distance = Math.abs(screenX - CHAR_X);

                // Auto-jump when approaching
                if (
                    distance < 50 &&
                    distance > 0 &&
                    !isJumpingRef.current &&
                    !isTyping
                ) {
                    isJumpingRef.current = true;
                    jumpVelocityRef.current = -10;
                }

                // Bump flash on close contact
                if (distance < 35 && charYRef.current === 0) {
                    triggerBump(150);
                }
            });

            // Recycle off-screen coins and obstacles
            const { updatedCoins, updatedObstacles } = updateCoinsAndObstacles(
                coinsRef.current,
                obstaclesRef.current,
                scrollXRef.current,
            );
            coinsRef.current = updatedCoins;
            obstaclesRef.current = updatedObstacles;

            frameRef.current += deltaTime * 0.008;
        },
        [isTyping],
    );

    return {
        scrollXRef,
        charYRef,
        frameRef,
        scoreRef,
        showBumpRef,
        showCollectRef,
        coinsRef,
        obstaclesRef,
        updateGame,
    };
};