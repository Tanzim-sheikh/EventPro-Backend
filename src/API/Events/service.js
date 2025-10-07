import mongoose from "mongoose";
import OrganizerSchema from "../../modules/OrganiSchema.js";
import Event from "../../modules/EventsSchema.js";
import Booking from "../../modules/BookingSchema.js";

// Mark events as completed when their date/time has passed
const syncCompletedEvents = async () => {
  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  // 1) Any upcoming event with date strictly before today -> completed
  await Event.updateMany(
    { status: "upcoming", date: { $lt: startOfToday } },
    { $set: { status: "completed" } }
  );

  // 2) For today's upcoming events, check time string if present
  const endOfToday = new Date(startOfToday);
  endOfToday.setDate(endOfToday.getDate() + 1);

  const todaysUpcoming = await Event.find({
    status: "upcoming",
    date: { $gte: startOfToday, $lt: endOfToday },
  }).select({ _id: 1, date: 1, time: 1 });

  const toComplete = [];
  for (const ev of todaysUpcoming) {
    try {
      const base = new Date(ev.date);
      let hours = 0, minutes = 0;
      if (ev.time && typeof ev.time === "string") {
        // Parse formats like "HH:MM", "H:MM", or with AM/PM: "hh:mm AM"
        const t = ev.time.trim().toUpperCase();
        const ampm = t.endsWith("AM") || t.endsWith("PM") ? t.slice(-2) : null;
        const hm = t.replace(/\s*(AM|PM)\s*$/i, "");
        const [hStr, mStr = "0"] = hm.split(":");
        let h = parseInt(hStr, 10);
        const m = parseInt(mStr, 10) || 0;
        if (!Number.isNaN(h)) {
          if (ampm) {
            if (ampm === "AM") {
              if (h === 12) h = 0;
            } else if (ampm === "PM") {
              if (h !== 12) h += 12;
            }
          }
          hours = Math.max(0, Math.min(23, h));
          minutes = Math.max(0, Math.min(59, m));
        }
      }
      base.setHours(hours, minutes, 0, 0);
      if (base <= now) toComplete.push(ev._id);
    } catch {}
  }

  if (toComplete.length) {
    await Event.updateMany(
      { _id: { $in: toComplete } },
      { $set: { status: "completed" } }
    );
  }
};

export const OrganizerCreateEventService = async (organizerId, payload) => {
  try {
    const organizer = await OrganizerSchema.findById(organizerId);
    if (!organizer) {
      throw new Error("Organizer not found");
    }

    const {
      eventName,
      date,
      time,
      city,
      address,
      organizerName,
      tickets,
      price,
      description,
      status,
      eventPhoto,
    } = payload || {};

    const missing = [];
    if (!eventName) missing.push("eventName");
    if (!date) missing.push("date");
    if (!time) missing.push("time");
    if (!city) missing.push("city");
    if (!address) missing.push("address");
    if (tickets === undefined) missing.push("tickets");
    if (price === undefined) missing.push("price");
    if (!description) missing.push("description");
    if (missing.length) {
      throw new Error(`Missing required fields: ${missing.join(", ")}`);
    }

    const eventDoc = await Event.create({
      eventName,
      date: new Date(date),
      time,
      city,
      address,
      organizerName: organizerName || organizer.Name,
      tickets,
      price,
      description,
      ...(eventPhoto ? { eventPhoto } : {}),
      createdBy: organizer._id,
      ...(status ? { status } : {}),
    });

    return { success: true, message: "Event created successfully", data: eventDoc };
  } catch (error) {
    console.error("Organizer Create Event Error:", error);
    throw error;
  }
};

export const OrganizerEventsService = async (organizerId) => {
  try {
    await syncCompletedEvents();
    const events = await Event.find({ createdBy: organizerId, status: "upcoming" });
    return { success: true, data: events };
  } catch (error) {
    console.error("Organizer Events Error:", error);
    throw error;
  }
};

// Public endpoints (no auth)
export const PublicEventsService = async (q = "") => {
  try {
    await syncCompletedEvents();
    const query = String(q).trim();
    const text = query
      ? {
          $or: [
            { eventName: { $regex: query, $options: "i" } },
            { city: { $regex: query, $options: "i" } },
            { address: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
          ],
        }
      : {};
    const events = await Event.find({ status: "upcoming", ...text }).sort({ date: 1 }).limit(24);
    return { success: true, data: events };
  } catch (error) {
    console.error("Public Events Error:", error);
    throw error;
  }
};

export const LatestEventsService = async (limit = 8) => {
  try {
    await syncCompletedEvents();
    const n = Number(limit) || 8;
    const events = await Event.find({ status: "upcoming" }).sort({ date: 1 }).limit(n);
    return { success: true, data: events };
  } catch (error) {
    console.error("Latest Events Error:", error);
    throw error;
  }
};

export const AllEventsService = async () => {
  try {
    await syncCompletedEvents();
    const events = await Event.find();
    const organizerIds = events.map((event) => event.createdBy);
    
    return { success: true, data: events, organizerIds };
  } catch (error) {
    console.error("All Events Error:", error);
    throw error;
  }
};

export const OrganizerPastEventsService = async (organizerId) => {
  try {
    await syncCompletedEvents();
    if (!organizerId) throw new Error("Organizer not authenticated");

    const orgObjectId = new mongoose.Types.ObjectId(organizerId);

    // Completed events created by this organizer
    const events = await Event.find({ createdBy: organizerId, status: "completed" }).lean();

    // Aggregate sales from bookings by eventId for this organizer
    const sales = await Booking.aggregate([
      { $match: { organizerId: orgObjectId } },
      {
        $group: {
          _id: "$eventId",
          ticketsSold: { $sum: { $ifNull: ["$ticketCount", 0] } },
          revenue: { $sum: { $ifNull: ["$totalAmount", 0] } },
        },
      },
    ]);

    const salesMap = new Map(sales.map((s) => [String(s._id), { ticketsSold: s.ticketsSold || 0, revenue: s.revenue || 0 }]));

    const result = events.map((ev) => {
      const s = salesMap.get(String(ev._id)) || { ticketsSold: 0, revenue: 0 };
      return { ...ev, ticketsSold: s.ticketsSold, revenue: s.revenue };
    });

    // Sort by most recent completed first
    result.sort((a, b) => new Date(b.date) - new Date(a.date));

    return { success: true, data: result };
  } catch (error) {
    console.error("Organizer Past Events Error:", error);
    throw error;
  }
};

export const UpdateEventService = async (eventId, payload) => {
  try {
    const event = await Event.findById(eventId);
    if (!event) {
      throw new Error("Event not found");
    }
    const updatedEvent = await Event.findByIdAndUpdate(eventId, payload, { new: true });
    return { success: true, data: updatedEvent };
  } catch (error) {
    console.error("Update Event Error:", error);
    throw error;
  }
};

export const DeleteEventService = async (eventId) => {
  try {
    const event = await Event.findById(eventId);
    if (!event) {
      throw new Error("Event not found");
    }
    await Event.findByIdAndDelete(eventId);
    return { success: true, message: "Event deleted successfully" };
  } catch (error) {
    console.error("Delete Event Error:", error);
    throw error;
  }
};

export const EventByIdService = async (eventId) => {
  try {
    const event = await Event.findById(eventId);
    if (!event) {
      throw new Error("Event not found");
    }
    return { success: true, data: event };
  } catch (error) {
    console.error("Event By Id Error:", error);
    throw error;
  }
};