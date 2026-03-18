import express from "express"
import cors from "cors"
import notificationRouter from './routers/notification.routes.js'


const app = express()

app.use(express.json())
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://aura-frontend-omq4.onrender.com",
  "http://localhost:5173",
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));



app.use('/api/notification',notificationRouter)

export default app
 