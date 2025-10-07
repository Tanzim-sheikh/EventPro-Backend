
import mongoose from "mongoose";
const eventSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    organizerName: {
      type: String,
      required: true,
      trim: true,
    },
    tickets: {
      type: Number,
    },
    price: {
      type: Number,
      required: true,
      min: 0, // free event bhi ho sakta hai
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    eventPhoto: {
      url: { type: String, default: null },
      public_id: { type: String, default: null }
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organizer", // Organizer model ka reference
      required: true,
    },
    status: {
      type: String,
      enum: ["upcoming", "completed", "cancelled"],
      default: "upcoming",
    },
  },
);

export default mongoose.model("Event", eventSchema);
