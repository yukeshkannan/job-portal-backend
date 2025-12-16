const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create transporter
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com', 
        port: 587, // STARTTLS
        secure: false,
        auth: {
            user: process.env.SMTP_EMAIL,
    // 1. Try Brevo (Sendinblue) API - Bypasses SMTP Port Blocking
    if (process.env.BREVO_API_KEY) {
        try {
            const response = await axios.post(
                'https://api.brevo.com/v3/smtp/email',
                {
                    sender: { 
                        name: process.env.FROM_NAME || 'NextHire Admin', 
                        email: process.env.SMTP_EMAIL 
                    },
                    to: [{ email: options.email }],
                    subject: options.subject,
                    htmlContent: options.message,
                },
                {
                    headers: {
                        'api-key': process.env.BREVO_API_KEY,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                }
            );
            console.log('✅ Email sent via Brevo API');
            return;
        } catch (error) {
            console.error('❌ Brevo API Failed:', error.response?.data || error.message);
            // Continue to Fallback Logger...
        }
    }

    // 2. Fallback Logger (If API Key missing or fails)
    console.log('\n================ FALLBACK EMAIL LOG ================');
    console.log('TO: ', options.email);
    console.log('SUBJECT: ', options.subject);
    console.log('MESSAGE: \n', options.message);
    console.log('====================================================\n');
    if (!process.env.BREVO_API_KEY) {
        console.log('ℹ️ Tip: Add BREVO_API_KEY in Render to send real emails.');
    }
};

module.exports = sendEmail;
