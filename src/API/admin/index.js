import express from "express"
import {protect} from '../../helper/common/authMiddleware.js';
import { AllUsers, AllOrganizers } from './controller.js';
const adminRoutes = express.Router();

// adminRoutes.get("/AdminProfile", protect, adminProfile);

adminRoutes.get("/AllUsers", protect, AllUsers);
adminRoutes.get("/AllOrganizers", protect, AllOrganizers)

export default adminRoutes;