import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

export async function connectDB(): Promise<void> {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is missing");
  }

  if (mongoose.connection.readyState >= 1) return;

  await mongoose.connect(MONGODB_URI);
}
