const axios = require('axios');

const testRegister = async () => {
    try {
        const res = await axios.post('http://localhost:5000/api/auth/register', {
            name: 'Test Admin',
            email: 'admin@gmail.com',
            password: 'password123',
            role: 'recruiter'
        });
        console.log('✅ Registration Successful:', res.data);
    } catch (err) {
        console.error('❌ Registration Failed:', {
            code: err.code,
            message: err.message,
            stack: err.stack
        });
    }
};

testRegister();
