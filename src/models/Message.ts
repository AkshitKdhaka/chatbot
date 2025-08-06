import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema = new Schema({
  role: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Message ||
  mongoose.model<IMessage>("Message", MessageSchema);
