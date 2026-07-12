import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';
import mongoose from 'mongoose';

// Configurations & Database Setup
import connectDB from './config/database.js';

// Route files
import authRoutes from './routes/authRoutes.js';
import leadRoutes from './routes/leadRoutes.js';

// Global Error Handler
import errorHandler from './middleware/errorHandler.js';

// MongoDB Input Sanitizer (Express 5-compatible custom implementation)
import mongoSanitize from './middleware/mongoSanitize.js';

// Load environment variables
dotenv.config();

// Hoist NODE_ENV to module scope so it is available before middleware registration.
// This prevents a ReferenceError when the CORS callback fires during startup.
const NODE_ENV = process.env.NODE_ENV || 'development';

// Create Express Application
const app = express();

// 1. Environment variables check function on startup
// NOTE: PORT is intentionally excluded — Railway injects PORT as a runtime
// environment variable (not via .env), so checking for it at startup would
// cause the server to crash on Railway. PORT falls back to 5000 locally.
const checkRequiredEnvVars = () => {
  const requiredEnv = ['MONGODB_URI', 'JWT_SECRET'];
  const missing = requiredEnv.filter((envVar) => !process.env[envVar]);

  if (missing.length > 0) {
    console.error(
      `CRITICAL CONFIG ERROR: Missing required environment variable(s): ${missing.join(', ')}`
    );
    process.exit(1);
  }
};

// 2. Apply Security Middlewares & Limiters
app.use(helmet());

// Rate Limiting Config
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later.'
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many auth attempts.'
});

app.use('/api/', generalLimiter);
app.use('/api/auth/', authLimiter);

// 3. Configure CORS
// FRONTEND_URL must be set as an environment variable on Railway to your exact
// Vercel deployment URL, e.g.: https://startup-crm-lite.vercel.app
// Multiple origins can be specified by separating them with a comma:
//   FRONTEND_URL=https://startup-crm-lite.vercel.app,https://startup-crm-lite-git-main.vercel.app
const rawFrontendUrls = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((u) => u.trim())
  .filter(Boolean);

// Always include localhost for local development regardless of env
const allowedOrigins = [
  ...rawFrontendUrls,
  'http://localhost:5173',
  'http://localhost:3000',
].filter((v, i, a) => a.indexOf(v) === i); // deduplicate

console.log(`[CORS] Allowed origins: ${allowedOrigins.join(', ')}`);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, Postman, Railway health checks)
      if (!origin) return callback(null, true);

      // In development, allow any localhost origin (any port)
      if (NODE_ENV === 'development' && /^https?:\/\/localhost(:\d+)?$/.test(origin)) {
        return callback(null, true);
      }

      // Allow any Vercel preview deployment for this project
      // Pattern: https://<project>-<hash>-<owner>.vercel.app
      if (/^https:\/\/startup-crm-lite[a-zA-Z0-9-]*\.vercel\.app$/.test(origin)) {
        return callback(null, true);
      }

      // Allow if origin matches explicit whitelist
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      callback(new Error(`CORS: Origin "${origin}" is not allowed.`));
    },
    credentials: true
  })
);

// 4. HTTP Request Logging
if (NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// 5. Request Body Parsers
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// 6. MongoDB Input Sanitization (must run after body parsers)
// Strips `$`-prefixed keys and `.`-containing keys to prevent NoSQL injection.
// Custom implementation — express-mongo-sanitize is incompatible with Express 5
// because it mutates req.query which is now a read-only getter.
app.use(mongoSanitize);

// 7. Register Application Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

// 8. Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date(),
    environment: NODE_ENV,
    allowedOrigins
  });
});

// 9. Global Error Handler
app.use(errorHandler);

// Start Server
// Railway injects PORT at runtime — do not require it in .env
const PORT = process.env.PORT || 5000;

let server;

const startServer = async () => {
  checkRequiredEnvVars();

  await connectDB();

  server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${NODE_ENV} mode`);
  });
};

startServer();

// Graceful Shutdown
const gracefulShutdown = async (signal) => {
  console.log(`Received ${signal}. Server shutting down gracefully`);

  if (server) {
    server.close(() => {
      console.log('HTTP server closed.');
    });
  }

  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed cleanly.');
    process.exit(0);
  } catch (err) {
    console.error('Error during database disconnection:', err);
    process.exit(1);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));