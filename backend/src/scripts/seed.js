/**
 * Seed Script — populates MongoDB with a demo user and 60 sample expenses
 * Usage: node src/scripts/seed.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Expense = require('../models/Expense');

const CATEGORIES = [
  'Food & Dining', 'Transport', 'Shopping', 'Entertainment',
  'Health', 'Utilities', 'Travel', 'Education', 'Housing', 'Other'
];

const SAMPLE_EXPENSES = [
  { title: 'Grocery Shopping', category: 'Food & Dining', amount: 1850 },
  { title: 'Uber to Office', category: 'Transport', amount: 250 },
  { title: 'Netflix Subscription', category: 'Entertainment', amount: 649 },
  { title: 'Electricity Bill', category: 'Utilities', amount: 1200 },
  { title: 'Amazon - Shoes', category: 'Shopping', amount: 2499 },
  { title: 'Doctor Visit', category: 'Health', amount: 500 },
  { title: 'Flight to Mumbai', category: 'Travel', amount: 4500 },
  { title: 'Online Course - React', category: 'Education', amount: 1999 },
  { title: 'Rent Payment', category: 'Housing', amount: 12000 },
  { title: 'Coffee & Snacks', category: 'Food & Dining', amount: 320 },
  { title: 'Bus Pass - Monthly', category: 'Transport', amount: 800 },
  { title: 'Mobile Recharge', category: 'Utilities', amount: 399 },
  { title: 'Zomato Order', category: 'Food & Dining', amount: 480 },
  { title: 'Petrol', category: 'Transport', amount: 1100 },
  { title: 'Gym Membership', category: 'Health', amount: 1500 },
  { title: 'Bookstore', category: 'Education', amount: 650 },
  { title: 'Restaurant Dinner', category: 'Food & Dining', amount: 1200 },
  { title: 'Rapido Ride', category: 'Transport', amount: 120 },
  { title: 'Spotify Premium', category: 'Entertainment', amount: 119 },
  { title: 'Internet Bill', category: 'Utilities', amount: 799 },
  { title: 'Flipkart - Headphones', category: 'Shopping', amount: 1799 },
  { title: 'Pharmacy', category: 'Health', amount: 340 },
  { title: 'Hotel Booking', category: 'Travel', amount: 3200 },
  { title: 'Society Maintenance', category: 'Housing', amount: 1500 },
  { title: 'Weekend Brunch', category: 'Food & Dining', amount: 780 },
  { title: 'Ola Cab', category: 'Transport', amount: 350 },
  { title: 'Prime Video', category: 'Entertainment', amount: 299 },
  { title: 'Gas Cylinder', category: 'Utilities', amount: 900 },
  { title: 'New Clothes', category: 'Shopping', amount: 3500 },
  { title: 'Blood Test', category: 'Health', amount: 750 },
];

function randomDate(monthsBack) {
  const now = new Date();
  const past = new Date(now.getFullYear(), now.getMonth() - monthsBack, 1);
  return new Date(past.getTime() + Math.random() * (now.getTime() - past.getTime()));
}

async function seed() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not set. Copy backend/.env.example to backend/.env and set MONGODB_URI.');
    }
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Clear existing demo data
    const demoEmail = 'demo@xpense.app';
    const existing = await User.findOne({ email: demoEmail });
    if (existing) {
      await Expense.deleteMany({ user: existing._id });
      await User.deleteOne({ _id: existing._id });
      console.log('🗑️  Cleared existing demo data');
    }

    // Create demo user
    const user = await User.create({
      name: 'Demo User',
      email: demoEmail,
      password: await bcrypt.hash('demo1234', 12),
      currency: 'INR',
    });
    console.log(`👤 Created demo user: ${demoEmail} / demo1234`);

    // Create 60 expenses spread over last 6 months
    const expenses = [];
    for (let i = 0; i < 60; i++) {
      const sample = SAMPLE_EXPENSES[i % SAMPLE_EXPENSES.length];
      expenses.push({
        user: user._id,
        title: sample.title,
        category: sample.category,
        amount: sample.amount + Math.floor(Math.random() * 200 - 100),
        date: randomDate(6),
        note: i % 5 === 0 ? 'Sample expense note' : '',
      });
    }
    await Expense.insertMany(expenses);
    console.log(`💰 Created ${expenses.length} sample expenses`);
    console.log('\n✨ Seed complete! Login with: demo@xpense.app / demo1234');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
