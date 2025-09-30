import express from "express";
import { protect, authorize } from '../../helper/common/authMiddleware.js';
import { AllUsers, AllOrganizers, NotVerifiedOrganizers, VerifyOrganizer, RejectOrganizer } from './controller.js';

const adminRoutes = express.Router();

// Only "admin" should access these routes
adminRoutes.get("/AllUsers", protect, authorize("admin"), AllUsers);
adminRoutes.get("/AllOrganizers", protect, authorize("admin"), AllOrganizers);
adminRoutes.get("/NotVerifiedOrganizers", protect, authorize("admin"), NotVerifiedOrganizers);
adminRoutes.put("/VerifyOrganizer/:id", protect, authorize("admin"), VerifyOrganizer);
adminRoutes.delete("/RejectOrganizer/:id", protect, authorize("admin"), RejectOrganizer);

export default adminRoutes;
