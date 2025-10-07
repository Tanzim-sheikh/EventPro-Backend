import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true
    },
    organizerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organizer",
        required: true
    },
    // Denormalized fields for quick reads
    organizerName: { type: String },
    organizerNumber: { type: String },
    eventName: { type: String },
    eventDate: { type: Date },
    eventTime: { type: String },
    ticketCount: {
        type: Number,
        required: true
    },
    userName: {
        type: String,
        required: false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    userPhone: {
        type: String,
        required: false
    },
    totalAmount: {
        type: Number,
        required: true
    }
});

const Booking = mongoose.model("Booking", BookingSchema);

export default Booking;
