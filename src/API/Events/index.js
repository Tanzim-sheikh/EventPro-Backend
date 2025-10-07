import express from "express";
import { protect, authorize } from "../../helper/common/authMiddleware.js";
import upload from "../../helper/middleware/upload.js";
import { OrganizerCreateEvent, OrganizerEvents, AllEvents, PublicEvents, LatestEvents, UpdateEvent, DeleteEvent, EventById, OrganizerPastEvents } from "./controller.js";

const eventRoutes = express.Router();

// Organizer-scoped Events endpoints
eventRoutes.post("/OrganizerCreateEvent", protect, authorize("organizer"), upload.single("eventPhoto"), OrganizerCreateEvent);
eventRoutes.get("/OrganizerEvents", protect, authorize("organizer"), OrganizerEvents);
eventRoutes.get("/OrganizerPastEvents", protect, authorize("organizer"), OrganizerPastEvents);
eventRoutes.get("/AllEvents", protect, authorize("admin"), AllEvents);
eventRoutes.get("/EventById/:id", protect, authorize("user", "organizer", "admin"), EventById);
// Allow both organizer and admin to update/delete; require :id param
eventRoutes.patch("/UpdateEvent/:id", protect, authorize("organizer", "admin"), UpdateEvent);
eventRoutes.delete("/DeleteEvent/:id", protect, authorize("organizer", "admin"), DeleteEvent);

// Public (no auth)
eventRoutes.get("/PublicEvents", PublicEvents);
eventRoutes.get("/LatestEvents", LatestEvents);

export default eventRoutes;