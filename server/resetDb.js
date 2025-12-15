const mongoose = require('mongoose');
require('dotenv').config();

// Load Models
const User = require('./models/User');
const Job = require('./models/Job');
const Candidate = require('./models/Candidate');
const Interview = require('./models/Interview'); // Assuming this exists or will exist

const resetDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('🔌 MongoDB Connected...');

        console.log('🗑️  Deleting Data...');
        
        await User.deleteMany();
        console.log('✅ Users Deleted');

        await Job.deleteMany();
        console.log('✅ Jobs Deleted');

        await Candidate.deleteMany();
        console.log('✅ Candidates Deleted');

        // await Interview.deleteMany(); 
        // console.log('✅ Interviews Deleted');

        console.log('✨ Database Reset Successfully! You can now register fresh accounts.');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

resetDb();
