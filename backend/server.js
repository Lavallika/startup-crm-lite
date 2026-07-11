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

// Create Express Application
const app = express();

// 1. Environment variables check function on startup
const checkRequiredEnvVars = () => {
  const requiredEnv = ['MONGODB_URI', 'JWT_SECRET', 'PORT'];
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

// 3. Configure CORS with origin whitelist
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://your-app.vercel.app'
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  })
);

// 4. HTTP Request Logging
if (process.env.NODE_ENV === 'production') {
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
    timestamp: new Date()
  });
});

// 9. Global Error Handler
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

let server;

const startServer = async () => {
  checkRequiredEnvVars();

  await connectDB();

  server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${NODE_ENV} mode`);
  });
};

startServer();

// 9. Graceful Shutdown
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