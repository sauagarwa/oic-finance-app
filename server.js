import express from "express";
import path from "path";
import cors from "cors";
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();
import records from "./routes/record.js";
import { createProxyMiddleware } from 'http-proxy-middleware';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import authRoutes from './routes/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log(`NODE_ENV: ${process.env.NODE_ENV}`);

const app = express();
const PORT = process.env.PORT || 5050;
const VITE_PORT = process.env.VITE_PORT || 5173;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : `http://localhost:${VITE_PORT}`,
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
// API routes
app.use('/api', (req, res, next) => {
  console.log(`API Request: ${req.method} ${req.url}`);
  next();
});

app.use('/api/auth', authRoutes);
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use("/record", records);

// Development: Proxy all non-API requests to Vite dev server
if (process.env.NODE_ENV !== 'production') {
  app.use(
    '/',
    createProxyMiddleware({
      target: `http://localhost:${VITE_PORT}`,
      changeOrigin: true,
      ws: true,
      // Don't proxy /api requests
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      filter: (pathname) => !pathname.startsWith('/api'),
    })
  );
} else {
  // Production: Serve static files
  app.use(express.static(path.join(__dirname, '/client/dist')));
  
  // Handle React routing in production
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(__dirname, './client/dist/index.html'));
    }
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Proxying non-API requests to http://localhost:${VITE_PORT}`);
  }
});