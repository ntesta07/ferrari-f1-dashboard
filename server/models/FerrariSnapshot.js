import mongoose from "mongoose";

const ferrariSnapshotSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    season: {
      type: String,
      required: true,
      trim: true,
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const FerrariSnapshot =
  mongoose.models.FerrariSnapshot ||
  mongoose.model("FerrariSnapshot", ferrariSnapshotSchema);
