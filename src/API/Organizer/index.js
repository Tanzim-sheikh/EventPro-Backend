import express from 'express';
import {OrganizerSignup, OrganizerLogin, 
  OrganizerProfile, OrganizerEmailVerify, 
  OrganizerForgotPassword, OrganizerResetPassword, 
  } from '../Organizer/controller.js';
import { protect, authorize } from '../../helper/common/authMiddleware.js';
import upload from '../../helper/middleware/upload.js';

const OrganizerRoutes = express.Router();

//Organizer
OrganizerRoutes.post("/OrganizerSignup",upload.fields([{ name: 'profilePhoto', maxCount: 1 },{ name: 'aadharDoc', maxCount: 1 },{ name: 'panDoc', maxCount: 1 },{ name: 'gstDoc', maxCount: 1 },]),OrganizerSignup)
OrganizerRoutes.post("/OrganizerLogin", OrganizerLogin)
OrganizerRoutes.post("/OrganizerEmailVerify", OrganizerEmailVerify)
OrganizerRoutes.put("/OrganizerForgotPassword", OrganizerForgotPassword)
OrganizerRoutes.put("/OrganizerResetPassword", OrganizerResetPassword)
OrganizerRoutes.get("/OrganizerProfile", protect, authorize("organizer"), OrganizerProfile)

export default OrganizerRoutes;