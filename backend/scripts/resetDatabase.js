/**
 * resetDatabase.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Phase B12A – Complete Database Reset Script
 *
 * PURPOSE:
 *   Connects to MongoDB Atlas using the same URI as the application server,
 *   deletes ALL documents from the 'users' and 'leads' collections, verifies
 *   both collections are empty, then prints a final report.
 *
 * USAGE:
 *   node backend/scripts/resetDatabase.js
 *   (run from the project root, or from the backend/ directory)
 *
 * SAFETY:
 *   - Does NOT drop the collections (preserves indexes)
 *   - Does NOT modify any application code
 *   - Prints counts before and after deletion for full transparency
 * ─────────────────────────────────────────────────────────────────────────────
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import dns from 'dns';

// ── Resolve .env path relative to this script (works from any cwd) ──────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../.env') });

// ── Colour helpers for terminal output ──────────────────────────────────────
const GREEN  = '\x1b[32m';
const RED    = '\x1b[31m';
const YELLOW = '\x1b[33m';
const CYAN   = '\x1b[36m';
const BOLD   = '\x1b[1m';
const RESET  = '\x1b[0m';

const log = {
  info:    (msg) => console.log(`${CYAN}[INFO]${RESET}  ${msg}`),
  success: (msg) => console.log(`${GREEN}${BOLD}[OK]${RESET}    ${msg}`),
  warn:    (msg) => console.log(`${YELLOW}[WARN]${RESET}  ${msg}`),
  error:   (msg) => console.log(`${RED}${BOLD}[ERROR]${RESET} ${msg}`),
  divider: ()    => console.log(`${CYAN}${'─'.repeat(60)}${RESET}`),
  header:  (msg) => console.log(`\n${BOLD}${CYAN}${msg}${RESET}\n`),
};

// ── Main reset function ──────────────────────────────────────────────────────
const resetDatabase = async () => {
  log.header('Phase B12A – Startup CRM Database Reset');
  log.divider();

  // 1. Validate MONGODB_URI exists
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    log.error('MONGODB_URI is not defined in backend/.env — aborting.');
    process.exit(1);
  }

  log.info(`Target URI: ${MONGODB_URI.replace(/:([^:@]+)@/, ':****@')}`); // mask password

  // 2. Use Cloudflare/Google DNS to resolve Atlas SRV records (same as database.js)
  try {
    dns.setServers(['1.1.1.1', '8.8.8.8']);
  } catch (dnsErr) {
    log.warn(`Custom DNS setup failed (using default): ${dnsErr.message}`);
  }

  // 3. Connect to MongoDB Atlas
  log.info('Connecting to MongoDB Atlas…');
  try {
    await mongoose.connect(MONGODB_URI);
  } catch (connErr) {
    log.error(`Connection failed: ${connErr.message}`);
    process.exit(1);
  }

  const dbName = mongoose.connection.db.databaseName;
  const host   = mongoose.connection.host;
  log.success(`Connected to: ${host}`);
  log.success(`Database    : ${dbName}`);
  log.divider();

  // 4. Get handles to the raw collections (bypasses Mongoose model validation)
  const db          = mongoose.connection.db;
  const usersCol    = db.collection('users');
  const leadsCol    = db.collection('leads');

  // 5. Count documents BEFORE deletion
  const usersBefore = await usersCol.countDocuments();
  const leadsBefore = await leadsCol.countDocuments();

  log.header('Step 1 – Pre-deletion counts');
  log.info(`Users collection  → ${usersBefore} document(s)`);
  log.info(`Leads collection  → ${leadsBefore} document(s)`);
  log.divider();

  // 6. Delete ALL users
  log.header('Step 2 – Deleting all users');
  let usersDeleted = 0;
  try {
    const usersResult = await usersCol.deleteMany({});
    usersDeleted = usersResult.deletedCount;
    log.success(`Deleted ${usersDeleted} user document(s) from 'users' collection.`);
  } catch (err) {
    log.error(`Failed to delete users: ${err.message}`);
    await mongoose.connection.close();
    process.exit(1);
  }

  // 7. Delete ALL leads
  log.header('Step 3 – Deleting all leads');
  let leadsDeleted = 0;
  try {
    const leadsResult = await leadsCol.deleteMany({});
    leadsDeleted = leadsResult.deletedCount;
    log.success(`Deleted ${leadsDeleted} lead document(s) from 'leads' collection.`);
  } catch (err) {
    log.error(`Failed to delete leads: ${err.message}`);
    await mongoose.connection.close();
    process.exit(1);
  }

  // 8. Verify collections are empty
  log.header('Step 4 – Post-deletion verification');
  const usersAfter = await usersCol.countDocuments();
  const leadsAfter = await leadsCol.countDocuments();

  if (usersAfter === 0) {
    log.success(`Users collection  → 0 documents ✓`);
  } else {
    log.error(`Users collection  → ${usersAfter} document(s) remain! Manual check required.`);
  }

  if (leadsAfter === 0) {
    log.success(`Leads collection  → 0 documents ✓`);
  } else {
    log.error(`Leads collection  → ${leadsAfter} document(s) remain! Manual check required.`);
  }

  // 9. Final report
  log.divider();
  log.header('Final Report');
  console.log(`  Database name          : ${BOLD}${dbName}${RESET}`);
  console.log(`  Collections cleaned    : users, leads`);
  console.log(`  Users deleted          : ${BOLD}${GREEN}${usersDeleted}${RESET}`);
  console.log(`  Leads deleted          : ${BOLD}${GREEN}${leadsDeleted}${RESET}`);
  console.log(`  Users remaining        : ${usersAfter === 0 ? `${GREEN}${BOLD}0 ✓${RESET}` : `${RED}${BOLD}${usersAfter} ✗${RESET}`}`);
  console.log(`  Leads remaining        : ${leadsAfter === 0 ? `${GREEN}${BOLD}0 ✓${RESET}` : `${RED}${BOLD}${leadsAfter} ✗${RESET}`}`);
  log.divider();

  if (usersAfter === 0 && leadsAfter === 0) {
    log.success('Database reset COMPLETE. The application is in a fresh state.');
    log.info('Next steps:');
    log.info('  1. Start the backend  : npm run dev:backend');
    log.info('  2. Start the frontend : npm run dev');
    log.info('  3. Visit /register to create a fresh account');
  } else {
    log.error('Reset INCOMPLETE — some documents remain. Check Atlas manually.');
  }

  log.divider();

  // 10. Close connection cleanly
  await mongoose.connection.close();
  log.info('MongoDB connection closed.');
  process.exit(0);
};

// ── Run ──────────────────────────────────────────────────────────────────────
resetDatabase().catch((err) => {
  console.error('Unhandled error during reset:', err);
  process.exit(1);
});
