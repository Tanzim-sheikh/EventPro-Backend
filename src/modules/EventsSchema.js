
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
      required: true,
      min: 0, // tickets kabhi negative na ho
    },
    price: {
      type: Number,
      required: true,
      min: 0, // free event bhi ho sakta hai (0 Rs)
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Organizer ka reference (User schema se link)
      required: true,
    },
    status: {
      type: String,
      enum: ["upcoming", "completed", "cancelled"],
      default: "upcoming",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
