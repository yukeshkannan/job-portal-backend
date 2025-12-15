const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const checkUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const email = 'admin@gmail.com';
        const user = await User.findOne({ email });

        if (user) {
            console.log(`FOUND: User with email ${email} exists.`);
            console.log(user);
        } else {
            console.log(`NOT FOUND: No user with email ${email}.`);
        }
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkUser();
