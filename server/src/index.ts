import { connectDB } from "./config/db";
import { env } from "./config/env";
import app from "./app";

async function start(): Promise<void> {
  await connectDB();

  const server = app.listen(env.port, () => {
    console.log(`🚀 Server running on http://localhost:${env.port}`);
    console.log(`📦 Environment: ${env.nodeEnv}`);
    console.log(`🔗 Client URL:  ${env.clientUrl}`);
  });

  // ─── Graceful Shutdown ─────────────────────────────────────────────────────
  const shutdown = async (signal: string) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      const { disconnectDB } = await import("./config/db");
      await disconnectDB();
      console.log("✅ Server closed.");
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => void shutdown("SIGTERM"));
  process.on("SIGINT", () => void shutdown("SIGINT"));

  process.on("unhandledRejection", (reason) => {
    console.error("Unhandled Rejection:", reason);
    process.exit(1);
  });
}

void start();
