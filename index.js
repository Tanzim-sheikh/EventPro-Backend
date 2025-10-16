// import express from 'express'
// import cors from 'cors'
// import dotenv from 'dotenv'
// import connectDB from './src/helper/config/mongoDB.js'
// import mongoose from 'mongoose'
// import userRoutes from './src/API/user/index.js'
// import OrganizerRoutes from './src/API/Organizer/index.js'
// import adminRoutes from './src/API/admin/index.js'
// import eventRoutes from './src/API/Events/index.js'
// import bookingRoutes from './src/API/Bookings/index.js'
// dotenv.config()

// const app = express()

// // Middleware
// app.use(cors({
//     origin: ["http://localhost:5173", "https://evenzap.netlify.app"],
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
//     allowedHeaders: ["Content-Type", "Authorization"]
// }))
// app.use(express.json())
// app.use(express.urlencoded({ extended: true }))

// //Data base Connecting
// connectDB()

// //Routes
// app.post("/", (req, res) => {
//     res.send("Ki Hall haii !!!")
// })
// app.use("/User", userRoutes)
// app.use("/Organizer", OrganizerRoutes)
// app.use("/Admin", adminRoutes)
// app.use("/Event", eventRoutes)
// app.use("/Booking", bookingRoutes)
// const PORT = process.env.PORT || 5000

// app.listen(PORT, () => {
//     console.log(`HTTP server running on http://localhost:${PORT}`)
// })

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/helper/config/mongoDB.js";

import userRoutes from "./src/API/user/index.js";
import OrganizerRoutes from "./src/API/Organizer/index.js";
import adminRoutes from "./src/API/admin/index.js";
import eventRoutes from "./src/API/Events/index.js";
import bookingRoutes from "./src/API/Bookings/index.js";

dotenv.config();

const app = express();

// ✅ Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "https://evenzap.netlify.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin"
    ],

  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Database Connection
connectDB();

// ✅ Routes
app.get("/", (req, res) => {
  res.send("✅ Backend is running successfully!");
});

app.use("/User", userRoutes);
app.use("/Organizer", OrganizerRoutes);
app.use("/Admin", adminRoutes);
app.use("/Event", eventRoutes);
app.use("/Booking", bookingRoutes);

// ✅ Export app for Vercel
export default app;
