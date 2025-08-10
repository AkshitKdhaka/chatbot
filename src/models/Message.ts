// src/models/Message.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  role: "user" | "assistant" | string;
  content: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  role: { type: String, required: true },
  content: { type: String, required: true },
  metadata: { type: Schema.Types.Mixed, required: false },
  createdAt: { type: Date, default: Date.now },
});

// IMPORTANT: the third argument is the exact collection name in MongoDB
export default mongoose.models.Message ||
  mongoose.model<IMessage>("Message", MessageSchema, "data");
