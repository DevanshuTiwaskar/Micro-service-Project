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
  "https://aura-frontend-omq4.onrender.com",
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
}));

app.use('/api/music', musicRoutes);




export default app;