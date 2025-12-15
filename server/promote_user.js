const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const promoteUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const email = process.argv[2]; // Get email from command line argument

        if (!email) {
            console.log('Please provide an email address. Usage: node promote_user.js <email>');
            process.exit(1);
        }

        const user = await User.findOne({ email });

        if (!user) {
            console.log(`User not found with email: ${email}`);
            process.exit(1);
        }

        user.role = 'recruiter';
        await user.save();

        console.log(`SUCCESS: User ${user.name} (${user.email}) is now a RECRUITER.`);
        process.exit(0);

    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

promoteUser();
