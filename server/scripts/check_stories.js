require('dotenv').config({ path: '../.env' });
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const mongoose = require('mongoose');
const SuccessStory = require('../models/SuccessStory');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://krishnasinghhaji26_db_user:UiXTvIEJs8l5ehjP@cluster0.3gnkbbd.mongodb.net/';

async function check() {
  try {
    await mongoose.connect(MONGODB_URI);
    const stories = await SuccessStory.find({});
    console.log("SUCCESS STORIES IN DATABASE:");
    console.log(JSON.stringify(stories.map(s => ({ id: s.id, name: s.name, medals: s.medals })), null, 2));
  } catch (err) {
    console.error("Connection error:", err);
  } finally {
    await mongoose.connection.close();
  }
}

check();
