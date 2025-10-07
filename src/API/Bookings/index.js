import express from "express";
import { protect, authorize } from "../../helper/common/authMiddleware.js";
import { CreateBooking, AdminAllBookings, UserAllBookings, OrganizerBookings } from "./controller.js";

const bookingRoutes = express.Router();

const safeHandler = (name, fn) => (req, res, next) => {
  if (typeof fn === "function") return fn(req, res, next);
  console.error(`[Bookings] Route handler missing or invalid: ${name}`);
  return res.status(500).json({ success: false, message: `Handler not available: ${name}` });
};

// Create a booking (user only)
bookingRoutes.post("/CreateBooking", protect, authorize("user"), safeHandler("CreateBooking", CreateBooking));
bookingRoutes.get("/AdminAll", protect, authorize("admin"), safeHandler("AdminAllBookings", AdminAllBookings));
bookingRoutes.get("/OrganizerBookings", protect, authorize("organizer"), safeHandler("OrganizerBookings", OrganizerBookings));
bookingRoutes.get("/UserAllBookings", protect, authorize("user"), safeHandler("UserAllBookings", UserAllBookings));
export default bookingRoutes;
