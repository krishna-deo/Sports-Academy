const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const verifyAdminToken = require('./middleware/auth');

const authRoutes = require('./routes/authRoutes');
const publicRoutes = require('./routes/publicRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB().then(() => {
  const Student = require('./models/Student');
  const User = require('./models/User');

  // Set default role of existing users to superadmin
  User.updateMany({ role: { $exists: false } }, { $set: { role: 'superadmin' } })
    .then(r => { if (r.modifiedCount > 0) console.log(`Seeded roles for ${r.modifiedCount} users.`); })
    .catch(err => console.error("Migration error for user roles:", err));

  // Auto-heal/migrate old student documents
  Student.find({ studentId: { $exists: false } })
    .then(async (oldStudents) => {
      if (oldStudents.length > 0) {
        console.log(`Running migration for ${oldStudents.length} legacy student documents...`);
        for (const student of oldStudents) {
          const calculatedAge = student.age || 18;
          const approxDOB = new Date();
          approxDOB.setFullYear(approxDOB.getFullYear() - calculatedAge);
          approxDOB.setMonth(5);
          approxDOB.setDate(15);

          student.studentId = student.id;
          student.fullName = student.name;
          student.dateOfBirth = approxDOB;
          student.primarySport = student.sport || 'Football';
          student.admissionDate = student.joined ? new Date(student.joined) : new Date();
          student.status = 'Active';
          student.isDeleted = false;
          student.showOnPublicWebsite = true;
          
          await student.save();
        }
        console.log("Legacy student database migration completed successfully.");
      }
    })
    .catch(err => console.error("Migration error for students schema:", err));
});

// Middleware
app.use(cors());
app.use(express.json());
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Secure HTTP Headers injection
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Route Mountings
app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/admin', verifyAdminToken, adminRoutes);

// Serve static assets from the React build in production
app.use(express.static(path.join(__dirname, '../dist')));

// Fallback to React index.html for Single Page App routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Server Listen
app.listen(PORT, () => {
  console.log(`RLBSA Secure MongoDB Backend running on port ${PORT}`);
});
