import express from "express";
import { protect } from "../../helper/common/authMiddleware.js";

const eventRoutes = express.Router();

// eventRoutes.post("/CreateEvent",protect, CreateEvent);

export default eventRoutes;