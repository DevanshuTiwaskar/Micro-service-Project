import express from "express"
import cors from "cors"
import notificationRouter from './routers/notification.routes.js'


const app = express()

app.use(express.json())
app.use(cors({
  origin: "http://localhost:5173", // frontend origin
  credentials: true, // allow cookies if you use them
}));



app.use('/api/notification',notificationRouter)

export default app
 