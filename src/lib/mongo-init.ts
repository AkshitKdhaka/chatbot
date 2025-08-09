// src/lib/mongo-init.ts
import { connectMongo } from "./mongo";

// Try to connect now (will log success or error)
connectMongo().catch(err => {
  // This catch is optional; connectMongo already logs errors.
  console.error("Mongo init failed:", err);
});
