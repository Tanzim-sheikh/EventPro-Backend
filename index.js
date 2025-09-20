import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './src/helper/config/mongoDB.js'
import mongoose from 'mongoose'
import userRoutes from './src/API/user/index.js'
import OrganizerRoutes from './src/API/Organizer/index.js'
import adminRoutes from './src/API/admin/index.js'
import eventRoutes from './src/API/Events/index.js'
dotenv.config()

const app = express()

// Middleware
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Data base Connecting
connectDB()

//Routes
app.post("/", (req, res) => {
    res.send("Ki hall haii !!!")
})
app.use("/User", userRoutes)
app.use("/Organizer", OrganizerRoutes)
app.use("/Admin", adminRoutes)
app.use("/Event", eventRoutes)
const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
    console.log(`HTTP server running on http://localhost:${PORT}`)
})