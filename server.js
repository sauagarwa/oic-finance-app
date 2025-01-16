import express from "express";
import path from "path";
import cors from "cors";
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();
<<<<<<< HEAD
import records from "./routes/record.js";
import { createProxyMiddleware } from 'http-proxy-middleware';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import authRoutes from './routes/auth.js';
=======
import { createProxyMiddleware } from 'http-proxy-middleware';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import recordRoutes from "./routes/record.js";
import authRoutes from "./routes/auth.js";
>>>>>>> f301fda (Added the capability to run client and server in a single service)

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
<<<<<<< HEAD
app.use(cookieParser());
app.use(express.json());
// API routes
app.use('/api', (req, res, next) => {
  console.log(`API Request: ${req.method} ${req.url}`);
  next();
});

app.use('/api/auth', authRoutes);
=======
app.use(cookieParser('82e4e438a0705fabf61f9854e3b575af'));
app.use(express.json());
// API routes
// app.use('/api', (req, res, next) => {
//   console.log(`API Request: ${req.method} ${req.url}`);
//   next();
// });

app.use('/api/auth/', authRoutes);
app.use("/api/record", recordRoutes);

// app.get('/api/auth/signup', (req, res) => {
//   console.log(" in signup ")
//   res.json({ status: 'ok' });
// });

>>>>>>> f301fda (Added the capability to run client and server in a single service)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

<<<<<<< HEAD
app.use("/record", records);
=======
// const auth = basicAuth({
//   users: {
//     admin: '123',
//     user: '456',
//   },
// });

// app.get('/api/auth/signup', (req, res) => {
//   try {
//     let newUser = {
//       username: req.body.username,
//       email: req.body.email,
//       password: req.body.password,
//     };
//     let collection = await db.collection("records");
//     let result = await collection.insertOne(newDocument);
//     res.send(result).status(204);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error adding record");
//   }
//   console.log("authenticating");
//   console.log(req.auth.user);

//   if (req.auth.user === 'admin') {
//     res.cookie('name', 'admin', options).send({ screen: 'admin' });
//   } else if (req.auth.user === 'user') {
//     res.cookie('name', 'user', options).send({ screen: 'user' });
//   }
// });

// app.get('/api/auth/login', auth, (req, res) => {
//   const options = {
//     httpOnly: true,
//     signed: true,
//   };
//   console.log("authenticating");
//   console.log(req.auth.user);

//   if (req.auth.user === 'admin') {
//     res.cookie('name', 'admin', options).send({ screen: 'admin' });
//   } else if (req.auth.user === 'user') {
//     res.cookie('name', 'user', options).send({ screen: 'user' });
//   }
// });

// app.get('/api/auth/read-cookie', (req, res) => {
//   console.log("reading cookie");
//   console.log(req.signedCookies);
//   if (req.signedCookies.name === 'admin') {
//     res.send({ screen: 'admin' });
//   } else if (req.signedCookies.name === 'user') {
//     res.send({ screen: 'user' });
//   } else {
//     res.send({ screen: 'auth' });
//   }
// });

// app.get('/api/auth/logout', (req, res) => {
//   console.log("clearing cookie");
//   res.clearCookie('name').end();
// });

// app.get('/api/auth/me', (req, res) => {
//   console.log("getting data");
//   if (req.signedCookies.name === 'admin') {
//     res.send('This is admin panel');
//   } else if (req.signedCookies.name === 'user') {
//     res.send('This is user data');
//   } else {
//     res.end();
//   }
// });
>>>>>>> f301fda (Added the capability to run client and server in a single service)

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