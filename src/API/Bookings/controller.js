import { CreateBookingService, UserAllBookingsService, OrganizerBookingsService, AdminAllBookingsService } from "./service.js";

export const CreateBooking = async (req, res) => {
  try {
    const result = await CreateBookingService({ ...req.body, userId: req.user?.id });
    res.status(200).json(result);
  } catch (error) {
    console.error("Create Booking Error:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const AdminAllBookings = async (req, res) => {
  try {
    const result = await AdminAllBookingsService({ ...req.body, userId: req.user?.id });
    res.status(200).json(result);
  } catch (error) {
    console.error("Admin All Events Error:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const OrganizerBookings = async (req, res) => {
  try {
    const result = await OrganizerBookingsService({ organizerId: req.user?.id });
    res.status(200).json(result);
  } catch (error) {
    console.error("Organizer All Events Error:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const UserAllBookings = async (req, res) => {
  try {
    const result = await UserAllBookingsService({ ...req.body, userId: req.user?.id });
    res.status(200).json(result);
  } catch (error) {
    console.error("User All Events Error:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};