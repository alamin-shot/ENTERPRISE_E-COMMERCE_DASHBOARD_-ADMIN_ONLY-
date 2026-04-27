// Fix #3 — drawCharacter split into focused sub-functions
// Fix #5 — frameTime passed in, Date.now() removed from draw functions

export const drawTrack = (
    ctx: CanvasRenderingContext2D,
    width: number,
    groundY: number,
): void => {
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#00ffff";
    ctx.strokeStyle = "#00ffff";
    ctx.lineWidth = 2;

    for (let x = 0; x < width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, groundY - 10);
        ctx.lineTo(x, groundY + 10);
        ctx.stroke();
    }

    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(width, groundY);
    ctx.strokeStyle = "#ff00ff";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.shadowBlur = 0;
};

export const drawCoins = (
    ctx: CanvasRenderingContext2D,
    coins: { x: number; collected: boolean }[],
    scrollX: number,
    groundY: number,
    width: number,
    // Fix #5 — frameTime from animation loop instead of Date.now()
    frameTime: number,
): void => {
    coins.forEach((coin, i) => {
        if (coin.collected) return;
        const screenX = coin.x - scrollX;
        if (screenX <= -50 || screenX >= width + 50) return;

        const coinY = groundY - 40 + Math.sin(frameTime * 0.005 + i) * 10;
        ctx.shadowColor = "#ffcc00";
        ctx.fillStyle = "#ffcc00";
        ctx.beginPath();
        ctx.ellipse(screenX, coinY, 12, 14, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#ffff00";
        ctx.beginPath();
        ctx.ellipse(screenX, coinY, 6, 7, 0, 0, Math.PI * 2);
        ctx.fill();
    });
};

export const drawObstacles = (
    ctx: CanvasRenderingContext2D,
    obstacles: { x: number; width: number; height: number }[],
    scrollX: number,
    groundY: number,
    width: number,
): void => {
    obstacles.forEach((obs) => {
        const screenX = obs.x - scrollX;
        if (screenX <= -50 || screenX >= width + 50) return;

        const obsY = groundY - obs.height;
        ctx.shadowColor = "#ff44ff";
        ctx.fillStyle = "#ff44ff";
        ctx.fillRect(screenX, obsY, obs.width, obs.height);
        ctx.fillStyle = "#ff88ff";
        ctx.fillRect(screenX + 5, obsY + 5, obs.width - 10, 8);
        ctx.fillRect(screenX + 5, obsY + 15, obs.width - 10, 8);
    });
};

// ─── Sub-functions for drawCharacter (Fix #3) ────────────────────────────────

const drawBody = (ctx: CanvasRenderingContext2D, x: number, y: number): void => {
    ctx.fillStyle = "#ff4444";
    ctx.fillRect(x, y + 15, 60, 35);
};

const drawHead = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    isTyping: boolean,
): void => {
    ctx.fillStyle = "#ffcc00";
    ctx.fillRect(x + 5, y, 50, 25);
    // whites of eyes
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x + 15, y + 8, 10, 8);
    ctx.fillRect(x + 35, y + 8, 10, 8);
    // pupils shift when typing
    const eyeShift = isTyping ? 3 : 0;
    ctx.fillStyle = "#000000";
    ctx.fillRect(x + 17 + eyeShift, y + 10, 5, 5);
    ctx.fillRect(x + 37 + eyeShift, y + 10, 5, 5);
};

const drawHat = (ctx: CanvasRenderingContext2D, x: number, y: number): void => {
    ctx.fillStyle = "#ff0000";
    ctx.fillRect(x - 5, y - 8, 70, 12);
    ctx.fillRect(x + 15, y - 18, 30, 15);
};

const drawLimbs = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    frame: number,
): void => {
    const armSwing = Math.sin(frame * 0.2) * 12;
    const legSwing = Math.sin(frame * 0.2) * 10;

    ctx.fillStyle = "#ff4444";
    // arms
    ctx.fillRect(x - 12, y + 20 + armSwing, 15, 10);
    ctx.fillRect(x + 57, y + 20 - armSwing, 15, 10);
    // legs
    ctx.fillStyle = "#cc0000";
    ctx.fillRect(x + 10, y + 48 + legSwing, 15, 15);
    ctx.fillRect(x + 35, y + 48 - legSwing, 15, 15);
};

const drawShadow = (
    ctx: CanvasRenderingContext2D,
    x: number,
    groundY: number,
): void => {
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.fillRect(x - 5, groundY - 5, 70, 15);
};

const drawSuccessStars = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    // Fix #5 — frameTime instead of Date.now()
    frameTime: number,
): void => {
    ctx.fillStyle = "#ffff00";
    for (let i = 0; i < 8; i++) {
        ctx.fillRect(
            x - 20 + i * 12,
            y - 30 + Math.sin(frameTime * 0.01 + i) * 15,
            4,
            4,
        );
    }
};

// Fix #3 — orchestrator calls focused sub-functions
export const drawCharacter = (
    ctx: CanvasRenderingContext2D,
    // Fix #6 — charX comes from CHAR_X constant via caller
    charX: number,
    charYOffset: number,
    groundY: number,
    frame: number,
    isTyping: boolean,
    isSuccess: boolean,
    frameTime: number,
): void => {
    const y = groundY - 55 + charYOffset;

    drawShadow(ctx, charX, groundY);
    drawBody(ctx, charX, y);
    drawHead(ctx, charX, y, isTyping);
    drawHat(ctx, charX, y);
    drawLimbs(ctx, charX, y, frame);

    if (isSuccess) {
        drawSuccessStars(ctx, charX, y, frameTime);
    }
};

// ─── HUD overlays ─────────────────────────────────────────────────────────────

export const drawBumpFlash = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
): void => {
    ctx.fillStyle = "rgba(255, 0, 255, 0.4)";
    ctx.fillRect(0, 0, width, height);
};

export const drawCollectBurst = (
    ctx: CanvasRenderingContext2D,
    charX: number,
    charYOffset: number,
    groundY: number,
): void => {
    ctx.fillStyle = "#ffff00";
    ctx.shadowColor = "#ffcc00";
    const baseY = groundY - 55 + charYOffset;
    for (let i = 0; i < 12; i++) {
        ctx.fillRect(charX + 20 + i * 5, baseY - 20, 3, 3);
    }
};

export const drawHUD = (
    ctx: CanvasRenderingContext2D,
    score: number,
    isTyping: boolean,
): void => {
    ctx.fillStyle = "#00ffff";
    ctx.font = "bold 28px monospace";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#00ffff";
    ctx.fillText(`SCORE: ${score}`, 20, 50);

    if (isTyping) {
        ctx.fillStyle = "#ff00ff";
        ctx.font = "14px monospace";
        ctx.fillText("► TYPING...", 20, 90);
    }
    ctx.shadowBlur = 0;
};