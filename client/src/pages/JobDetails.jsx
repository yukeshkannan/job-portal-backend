import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { ArrowLeft, MapPin, Briefcase, Upload, CheckCircle, Star } from 'lucide-react';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null); // { score, reason, feedback }
    const [applicationStatus, setApplicationStatus] = useState(null); // 'success', 'error'
    
    // Form State
    const [resume, setResume] = useState(null);

    const location = useLocation();

    // State to control visibility of Apply Section
    const [showApply, setShowApply] = useState(false);

    useEffect(() => {
        fetchJob();
    }, [id]);

    useEffect(() => {
        // If coming from "Apply Now" button, show the section and scroll
        if (location.state?.scrollToApply) {
            setShowApply(true);
        }
    }, [location.state]);

    // Scroll to section when it becomes visible
    useEffect(() => {
        if (showApply && !loading && job) {
            // Small timeout to allow render
            setTimeout(() => {
                const section = document.querySelector('.ai-section');
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }
    }, [showApply, loading, job]);

    const fetchJob = async () => {
        try {
            const res = await api.get(`/jobs/${id}`);
            setJob(res.data.data);
        } catch (error) {
            console.error("Error fetching job:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        setResume(e.target.files[0]);
        setAnalysisResult(null); // Reset analysis if file changes
    };

    // Step 1: Analyze Resume
    const handleAnalyze = async (e) => {
        e.preventDefault();
        if (!resume) return alert("Please upload a resume");

        setUploading(true);
        const data = new FormData();
        data.append('resume', resume);

        try {
            const res = await api.post(`/jobs/${id}/candidates/analyze`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setAnalysisResult(res.data.data);
        } catch (error) {
            console.error("Analysis error:", error);
            alert("Failed to analyze resume.");
        } finally {
            setUploading(false);
        }
    };

    // Step 2: Apply for Job
    const handleApply = async () => {
        if (!resume) return alert("Please upload a resume");

        setUploading(true);
        const data = new FormData();
        data.append('name', user.name);
        data.append('email', user.email);
        data.append('resume', resume);

        try {
            await api.post(`/jobs/${id}/candidates`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setApplicationStatus('success');
        } catch (error) {
            console.error("Application error:", error);
            alert("Failed to apply. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 80) return '#10b981'; // Green
        if (score >= 60) return '#f59e0b'; // Orange
        return '#ef4444'; // Red
    };

    if (loading) return <LoadingSpinner />;
    if (!job) return <div className="container" style={{paddingTop: '2rem'}}>Job Not Found</div>;

    return (
        <div className="container" style={{paddingTop: '2rem', paddingBottom: '3rem'}}>
            <button onClick={() => navigate('/dashboard')} className="btn btn-outline back-btn" style={{marginBottom: '1rem'}}>
                <ArrowLeft size={16} /> Back to Jobs
            </button>

            <div className="glass-panel job-detail-card">
                <div className="job-header-lg">
                    <h1>{job.title}</h1>
                    <span className="job-type-badge">{job.jobType}</span>
                </div>

                <div className="job-meta-row">
                    <div className="meta-item-lg">
                        <MapPin size={18} /> {job.location}
                    </div>
                    <div className="meta-item-lg">
                        <Briefcase size={18} /> {job.minExperience}+ Years Experience
                    </div>
                </div>

                <div className="job-section">
                    <h3>Description</h3>
                    <p>{job.description}</p>
                </div>

                <div className="job-section">
                    <h3>Required Skills</h3>
                    <div className="skills-container">
                        {job.skills.map((skill, i) => (
                            <span key={i} className="skill-pill">{skill}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Apply Button for View Mode */}
            {(user?.role !== 'recruiter' && user?.role !== 'admin') && ( // Removed !showApply condition
                <div className="apply-toggle-container fade-in">
                    <div className="apply-content">
                        <h3>Interested in this role?</h3>
                        <p>Review the requirements and check your fit with our AI analysis.</p>
                        <button 
                            onClick={() => navigate(`/jobs/${id}/apply`)} 
                            className="btn btn-primary btn-lg"
                        >
                            Start Application Process
                        </button>
                    </div>
                </div>
            )}

            {/* Application / AI Section - Shown only if Apply clicked */}
            {(user?.role !== 'recruiter' && user?.role !== 'admin') && showApply && (
                <div className="ai-section glass-panel fade-in" style={{ marginTop: '2rem' }}>
                    {!user ? (
                         /* State -1: Guest User */
                        <div className="empty-state" style={{border: 'none', padding: '1rem', background: 'transparent'}}>
                            <h3>Login to Apply</h3>
                            <p>You need to be signed in to analyze your resume and apply for this position.</p>
                            <button onClick={() => navigate('/login', { state: { from: `/jobs/${id}` } })} className="btn btn-primary" style={{marginTop: '1rem'}}>
                                Login to Continue
                            </button>
                        </div>
                    ) : !applicationStatus ? (
                        <>
                            {/* State 1: Analysis Result Available */}
                            {analysisResult ? (
                                <div className="result-container fade-in">
                                    <div className="result-header">
                                        <h2>AI Analysis Complete</h2>
                                        <p>Review your match score before applying.</p>
                                    </div>

                                    <div className="score-display">
                                        <div className="score-circle" style={{ borderColor: getScoreColor(analysisResult.score) }}>
                                            <span className="score-number" style={{ color: getScoreColor(analysisResult.score) }}>
                                                {analysisResult.score}%
                                            </span>
                                            <span className="score-text">Match Score</span>
                                        </div>

                                        <div className="ai-feedback">
                                            <h3>Why this score?</h3>
                                            <p style={{ marginBottom: '1rem' }}>{analysisResult.reason}</p>

                                            <h3>Summary</h3>
                                            <p>"{analysisResult.feedback}"</p>
                                        </div>
                                    </div>

                                    <div className="action-row" style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                                        <button
                                            className="btn btn-outline"
                                            onClick={() => setAnalysisResult(null)}
                                            disabled={uploading}
                                        >
                                            <Upload size={16} /> Upload Different Resume
                                        </button>
                                        <button
                                            className="btn btn-primary"
                                            onClick={handleApply}
                                            disabled={uploading}
                                        >
                                            {uploading ? 'Applying...' : 'Submit Application'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                /* State 0: Initial Upload */
                                <div className="apply-container">
                                    <div className="apply-header">
                                        <h2><Star className="text-highlight" size={24} style={{ marginBottom: '-4px' }} /> Clean & Apply</h2>
                                        <p>First, analyze your resume fit. Then decide if you want to apply.</p>
                                    </div>

                                    <form onSubmit={handleAnalyze} className="upload-form">
                                        <div className="file-drop-area">
                                            <Upload size={32} color="var(--primary)" />
                                            <span>{resume ? resume.name : "Click to Upload Resume (PDF)"}</span>
                                            <input type="file" accept=".pdf" onChange={handleFileChange} required />
                                        </div>

                                        <button className="btn btn-primary btn-lg" disabled={uploading} style={{ marginTop: '1rem', width: '100%' }}>
                                            {uploading ? 'Analyzing...' : 'Analyze fit'}
                                        </button>
                                    </form>
                                </div>
                            )}
                        </>
                    ) : (
                        /* State 2: Success */
                        <div className="result-container fade-in">
                            <div className="result-header">
                                <CheckCircle size={48} color="var(--success)" />
                                <h2>Application Submitted!</h2>
                                <p>Good luck!</p>
                            </div>
                            <button className="btn btn-outline" onClick={() => navigate('/dashboard')}>
                                Back to Dashboard
                            </button>
                        </div>
                    )}
                </div>
            )}

            <style>{`
                .job-detail-card {
                    padding: 3rem;
                    margin-bottom: 2rem;
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 16px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                }
                .job-header-lg {
                    display: flex;
                    align-items: center;
                    justify-content: space-between; /* Better spacing */
                    flex-wrap: wrap;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                }
                .job-header-lg h1 {
                    font-size: 2.25rem;
                    color: var(--text-primary);
                    margin: 0;
                    line-height: 1.2;
                    font-weight: 800;
                    letter-spacing: -0.5px;
                }
                .job-type-badge {
                    background: #f0fdf4; /* Light Green */
                    color: #166534;      /* Dark Green */
                    border: 1px solid #bbf7d0;
                    padding: 0.5rem 1rem;
                    border-radius: 99px;
                    font-weight: 700;
                    font-size: 0.9rem;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .job-meta-row {
                    display: flex;
                    gap: 2.5rem;
                    color: var(--text-secondary);
                    margin-bottom: 3rem;
                    padding-bottom: 1.5rem;
                    border-bottom: 1px solid #e2e8f0;
                    font-size: 1rem;
                }
                .meta-item-lg {
                    display: flex;
                    align-items: center;
                    gap: 0.6rem;
                    font-weight: 500;
                }
                .job-section {
                    margin-bottom: 2.5rem;
                }
                .job-section h3 {
                    color: var(--text-primary);
                    margin-bottom: 1rem;
                    font-size: 1.25rem;
                    font-weight: 700;
                }
                .job-section p {
                    color: #334155; /* Slate 700 */
                    white-space: pre-line;
                    line-height: 1.8;
                    font-size: 1.05rem;
                }
                .skills-container {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.75rem;
                }
                .skill-pill {
                    background: #f1f5f9; /* Slate 100 */
                    color: #475569;      /* Slate 600 */
                    border: 1px solid #e2e8f0;
                    padding: 0.5rem 1rem;
                    border-radius: 8px;
                    font-weight: 600;
                    font-size: 0.9rem;
                }
                
                /* AI Section */
                .ai-section {
                    padding: 3rem;
                    border: 1px solid #e0e7ff; /* Indigo 100 */
                    background: #f8fafc; /* Slate 50 */
                    border-radius: 16px;
                    box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.02);
                }
                .text-highlight {
                    color: #d97706; /* Amber 600 */
                }
                .file-drop-area {
                    border: 2px dashed #cbd5e1;
                    padding: 3rem;
                    text-align: center;
                    border-radius: 12px;
                    cursor: pointer;
                    position: relative;
                    transition: all 0.2s;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1rem;
                    background: white;
                }
                .file-drop-area:hover {
                    border-color: var(--primary);
                    background: #f5f3ff; /* Violet 50 */
                }
                .file-drop-area input {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    opacity: 0;
                    cursor: pointer;
                }
                
                /* Results */
                .result-container {
                    text-align: center;
                    max-width: 800px;
                    margin: 0 auto;
                }
                .result-header {
                    margin-bottom: 3rem;
                }
                .result-header h2 {
                    color: var(--text-primary);
                    font-size: 1.8rem;
                    margin-bottom: 0.5rem;
                }
                .result-header p {
                    color: var(--text-secondary);
                }
                .score-display {
                    display: flex;
                    align-items: center; 
                    justify-content: center;
                    gap: 4rem;
                    flex-wrap: wrap;
                    background: white;
                    padding: 2rem;
                    border-radius: 16px;
                    border: 1px solid #e2e8f0;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                }
                .score-circle {
                    width: 140px;
                    height: 140px;
                    border-radius: 50%;
                    border: 10px solid;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    background: white;
                    flex-shrink: 0;
                }
                .score-number {
                    font-size: 2.8rem;
                    font-weight: 800;
                    line-height: 1;
                }
                .score-text {
                    font-size: 0.75rem;
                    color: var(--text-secondary);
                    text-transform: uppercase;
                    margin-top: 0.25rem;
                    font-weight: 700;
                }
                .ai-feedback {
                    text-align: left;
                    flex: 1;
                    min-width: 300px;
                    background: transparent;
                    padding: 0;
                    border: none;
                }
                .ai-feedback h3 {
                    margin-bottom: 0.5rem;
                    color: var(--primary);
                    font-size: 1.1rem;
                }
                .ai-feedback p {
                    color: #475569;
                    line-height: 1.6;
                }
                
                .fade-in {
                    animation: fadeIn 0.5s ease-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .back-btn {
                    color: var(--text-secondary);
                    border-color: #cbd5e1;
                }
                .back-btn:hover {
                    color: var(--primary);
                    border-color: var(--primary);
                    background: white;
                }
                .apply-toggle-container {
                    margin-top: 3rem;
                    padding: 3rem;
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 16px;
                    text-align: center;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                }
                .apply-content h3 {
                    font-size: 1.5rem;
                    color: var(--text-primary);
                    margin-bottom: 0.5rem;
                }
                .apply-content p {
                    color: var(--text-secondary);
                    margin-bottom: 2rem;
                    font-size: 1.1rem;
                }
            `}</style>
        </div>
    );
};

export default JobDetails;
