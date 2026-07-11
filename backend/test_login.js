import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import User from './models/User.js';

try {
  dns.setServers(['1.1.1.1', '8.8.8.8']);
} catch (dnsErr) {
  console.warn('DNS override failed:', dnsErr.message);
}

dotenv.config();

const uri = process.env.MONGODB_URI;

async function test() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(uri);
    console.log('Connected!');

    const email = 'admin@crm.com';
    const password = 'password123';

    console.log(`Searching for user with email: ${email}`);
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      console.log('Error: User not found in database!');
      return;
    }

    console.log('User found:', {
      _id: user._id,
      name: user.name,
      email: user.email,
      passwordHash: user.password
    });

    console.log('Comparing password "password123"...');
    const isMatch = await user.comparePassword(password);
    console.log(`comparePassword result: ${isMatch}`);

  } catch (err) {
    console.error('Test error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
}

test();
