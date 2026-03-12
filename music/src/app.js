import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import musicRoutes from './router/music.routes.js'
import cors from "cors"

const app = express();
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: false }));
app.use(cookieParser());

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",  // your React app URL or production URL
  credentials: true,                // if using cookies or auth headers
}));

app.use('/api/music', musicRoutes);




export default app;