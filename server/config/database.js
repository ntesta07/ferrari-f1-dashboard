import mongoose from "mongoose";

let databaseReady = false;

export async function connectDatabase() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.warn("MongoDB connection skipped: MONGO_URI is not set.");
    return false;
  }

  try {
    await mongoose.connect(mongoUri);
    databaseReady = true;
    console.log("MongoDB connected.");
    return true;
  } catch (error) {
    databaseReady = false;
    console.warn(`MongoDB connection failed: ${error.message}`);
    return false;
  }
}

export function isDatabaseReady() {
  return databaseReady && mongoose.connection.readyState === 1;
}
