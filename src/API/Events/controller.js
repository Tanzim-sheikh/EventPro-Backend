import { OrganizerCreateEventService, OrganizerEventsService, AllEventsService, PublicEventsService, LatestEventsService, UpdateEventService, DeleteEventService, EventByIdService, OrganizerPastEventsService } from "./service.js";
import { uploadBufferToCloudinary } from "../../helper/config/cloudinaryUpload.js";

export const OrganizerCreateEvent = async (req, res) => {
  try {
    const organizerId = req.user?.id;
    if (!organizerId) {
      return res.status(401).json({ success: false, message: "Organizer not authenticated" });
    }

    let payload = { ...req.body };
    if (req.file?.buffer) {
      try {
        const uploaded = await uploadBufferToCloudinary(req.file.buffer, "app/uploads/events");
        payload.eventPhoto = { url: uploaded.secure_url, public_id: uploaded.public_id };
      } catch (err) {
        console.error("Event photo upload failed:", err?.message || err);
        return res.status(400).json({ success: false, message: "Event photo upload failed" });
      }
    }

    const result = await OrganizerCreateEventService(organizerId, payload);
    res.status(200).json(result);
  } catch (error) {
    console.error("Organizer Create Event Error:", error);
    res.status(400).json({ message: error.message });
  }
};

export const OrganizerEvents = async (req, res) => {
  try {
    const organizerId = req.user?.id;
    if (!organizerId) {
      return res.status(401).json({ success: false, message: "Organizer not authenticated" });
    }
    const result = await OrganizerEventsService(organizerId);
    res.status(200).json(result);
  } catch (error) {
    console.error("Organizer Events Error:", error);
    res.status(400).json({ message: error.message });
  }
};

export const AllEvents = async (req, res) => {
  try {
    const result = await AllEventsService();
    res.status(200).json(result);
  } catch (error) {
    console.error("All Events Error:", error);
    res.status(400).json({ message: error.message });
  }
};

export const PublicEvents = async (req, res) => {
  try {
    const q = req.query.q || "";
    const result = await PublicEventsService(q);
    res.status(200).json(result);
  } catch (error) {
    console.error("Public Events Error:", error);
    res.status(400).json({ message: error.message });
  }
};

export const LatestEvents = async (req, res) => {
  try {
    const limit = req.query.limit || 8;
    const result = await LatestEventsService(limit);
    res.status(200).json(result);
  } catch (error) {
    console.error("Latest Events Error:", error);
    res.status(400).json({ message: error.message });
  }
};

export const OrganizerPastEvents = async (req, res) => {
  try {
    const organizerId = req.user?.id;
    if (!organizerId) {
      return res.status(401).json({ success: false, message: "Organizer not authenticated" });
    }
    const result = await OrganizerPastEventsService(organizerId);
    res.status(200).json(result);
  } catch (error) {
    console.error("Organizer Past Events Error:", error);
    res.status(400).json({ message: error.message });
  }
};

export const UpdateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const result = await UpdateEventService(eventId, req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error("Update Event Error:", error);
    res.status(400).json({ message: error.message });
  }
};

export const DeleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const result = await DeleteEventService(eventId);
    res.status(200).json(result);
  } catch (error) {
    console.error("Delete Event Error:", error);
    res.status(400).json({ message: error.message });
  }
};

export const EventById = async (req, res) => {
  try {
    const eventId = req.params.id;
    const result = await EventByIdService(eventId);
    res.status(200).json(result);
  } catch (error) {
    console.error("Event By Id Error:", error);
    res.status(400).json({ message: error.message });
  }
};