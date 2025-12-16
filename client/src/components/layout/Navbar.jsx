
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, User, LogOut, CheckCircle, PlusCircle, Shield, Menu, X } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
        closeMenu();
    };

    return (
        <nav className="navbar-container">
            <div className="container navbar-content">
                <Link to="/" className="navbar-logo">
                    <Briefcase size={24} color="var(--primary)" />
                    <span>NextHire</span>
                </Link>

                <div className={`navbar-links ${isOpen ? 'active' : ''}`}>
                    {user ? (
                        <>
                            <Link to={user.role === 'recruiter' ? "/dashboard" : "/jobs"} className="nav-link" onClick={closeMenu}>
                                {user.role === 'recruiter' ? 'Dashboard' : 'Explore Jobs'}
                            </Link>
                            {user.role !== 'recruiter' && (
                                <Link to="/my-applications" className="nav-link" onClick={closeMenu}>My Applications</Link>
                            )}
                            <Link to="/interviews" className="nav-link" onClick={closeMenu}>Interviews</Link>
                            {user?.role === 'recruiter' && (
                                <Link to="/create-job" className="btn btn-primary nav-btn-mobile" onClick={closeMenu} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', border: 'none' }}>
                                    <PlusCircle size={18} /> Post New Job
                                </Link>
                            )}
                            {user?.role === 'admin' && (
                                <Link to="/admin" className="nav-link admin-link" onClick={closeMenu} style={{color: '#7e22ce', fontWeight: '700'}}>
                                    <Shield size={18} style={{marginRight: '0.25rem', marginBottom: '-2px'}}/> Admin
                                </Link>
                            )}
                            <div className="user-profile" onClick={closeMenu}>
                                <User size={18} />
                                <span>{user.name}</span>
                                <span className={`role-badge ${user.role}`}>
                                    {user.role === 'recruiter' || user.role === 'admin' ? 'Recruiter' : 'Candidate'}
                                </span>
                            </div>
                            <button onClick={handleLogout} className="btn btn-outline" style={{padding: '0.5rem 1rem', fontSize: '0.9rem'}}>
                                <LogOut size={16} /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link" onClick={closeMenu}>Login</Link>
                            <Link to="/register" className="btn-nav-primary" onClick={closeMenu}>Sign Up</Link>
                        </>
                    )}
                </div>

                <div className="mobile-toggle" onClick={toggleMenu}>
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </div>
            </div>

            <style>{`
                .navbar-container {
                    position: sticky;
                    top: 0;
                    z-index: 1000;
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(16px);
                    border-bottom: 1px solid #e2e8f0;
                    padding: 1.25rem 0;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.03);
                    transition: all 0.3s ease;
                }
                .navbar-content {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                .navbar-logo {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    font-size: 1.5rem;
                    font-weight: 700;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    color: var(--text-primary);
                    text-decoration: none;
                    cursor: pointer;
                }
                .navbar-logo span, .navbar-logo svg {
                    cursor: pointer !important; /* Force override global text cursor */
                }
                .navbar-links {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                }
                .nav-link {
                    color: #64748b; /* Slate 500 */
                    font-weight: 600;
                    font-size: 0.95rem;
                    cursor: pointer; /* Ensure pointer cursor */
                    text-decoration: none;
                    transition: color 0.2s;
                }
                .nav-link:hover {
                    color: var(--primary);
                }
                .btn-nav-primary {
                    background: var(--primary);
                    color: white;
                    padding: 0.6rem 1.2rem;
                    border-radius: 8px;
                    font-weight: 600;
                    text-decoration: none;
                    transition: all 0.2s;
                    box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.3);
                }
                .btn-nav-primary:hover {
                    background: var(--primary-hover);
                    transform: translateY(-1px);
                    box-shadow: 0 6px 10px -1px rgba(99, 102, 241, 0.4);
                }
                .user-profile {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: var(--text-primary);
                    background: #f1f5f9;
                    padding: 0.5rem 1rem;
                    border-radius: 20px;
                    border: 1px solid #e2e8f0;
                    cursor: pointer; /* Ensure pointer for profile too */
                }
                .role-badge {
                    font-size: 0.7rem;
                    padding: 0.25rem 0.6rem;
                    border-radius: 6px;
                    text-transform: uppercase;
                    font-weight: 700;
                    margin-left: 0.5rem;
                }
                .role-badge.recruiter, .role-badge.admin {
                    background: #f3e8ff; /* Light Violet */
                    color: #7e22ce;      /* Dark Violet */
                    border: 1px solid #d8b4fe;
                }
                .role-badge.user {
                    background: #ecfdf5; /* Light Emerald */
                    color: #047857;      /* Dark Emerald */
                    border: 1px solid #6ee7b7;
                }
                
                .mobile-toggle {
                    display: none;
                    cursor: pointer;
                    color: var(--text-primary);
                }

                @media (max-width: 768px) {
                    .mobile-toggle {
                        display: block;
                    }
                    .navbar-links {
                        position: absolute;
                        top: 70px; /* Navbar height */
                        left: 0;
                        right: 0;
                        background: rgba(255, 255, 255, 0.98);
                        backdrop-filter: blur(10px);
                        flex-direction: column;
                        align-items: center;
                        gap: 1.5rem;
                        padding: 2rem;
                        border-bottom: 1px solid #e2e8f0;
                        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                        transition: all 0.3s ease-in-out;
                        opacity: 0;
                        transform: translateY(-20px);
                        pointer-events: none;
                    }
                    .navbar-links.active {
                        opacity: 1;
                        transform: translateY(0);
                        pointer-events: all;
                    }
                    .nav-link {
                        font-size: 1.1rem;
                    }
                }
            `}</style>
        </nav>
    );
};

export default Navbar;
