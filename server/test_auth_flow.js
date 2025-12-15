const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/auth';
const TEST_EMAIL = `auth_test_${Date.now()}@example.com`;
const TEST_PASSWORD = 'password123';

const runAuthTest = async () => {
    console.log('🔄 Starting Full Auth Flow Test...');

    try {
        // 1. REGISTER
        console.log(`\n1️⃣ Testing Registration (${TEST_EMAIL})...`);
        const regRes = await axios.post(`${BASE_URL}/register`, {
            name: 'Auth Test User',
            email: TEST_EMAIL,
            password: TEST_PASSWORD,
            role: 'recruiter'
        });
        if (regRes.data.success && regRes.data.token) {
            console.log('✅ Registration PASSED. Token received.');
        } else {
            console.error('❌ Registration FAILED:', regRes.data);
            process.exit(1);
        }

        // 2. LOGIN
        console.log('\n2️⃣ Testing Login...');
        const loginRes = await axios.post(`${BASE_URL}/login`, {
            email: TEST_EMAIL,
            password: TEST_PASSWORD
        });
        if (loginRes.data.success && loginRes.data.token) {
            console.log('✅ Login PASSED. Token received.');
        } else {
            console.error('❌ Login FAILED:', loginRes.data);
            process.exit(1);
        }

        const token = loginRes.data.token;

        // 3. GET ME (Protected Route)
        console.log('\n3️⃣ Testing Protected Route (/me)...');
        const meRes = await axios.get(`${BASE_URL}/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        if (meRes.data.success && meRes.data.data.email === TEST_EMAIL) {
            console.log('✅ Protected Route PASSED. User data verified.');
        } else {
            console.error('❌ Protected Route FAILED:', meRes.data);
            process.exit(1);
        }

        console.log('\n🎉 ALL AUTH CHECKS PASSED!');

    } catch (error) {
        console.error('\n❌ CRITICAL ERROR:', error.response ? error.response.data : error.message);
    }
};

runAuthTest();
