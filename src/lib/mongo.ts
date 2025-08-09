import mongoose from "mongoose";

export async function connectMongo() {
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  if (mongoose.connections[0]?.readyState === 1) {
    const dbName = mongoose.connection.db?.databaseName || "<unknown>";
    console.log(`ℹ️ Already connected to MongoDB database: ${dbName}`);
    return;
  }

  if (!process.env.MONGODB_URI) {
    console.error("❌ MONGODB_URI is not set in environment");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    const dbName = mongoose.connection.db?.databaseName || "<unknown>";
    console.log(`✅ Connected to MongoDB database: ${dbName}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }
}
