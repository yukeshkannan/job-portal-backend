import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { ArrowLeft, Upload, CheckCircle, FileText, Briefcase, MapPin, Star } from 'lucide-react';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useToast } from '../context/ToastContext';

const JobApplication = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null); // { score, reason, feedback }
    const [applicationStatus, setApplicationStatus] = useState(null); // 'success', 'error'
    const [resume, setResume] = useState(null);
    const { addToast } = useToast();

    useEffect(() => {
        if (!user) {
            navigate('/login', { state: { from: `/jobs/${id}/apply` } });
            return;
        }
        fetchJob();
    }, [id, user]);

    const fetchJob = async () => {
        try {
            const res = await api.get(`/jobs/${id}`);
            setJob(res.data.data);
        } catch (error) {
            console.error("Error fetching job:", error);
            // Handle error (e.g.redirect)
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        setResume(e.target.files[0]);
        setAnalysisResult(null); 
    };

    const handleAnalyze = async (e) => {
        e.preventDefault();
        if (!resume) return addToast("Please upload a resume", 'error');

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
            addToast("Failed to analyze resume.", 'error');
        } finally {
            setUploading(false);
        }
    };

    const handleApply = async () => {
        if (!resume) return addToast("Please upload a resume", 'error');

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
            addToast("Failed to apply. Please try again.", 'error');
        } finally {
            setUploading(false);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 80) return '#10b981'; 
        if (score >= 60) return '#f59e0b'; 
        return '#ef4444'; 
    };

    if (loading) return <LoadingSpinner />;
    if (!job) return <div className="container" style={{paddingTop: '2rem'}}>Job Not Found</div>;

    return (
        <div className="container" style={{paddingTop: '3rem', paddingBottom: '3rem', maxWidth: '800px'}}>
            <button onClick={() => navigate(`/jobs/${id}`)} className="btn btn-outline back-btn" style={{marginBottom: '2rem'}}>
                <ArrowLeft size={16} /> Back to Job Details
            </button>

            <div className="glass-panel application-card">
                <div className="app-header">
                    <h2>Apply for {job.title}</h2>
                    <p className="app-subtitle">at {job.company || 'NextHire'}</p>
                </div>

                {!applicationStatus ? (
                    <>
                        {analysisResult ? (
                            <div className="result-container fade-in">
                                <div className="result-header">
                                    <h3>AI Analysis Complete</h3>
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
                                        <h4>Why this score?</h4>
                                        <p style={{ marginBottom: '1rem' }}>{analysisResult.reason}</p>

                                        <h4>Summary</h4>
                                        <p>"{analysisResult.feedback}"</p>
                                    </div>
                                </div>

                                    <div className="action-row" style={{ flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                                        {analysisResult.score > 50 ? (
                                            <button
                                                className="btn btn-primary btn-lg"
                                                onClick={handleApply}
                                                disabled={uploading}
                                            >
                                                {uploading ? 'Applying...' : 'Submit Application'}
                                            </button>
                                        ) : (
                                            <div className="low-score-warning">
                                                <p style={{ color: '#ef4444', fontWeight: '600' }}>
                                                    Match Score Too Low ({analysisResult.score}%)
                                                </p>
                                                <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
                                                    You need at least 50% match to apply for this position.
                                                </p>
                                            </div>
                                        )}
                                        
                                        <button
                                            className="btn btn-outline"
                                            onClick={() => setAnalysisResult(null)}
                                            disabled={uploading}
                                        >
                                            <Upload size={16} /> Upload Different Resume
                                        </button>
                                    </div>
                            </div>
                        ) : (
                            <div className="apply-container">
                                <div className="apply-intro">
                                    <Star className="text-highlight" size={32} style={{ marginBottom: '1rem' }} /> 
                                    <h3>AI-Powered Application</h3>
                                    <p>Upload your resume to instantly see how well you match this job description.</p>
                                </div>

                                <form onSubmit={handleAnalyze} className="upload-form">
                                    <div className="file-drop-area">
                                        <div className="upload-icon-wrapper">
                                            <Upload size={32} />
                                        </div>
                                        <div className="upload-text">
                                            <span className="main-text">{resume ? resume.name : "Click to Upload Resume (PDF)"}</span>
                                            <span className="sub-text">Supported format: .pdf</span>
                                        </div>
                                        <input type="file" accept=".pdf" onChange={handleFileChange} required />
                                    </div>

                                    <button className="btn btn-primary btn-lg full-width" disabled={uploading}>
                                        {uploading ? 'Analyzing...' : 'Analyze fit & Apply'}
                                    </button>
                                </form>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="success-state fade-in">
                        <div className="success-icon">
                            <CheckCircle size={64} color="var(--success)" />
                        </div>
                        <h2>Application Submitted!</h2>
                        <p>Your application has been sent to the recruiter.</p>
                        <button className="btn btn-outline" onClick={() => navigate('/dashboard')}>
                            Go to Dashboard
                        </button>
                    </div>
                )}
            </div>

            <style>{`
                .application-card {
                    padding: 3rem;
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 20px;
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
                }
                .app-header {
                    text-align: center;
                    margin-bottom: 3rem;
                    padding-bottom: 2rem;
                    border-bottom: 1px solid #e2e8f0;
                }
                .app-header h2 {
                    font-size: 2rem;
                    color: var(--text-primary);
                    margin-bottom: 0.5rem;
                }
                .app-subtitle {
                    color: var(--text-secondary);
                    font-size: 1.1rem;
                }
                .apply-intro {
                    text-align: center;
                    margin-bottom: 2.5rem;
                }
                .apply-intro h3 {
                    font-size: 1.5rem;
                    margin-bottom: 0.5rem;
                }
                .apply-intro p {
                    color: var(--text-secondary);
                    max-width: 400px;
                    margin: 0 auto;
                }
                .file-drop-area {
                    border: 2px dashed #cbd5e1;
                    padding: 3rem 2rem;
                    text-align: center;
                    border-radius: 16px;
                    cursor: pointer;
                    position: relative;
                    transition: all 0.2s;
                    background: #f8fafc;
                    margin-bottom: 2rem;
                }
                .file-drop-area:hover {
                    border-color: var(--primary);
                    background: #f0fdf4; /* Very light tint */
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
                .upload-icon-wrapper {
                    background: white;
                    width: 64px;
                    height: 64px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 1rem;
                    color: var(--primary);
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
                }
                .upload-text {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }
                .main-text {
                    font-weight: 600;
                    color: var(--text-primary);
                    font-size: 1.1rem;
                }
                .sub-text {
                    font-size: 0.9rem;
                    color: var(--text-secondary);
                }
                .full-width {
                    width: 100%;
                }
                
                /* Score & Results similar to JobDetails but cleaner */
                .score-display {
                    display: flex;
                    gap: 3rem;
                    align-items: center;
                    margin-bottom: 2rem;
                    flex-wrap: wrap;
                }
                .ai-feedback {
                    flex: 1;
                    background: #f8fafc;
                    padding: 1.5rem;
                    border-radius: 12px;
                }
                .ai-feedback h4 {
                    color: var(--primary);
                    margin-bottom: 0.5rem;
                    font-size: 1rem;
                }
                .action-row {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                    margin-top: 2rem;
                }

                .success-state {
                    text-align: center;
                    padding: 2rem 0;
                }
                .success-icon {
                    margin-bottom: 1.5rem;
                }
            `}</style>
        </div>
    );
};

export default JobApplication;
