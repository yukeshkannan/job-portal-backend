const mongoose = require('mongoose');
require('dotenv').config();

const verifyDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ Connected to Atlas: ${mongoose.connection.host}`);
        
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('\n📂 Collections in your database:');
        if (collections.length === 0) {
            console.log('   (No collections found - database might be empty)');
        } else {
            collections.forEach(c => console.log(`   - ${c.name}`));
        }

        // Optional: Count users if 'users' collection exists
        if (collections.find(c => c.name === 'users')) {
            const userCount = await mongoose.connection.db.collection('users').countDocuments();
            console.log(`\n👥 Total Users: ${userCount}`);
        }

        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
};

verifyDb();
