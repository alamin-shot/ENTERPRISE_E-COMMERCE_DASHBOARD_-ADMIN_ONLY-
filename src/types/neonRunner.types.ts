export interface Coin {
  x: number;
  collected: boolean;
}

export interface Obstacle {
  x: number;
  width: number;
  height: number;
}

export interface NeonRunnerProps {
  isTyping: boolean;
  isSuccess: boolean;
  isError: boolean;
  mode: "login" | "register";
}

// Fix #6 — single source of truth for character X position
// used in both collision detection and drawing
export const CHAR_X = 130 as const;

// Fix #7 — mobile breakpoint for performance scaling
export const MOBILE_BREAKPOINT = 768 as const;
