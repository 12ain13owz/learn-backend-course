import express from 'express'
import { config } from 'dotenv'
import { connectDB } from './config/db.js'
import { startServer } from './utils/server.util.js'

import authRoutes from './routes/auth.routes.js'
import moveRoutes from './routes/movie.routes.js'
import watchListRoutes from './routes/watchlist.routes.js'

config()
await connectDB()

const app = express()
const PORT = 3000

// Body parsing middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// API Routes
app.use('/auth', authRoutes)
app.use('/movies', moveRoutes)
app.use('/watchlist', watchListRoutes)

startServer(app, PORT)
