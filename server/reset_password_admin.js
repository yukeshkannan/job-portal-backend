const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const resetPassword = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const email = 'admin@gmail.com';
        const newPassword = 'admin@1234';

        const user = await User.findOne({ email });

        if (!user) {
            console.log('User not found');
            process.exit(1);
        }

        // Setting password directly will trigger the pre-save hook to hash it
        user.password = newPassword;
        await user.save();

        console.log(`SUCCESS: Password for ${email} has been reset to: ${newPassword}`);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

resetPassword();
