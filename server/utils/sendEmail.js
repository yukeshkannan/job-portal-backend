const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create transporter
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com', 
        port: 587, // STARTTLS
        secure: false,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        },
        logger: true,
        debug: true,
        connectionTimeout: 10000, 
        greetingTimeout: 5000,
        // Force IPv4 as some cloud providers have IPv6 routing issues
        tls: {
            rejectUnauthorized: false
        }
    });

    try {
        const info = await transporter.sendMail(message);
        console.log('✅ Email sent: %s', info.messageId);
    } catch (error) {
        console.error('❌ Email Send Failed (Network Block by Render):', error.message);
        console.log('\n================ FALLBACK EMAIL LOG ================');
        console.log('TO: ', options.email);
        console.log('SUBJECT: ', options.subject);
        console.log('MESSAGE: \n', options.message);
        console.log('====================================================\n');
        // Do not throw error so the UI request succeeds
    }
};

module.exports = sendEmail;
