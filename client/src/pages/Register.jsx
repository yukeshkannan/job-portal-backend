import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, User } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user' // Default to candidate
    });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            return setError("Passwords do not match");
        }

        try {
            // Role is always 'user' (Candidate) for public registration
            await register(formData.name, formData.email, formData.password, 'user');
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div className="auth-page">
            <div className="glass-panel auth-card">
                <div className="auth-header">
                    <h2>Create Account</h2>
                    <p>Join NextHire to find your dream job</p>
                </div>

                {error && <div className="error-alert">{error}</div>}

                <form onSubmit={handleSubmit}>
                     <div className="form-group">
                        <label>Full Name</label>
                        <div className="input-wrapper">
                            <User size={18} className="input-icon" />
                            <input 
                                type="text" 
                                name="name" 
                                value={formData.name} 
                                onChange={handleChange} 
                                placeholder="John Doe" 
                                required 
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Email Address</label>
                        <div className="input-wrapper">
                            <Mail size={18} className="input-icon" />
                            <input 
                                type="email" 
                                name="email" 
                                value={formData.email} 
                                onChange={handleChange} 
                                placeholder="name@company.com" 
                                required 
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <div className="input-wrapper">
                            <Lock size={18} className="input-icon" />
                            <input 
                                type="password" 
                                name="password" 
                                value={formData.password} 
                                onChange={handleChange} 
                                placeholder="Create a password" 
                                required 
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Confirm Password</label>
                        <div className="input-wrapper">
                            <Lock size={18} className="input-icon" />
                            <input 
                                type="password" 
                                name="confirmPassword" 
                                value={formData.confirmPassword} 
                                onChange={handleChange} 
                                placeholder="Confirm your password" 
                                required 
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary full-width">Create Account</button>
                </form>

                <div className="auth-footer">
                    <p>Already have an account? <Link to="/login">Sign in</Link></p>
                </div>
            </div>
            
             <style>{`
                .auth-page {
                    min-height: calc(100vh - 80px); /* Minus Navbar */
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--bg-dark);
                }
                .auth-card {
                    width: 100%;
                    max-width: 450px;
                    padding: 2.5rem;
                    background: white;
                    border: 1px solid #e2e8f0;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                }
                .auth-header {
                    text-align: center;
                    margin-bottom: 2rem;
                }
                .auth-header h2 {
                    font-size: 2rem;
                    margin-bottom: 0.5rem;
                }
                .auth-header p {
                    color: var(--text-secondary);
                }
                .form-group {
                    margin-bottom: 1.5rem;
                }
                .input-wrapper {
                    position: relative;
                }
                .input-icon {
                    position: absolute;
                    left: 1rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--text-secondary);
                }
                input {
                    padding-left: 3rem; /* Space for icon */
                }
                 /* Select styling specific to this form */
                select {
                   padding: 0.75rem 1rem;
                   background: white;
                   border: 1px solid #cbd5e1;
                   border-radius: 8px;
                   color: var(--text-primary);
                }
                option {
                    background: var(--bg-card);
                }

                .full-width {
                    width: 100%;
                    margin-top: 1rem;
                }
                .error-alert {
                    background: rgba(239, 68, 68, 0.2);
                    border: 1px solid var(--error);
                    color: #fca5a5;
                    padding: 0.75rem;
                    border-radius: 8px;
                    margin-bottom: 1.5rem;
                    font-size: 0.9rem;
                    text-align: center;
                }
                .auth-footer {
                    display: flex;
                    justify-content: center;
                    margin-top: 1.5rem;
                    font-size: 0.9rem;
                    color: var(--text-secondary);
                }
                .auth-footer a {
                    color: var(--primary);
                    margin-left: 0.5rem;
                    font-weight: 500;
                }
                .auth-footer a:hover {
                    text-decoration: underline;
                }
            `}</style>
        </div>
    );
};

export default Register;
