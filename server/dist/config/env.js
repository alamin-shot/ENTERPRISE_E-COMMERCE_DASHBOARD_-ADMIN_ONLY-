"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
require("dotenv/config");
function requireEnv(key) {
    const val = process.env[key];
    if (!val)
        throw new Error(`Missing required env variable: ${key}`);
    return val;
}
exports.env = {
    port: parseInt(process.env["PORT"] ?? "5000", 10),
    nodeEnv: process.env["NODE_ENV"] ?? "development",
    mongoUri: requireEnv("MONGODB_URI"),
    jwtSecret: requireEnv("JWT_SECRET"),
    jwtRefreshSecret: requireEnv("JWT_REFRESH_SECRET"),
    jwtExpiresIn: process.env["JWT_EXPIRES_IN"] ?? "15m",
    jwtRefreshExpiresIn: process.env["JWT_REFRESH_EXPIRES_IN"] ?? "7d",
    smtpHost: process.env["SMTP_HOST"] ?? "smtp.gmail.com",
    smtpPort: parseInt(process.env["SMTP_PORT"] ?? "587", 10),
    smtpUser: process.env["SMTP_USER"] ?? "",
    smtpPass: process.env["SMTP_PASS"] ?? "",
    smtpFrom: process.env["SMTP_FROM"] ?? "noreply@enterprise.com",
    clientUrl: process.env["CLIENT_URL"] ?? "http://localhost:3000",
    seedAdminEmail: process.env["SEED_ADMIN_EMAIL"] ?? "admin@enterprise.com",
    seedAdminPassword: process.env["SEED_ADMIN_PASSWORD"] ?? "Admin@123",
    isProd: process.env["NODE_ENV"] === "production",
    isDev: process.env["NODE_ENV"] !== "production",
};
