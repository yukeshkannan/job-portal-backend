import { Link } from 'react-router-dom';
import { Briefcase, Github, Linkedin, Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="footer-container">
            <div className="container footer-content">
                <div className="footer-section brand">
                    <div className="footer-logo">
                        <Briefcase size={22} color="var(--primary)" />
                        <span>NextHire</span>
                    </div>
                    <p>
                        Revolutionizing the hiring process with AI-driven matching and seamless scheduling.
                    </p>
                </div>

                <div className="footer-section links">
                    <h4>Platform</h4>
                    <Link to="/">Home</Link>

                    <Link to="/login">Login</Link>
                    <Link to="/register">Sign Up</Link>
                </div>



                <div className="footer-section social">
                    <h4>Connect</h4>
                    <div className="social-icons">
                        <a href="https://github.com/yukeshkannan" target="_blank" rel="noopener noreferrer" className="icon-link"><Github size={20} /></a>
                        <a href="https://www.linkedin.com/in/yukeshgowthaman/" target="_blank" rel="noopener noreferrer" className="icon-link"><Linkedin size={20} /></a>
                    </div>
                </div>
            </div>
            
            <div className="container footer-bottom">
                <p>&copy; {new Date().getFullYear()} NextHire.</p>
            </div>

            <style>{`
                .footer-container {
                    background: #ffffff;
                    border-top: 1px solid #e2e8f0;
                    padding: 4rem 0 2rem;
                    margin-top: auto; /* Push to bottom if content is short */
                }
                .footer-content {
                    display: grid;
                    grid-template-columns: 2fr 1fr 1fr;
                    gap: 3rem;
                    margin-bottom: 3rem;
                }
                .footer-logo {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: var(--text-primary);
                    margin-bottom: 1rem;
                }
                .footer-section p {
                    color: var(--text-secondary);
                    font-size: 0.9rem;
                    line-height: 1.6;
                    max-width: 300px;
                }
                .footer-section h4 {
                    color: var(--text-primary);
                    margin-bottom: 1.25rem;
                    font-size: 1rem;
                    font-weight: 600;
                }
                .footer-section.links {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }
                .footer-section.links a {
                    color: var(--text-secondary);
                    font-size: 0.9rem;
                    transition: color 0.2s;
                }
                .footer-section.links a:hover {
                    color: var(--primary);
                }
                .social-icons {
                    display: flex;
                    gap: 1rem;
                }
                .icon-link {
                    color: var(--text-secondary);
                    transition: color 0.2s;
                }
                .icon-link:hover {
                    color: var(--primary);
                }
                .footer-bottom {
                    border-top: 1px solid var(--glass-border);
                    padding-top: 2rem;
                    display: flex;
                    justify-content: space-between;
                    color: var(--text-secondary);
                    font-size: 0.85rem;
                }
                .made-with {
                    display: flex;
                    align-items: center;
                }

                @media (max-width: 768px) {
                    .footer-content {
                        grid-template-columns: 1fr;
                        gap: 2rem;
                    }
                    .footer-bottom {
                        flex-direction: column;
                        align-items: center;
                        gap: 1rem;
                    }
                }
            `}</style>
        </footer>
    );
};

export default Footer;
