"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
exports.disconnectDB = disconnectDB;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
async function connectDB() {
    try {
        mongoose_1.default.set("strictQuery", true);
        await mongoose_1.default.connect(env_1.env.mongoUri, {
            dbName: "enterprise_dashboard",
        });
        console.log(`✅ MongoDB connected: ${mongoose_1.default.connection.host}`);
        mongoose_1.default.connection.on("error", (err) => {
            console.error("MongoDB connection error:", err);
        });
        mongoose_1.default.connection.on("disconnected", () => {
            console.warn("MongoDB disconnected. Attempting to reconnect...");
        });
    }
    catch (error) {
        console.error("❌ MongoDB connection failed:", error);
        process.exit(1);
    }
}
async function disconnectDB() {
    await mongoose_1.default.connection.close();
    console.log("MongoDB disconnected gracefully.");
}
