import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';

// Ensure environment variables are loaded
dotenv.config();

/**
 * Establishes a connection to the MongoDB database using Mongoose.
 * Sets up custom DNS servers to bypass potential Windows/local ISP resolution issues with SRV records.
 */
const connectDB = async () => {
  try {
    // Configure DNS resolver to query Cloudflare and Google DNS for SRV record lookup resolution.
    // This prevents the 'querySrv ECONNREFUSED' error seen on standard local ISP resolvers.
    try {
      dns.setServers(['1.1.1.1', '8.8.8.8']);
    } catch (dnsErr) {
      console.warn('Warning: Failed to set custom DNS servers, relying on default resolver:', dnsErr.message);
    }

    // Note: Legacy options 'useNewUrlParser' and 'useUnifiedTopology' are always true/enabled
    // by default in modern Mongoose (v6+) and will throw an error if passed in modern versions.
    const mongooseOptions = {
      // Add any modern mongoose options here if necessary
    };

    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in the environment variables');
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, mongooseOptions);

    console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

export default connectDB;