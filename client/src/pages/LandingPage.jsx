import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, CheckCircle, Search, Upload, Calendar } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    return (
        <div className="landing-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="container hero-content">
                    <div className="hero-text fade-in-up">
                        <h1 className="gradient-text">Find Your Dream Job <br /> faster with AI</h1>
                        <p>
                            Stop guessing. Our AI analyzes your resume to find the perfect match. 
                            Skip the queue and get hired by top companies.
                        </p>
                        <div className="hero-actions">
                            {!user ? (
                                <>
                                    <Link to="/register" className="btn btn-primary btn-lg">
                                        Get Started <ArrowRight size={20} />
                                    </Link>
                                    <Link to="/login" className="btn btn-outline btn-lg">
                                        I have an account
                                    </Link>
                                </>
                            ) : (
                                <Link 
                                    to={user.role === 'recruiter' ? '/dashboard' : '/jobs'} 
                                    className="btn btn-primary btn-lg"
                                >
                                    {user.role === 'recruiter' ? 'Go to Dashboard' : 'Explore Jobs'} <ArrowRight size={20} />
                                </Link>
                            )}
                        </div>
                    </div>
                    
                    {/* Abstract Floating Cards Visual */}
                    <div className="hero-visual fade-in-delayed">
                        <div className="glass-card float-1">
                            <div className="icon-box"><Upload size={24} color="#6366f1" /></div>
                            <div>
                                <h4>Upload Resume</h4>
                                <small>PDF parsing...</small>
                            </div>
                        </div>
                        <div className="glass-card float-2">
                            <div className="icon-box"><CheckCircle size={24} color="#10b981" /></div>
                            <div>
                                <h4>95% Match</h4>
                                <small>Perfect fit found</small>
                            </div>
                        </div>
                        <div className="glass-card float-3">
                            <div className="icon-box"><Calendar size={24} color="#f59e0b" /></div>
                            <div>
                                <h4>Interview</h4>
                                <small>Scheduled for tmrw</small>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features container">
                <div className="section-header">
                    <h2>Why choose NextHire?</h2>
                    <p>The modern way to hire and get hired.</p>
                </div>

                <div className="features-grid">
                    <div className="feature-card glass-panel" onClick={() => navigate(user ? '/jobs' : '/register')}>
                        <div className="feature-icon"><Search size={32} /></div>
                        <h3>AI Resume Analysis</h3>
                        <p>Instant feedback on your resume's fit for any job description. Know your score before you apply.</p>
                    </div>
                    <div className="feature-card glass-panel" onClick={() => navigate(user ? '/interviews' : '/register')}>
                        <div className="feature-icon"><Calendar size={32} /></div>
                        <h3>Seamless Scheduling</h3>
                        <p>No more email tag. Book interviews directly through the platform with integrated calendar tools.</p>
                    </div>
                    <div className="feature-card glass-panel" onClick={() => navigate(user ? '/my-applications' : '/register')}>
                        <div className="feature-icon"><CheckCircle size={32} /></div>
                        <h3>Smart Tracking</h3>
                        <p>Real-time status updates for every application. Never wonder "what happened?" again.</p>
                    </div>
                </div>
            </section>

            <style>{`
                .landing-page {
                    min-height: 100vh;
                    overflow-x: hidden;
                }
                
                /* Hero */
                .hero {
                    padding: 8rem 0 6rem;
                    position: relative;
                    background: radial-gradient(circle at top right, rgba(99, 102, 241, 0.05), transparent 40%),
                                radial-gradient(circle at bottom left, rgba(236, 72, 153, 0.05), transparent 40%);
                }
                .hero-content {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 4rem;
                }
                .hero-text {
                    flex: 1;
                    max-width: 600px;
                }
                .hero h1 {
                    font-size: 3.5rem;
                    line-height: 1.1;
                    margin-bottom: 1.5rem;
                    font-weight: 800;
                    letter-spacing: -1px;
                    color: var(--text-primary);
                }
                .hero p {
                    font-size: 1.25rem;
                    color: var(--text-secondary);
                    margin-bottom: 2.5rem;
                    line-height: 1.6;
                }
                .hero-actions {
                    display: flex;
                    gap: 1rem;
                }
                .btn-lg {
                    padding: 1rem 2rem;
                    font-size: 1.1rem;
                }

                /* Hero Visual */
                .hero-visual {
                    flex: 1;
                    position: relative;
                    height: 400px;
                    display: none; /* Mobile hidden */
                }
                @media (min-width: 1024px) {
                    .hero-visual { display: block; }
                }
                .glass-card {
                    position: absolute;
                    background: rgba(255, 255, 255, 0.8);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.6);
                    padding: 1rem 1.5rem;
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                    animation: float 6s ease-in-out infinite;
                }
                .glass-card h4 { margin: 0; font-size: 1rem; color: var(--text-primary); font-weight: 600; }
                .glass-card small { color: var(--text-secondary); }
                .icon-box {
                    background: rgba(99, 102, 241, 0.1);
                    padding: 0.75rem;
                    border-radius: 12px;
                }
                
                .float-1 { top: 10%; right: 10%; animation-delay: 0s; }
                .float-2 { top: 40%; left: 10%; animation-delay: 2s; z-index: 2; }
                .float-3 { bottom: 15%; right: 20%; animation-delay: 4s; }

                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                    100% { transform: translateY(0px); }
                }

                /* Features */
                .features {
                    padding: 6rem 1rem;
                }
                .section-header {
                    text-align: center;
                    margin-bottom: 4rem;
                }
                .section-header h2 {
                    font-size: 2.5rem;
                    margin-bottom: 1rem;
                    color: var(--text-primary);
                }
                .section-header p {
                    color: var(--text-secondary);
                    font-size: 1.2rem;
                }
                .features-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 2rem;
                }
                .feature-card {
                    padding: 2.5rem;
                    text-align: center;
                    transition: transform 0.3s;
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 16px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                    cursor: pointer;
                }
                .feature-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08);
                    border-color: var(--primary);
                }
                .feature-icon {
                    background: rgba(99, 102, 241, 0.1);
                    width: 70px;
                    height: 70px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 1.5rem;
                    color: var(--primary);
                }
                .feature-card h3 {
                    margin-bottom: 1rem;
                    font-size: 1.5rem;
                    color: var(--text-primary);
                }
                .feature-card p {
                    color: var(--text-secondary);
                    line-height: 1.6;
                }

                /* Animations */
                .fade-in-up {
                    animation: fadeInUp 0.8s ease-out;
                }
                .fade-in-delayed {
                    animation: fadeInUp 0.8s ease-out 0.3s backwards;
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .gradient-text {
                    background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
            `}</style>
        </div>
    );
};

export default LandingPage;
