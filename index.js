import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './src/helper/config/mongoDB.js'
import mongoose from 'mongoose'
import userRoutes from './src/API/user/index.js'
// import authorRoutes from './src/API/author/index.js'
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
app.use("/User",userRoutes)
// app.use("/Author", authorRoutes)

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
    console.log(`HTTP server running on http://localhost:${PORT}`)
})