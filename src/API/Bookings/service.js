import Booking from "../../modules/BookingSchema.js";
import Event from "../../modules/EventsSchema.js";
import Organizer from "../../modules/OrganiSchema.js";
import User from "../../modules/userSchema.js";
import { BookingConfirmedUser, BookingConfirmedOrganizer } from "../../helper/config/mailer.js";

export const CreateBookingService = async (payload = {}) => {
  try {
    const { eventId, ticketCount, userId } = payload;
    let { organizerId } = payload;

    if (!eventId || !ticketCount || !userId) {
      throw new Error("Missing required fields: eventId, ticketCount, userId");
    }

    const event = await Event.findById(eventId);
    if (!event) {
      throw new Error("Event not found");
    }

    if (event.tickets < ticketCount) {
      throw new Error("Not enough tickets");
    }

    // derive organizerId from event if not provided
    if (!organizerId) organizerId = event.createdBy;

    // fetch related docs for denormalized fields
    const [organizerDoc, userDoc] = await Promise.all([
      Organizer.findById(organizerId),
      User.findById(userId),
    ]);

    // always compute amount from event.price
    const amount = (Number(event.price) || 0) * Number(ticketCount);

    const booking = await Booking.create({
      eventId,
      organizerId,
      ticketCount,
      userId,
      totalAmount: amount,
      // denormalized fields
      organizerName: organizerDoc?.Name || undefined,
      organizerNumber: organizerDoc?.phoneNumber || undefined,
      eventName: event?.eventName || undefined,
      eventDate: event?.date || undefined,
      eventTime: event?.time || undefined,
      userName: userDoc?.name || undefined,
    });

    // decrement available tickets
    event.tickets = Number(event.tickets) - Number(ticketCount);
    await event.save();
   
    // prepare human-friendly schedule (no GMT) using event's own date/time
    const formattedEventDate = event?.date
      ? new Date(event.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      : '';
    const formattedEventTime = event?.time
      ? event.time
      : (event?.date ? new Date(event.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) : '');

    // send emails
    await BookingConfirmedUser(
      userDoc?.email,
      userDoc?.name,
      event?.eventName,
      formattedEventDate,
      formattedEventTime,
      ticketCount,
      amount
    );
    await BookingConfirmedOrganizer(
      organizerDoc?.email,
      organizerDoc?.Name, // schema uses capital N for organizer name
      userDoc?.name,
      event?.eventName,
      formattedEventDate,
      formattedEventTime,
      ticketCount,
      amount
    );
    return { success: true, message: "Booking created successfully", data: booking };
  } catch (error) {
    console.error("Create Booking Error:", error);
    throw error;
  }
};

export const AdminAllBookingsService = async (payload = {}) => {
  try {
    const bookings = await Booking.find();
    return { success: true, message: "Bookings fetched successfully", data: bookings };
  } catch (error) {
    console.error("Admin All Events Error:", error);
    throw error;
  }
};

export const OrganizerBookingsService = async (payload = {}) => {
  try {
    const { organizerId } = payload;
    if (!organizerId) {
      throw new Error("Missing required fields: organizerId");
    }
    const bookings = await Booking.find({ organizerId });
    return { success: true, message: "Bookings fetched successfully", data: bookings };
  } catch (error) {
    console.error("Organizer All Events Error:", error);
    throw error;
  }
};

export const UserAllBookingsService = async (payload = {}) => {
  try {
    const { userId } = payload;
    if (!userId) {
      throw new Error("Missing required fields: userId");
    }
    const bookings = await Booking.find({ userId });
    return { success: true, message: "Bookings fetched successfully", data: bookings };
  } catch (error) {
    console.error("User All Events Error:", error);
    throw error;
  }
};
