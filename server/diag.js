require('dotenv').config();
const mongoose = require('mongoose');

console.log("Diag: Loading .env...");
console.log("PORT:", process.env.PORT);
console.log("MONGO_URI length:", process.env.MONGO_URI ? process.env.MONGO_URI.length : 'undefined');
console.log("SMTP_HOST:", process.env.SMTP_HOST);

if (!process.env.MONGO_URI) {
    console.error("ERROR: MONGO_URI is missing!");
    process.exit(1);
}

console.log("Diag: Testing DB connection...");
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Diag: DB Connected Successfully!");
        process.exit(0);
    })
    .catch(err => {
        console.error("Diag: DB Connection Failed:", err.message);
        process.exit(1);
    });
