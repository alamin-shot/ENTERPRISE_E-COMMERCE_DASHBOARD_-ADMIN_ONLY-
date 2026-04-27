import { Coin, Obstacle } from "@/types/neonRunner.types";

export const generateCoins = (): Coin[] => {
    const coins: Coin[] = [];
    for (let i = 0; i < 25; i++) {
        coins.push({ x: 200 + i * 100, collected: false });
    }
    return coins;
};

export const generateObstacles = (): Obstacle[] => {
    const obstacles: Obstacle[] = [];
    for (let i = 0; i < 10; i++) {
        obstacles.push({ x: 300 + i * 200, width: 30, height: 45 });
    }
    return obstacles;
};

export const updateCoinsAndObstacles = (
    coins: Coin[],
    obstacles: Obstacle[],
    scrollX: number,
): { updatedCoins: Coin[]; updatedObstacles: Obstacle[] } => {
    const newCoins = coins.filter((coin) => coin.x > scrollX - 500);
    if (newCoins.length < 15) {
        const lastCoin = newCoins[newCoins.length - 1];
        const lastX = lastCoin ? lastCoin.x : scrollX + 500;
        for (let i = 0; i < 5; i++) {
            newCoins.push({ x: lastX + 150 + i * 100, collected: false });
        }
    }

    const newObstacles = obstacles.filter((obs) => obs.x > scrollX - 500);
    if (newObstacles.length < 6) {
        const lastObstacle = newObstacles[newObstacles.length - 1];
        const lastX = lastObstacle ? lastObstacle.x : scrollX + 500;
        newObstacles.push({ x: lastX + 250, width: 30, height: 45 });
    }

    return { updatedCoins: newCoins, updatedObstacles: newObstacles };
};