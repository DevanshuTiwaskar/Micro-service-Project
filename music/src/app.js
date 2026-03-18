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

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://aura-frontend-omq4.onrender.com",
  "http://localhost:5173",
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use('/api/music', musicRoutes);




export default app;