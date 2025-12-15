const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const makeAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const email = 'admin@gmail.com';
        const user = await User.findOne({ email });

        // Use findOneAndUpdate to avoid any save hook issues
        const updatedUser = await User.findOneAndUpdate(
            { email }, 
            { role: 'admin' },
            { new: true, runValidators: true }
        );

        if (updatedUser) {
            console.log(`SUCCESS: Updated ${updatedUser.name} (${updatedUser.email}) to role: ADMIN`);
        } else {
            console.log('Update failed');
        }
        
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

makeAdmin();
