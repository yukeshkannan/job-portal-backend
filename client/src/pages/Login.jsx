import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await login(formData.email, formData.password);
            // Check role from response data (assuming res contains user data)
            // Based on AuthContext, login returns res.data which likely has structure { token, data: user }
            const role = res.data?.role || 'user'; 
            
            if (from) {
                navigate(from);
                return;
            }

            if (role === 'recruiter' || role === 'admin') {
                navigate('/dashboard');
            } else {
                navigate('/');
            }
        } catch (err) {
            console.error("Login redirect error:", err);
            // Fallback if structure is different, though try/catch handles main login errors
            // If login succeeded but role check failed, ideally we are logged in.
            // But if login throws, we land in catch.
            setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="auth-page">
            <div className="glass-panel auth-card">
                <div className="auth-header">
                    <h2>Welcome Back</h2>
                    <p>Enter your credentials to access your account</p>
                </div>

                {error && <div className="error-alert">{error}</div>}

                <form onSubmit={handleSubmit}>
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
                                placeholder="••••••••" 
                                required 
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary full-width">Sign In</button>
                </form>

                <div className="auth-footer">
                    <p>Don't have an account? <Link to="/register">Sign up</Link></p>
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

export default Login;
