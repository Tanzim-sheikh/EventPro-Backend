import express from 'express';
import {OrganizerSignup, OrganizerLogin, OrganizerProfile} from '../Organizer/controller.js';
import { protect } from '../../helper/common/authMiddleware.js';

const OrganizerRoutes = express.Router();

OrganizerRoutes.post("/OrganizerSignup", OrganizerSignup)
OrganizerRoutes.post("/OrganizerLogin", OrganizerLogin)
OrganizerRoutes.get("/OrganizerProfile", protect, OrganizerProfile)
export default OrganizerRoutes;