import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, UserPlus, FileText, Calendar, Star, Download, Trash2, User } from 'lucide-react';
import ConfirmationModal from '../components/ui/ConfirmationModal';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const JobCandidates = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [candidates, setCandidates] = useState([]);
    const [jobTitle, setJobTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);

    // Form State
    const [formData, setFormData] = useState({ name: '', email: '', resume: null });
    const [uploading, setUploading] = useState(false);
    
    // UI State
    const { addToast } = useToast();
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, candidateId: null });

    useEffect(() => {
        fetchData();
    }, [jobId]);

    const fetchData = async () => {
        try {
            const [jobRes, candidatesRes] = await Promise.all([
                api.get(`/jobs/${jobId}`),
                api.get(`/jobs/${jobId}/candidates`)
            ]);
            setJobTitle(jobRes.data.data.title);
            setCandidates(candidatesRes.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, resume: e.target.files[0] });
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.resume) {
            addToast("Please upload a resume", 'error');
            return;
        }

        setUploading(true);
        const data = new FormData();
        data.append('name', formData.name);
        data.append('email', formData.email);
        data.append('resume', formData.resume);

        try {
            await api.post(`/jobs/${jobId}/candidates`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            addToast("Candidate added & AI Analysis Complete!", 'success');
            setShowAddForm(false);
            setFormData({ name: '', email: '', resume: null });
            fetchData(); // Refresh list to see match score
        } catch (error) {
            console.error("Upload error:", error);
            addToast("Failed to add candidate", 'error');
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteClick = (candidateId) => {
        setDeleteModal({ isOpen: true, candidateId });
    };

    const confirmDelete = async () => {
        const { candidateId } = deleteModal;
        try {
            await api.delete(`/candidates/${candidateId}`);
            setCandidates(candidates.filter(c => c._id !== candidateId));
            addToast('Candidate deleted successfully', 'success');
        } catch (error) {
            console.error("Delete error:", error);
            addToast("Failed to delete candidate", 'error');
        }
    };

    const getScoreColor = (score) => {
        if (score >= 80) return '#10b981'; // Green
        if (score >= 60) return '#f59e0b'; // Orange
        return '#ef4444'; // Red
    };

    const handleDownloadResume = (resumePath) => {
        if (!resumePath) return addToast("No resume available", 'error');
        
        // Extract filename from path (handles both Windows \ and Unix /)
        // e.g., "uploads\resume.pdf" -> "resume.pdf"
        // e.g., "server/uploads/resume.pdf" -> "resume.pdf"
        const filename = resumePath.split(/[/\\]/).pop();
        
        if (!filename) return addToast("Invalid resume path", 'error');

        // Construct clean URL
        // ServerStatic is at /uploads, so we just append filename
        const url = `${api.defaults.baseURL.replace('/api', '')}/uploads/${filename}`;
        
        // Open in new tab
        window.open(url, '_blank');
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="container" style={{paddingTop: '3rem', paddingBottom: '3rem'}}>
           <div style={{marginBottom: '2rem'}}>
                <button onClick={() => navigate('/dashboard')} className="btn btn-outline back-btn" style={{marginBottom: '1rem'}}>
                    <ArrowLeft size={16} /> Back to Dashboard
                </button>
                <div className="header-flex">
                    <div>
                        <h2>Candidates for: <span className="text-highlight">{jobTitle}</span></h2>
                        <p className="subtitle">AI-Powered Resume Screenings ({candidates.length})</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
                        <UserPlus size={18} /> Add Candidate
                    </button>
                </div>
           </div>

            {/* Add Candidate Form - Modal Style */}
            {showAddForm && (
                <div className="modal-overlay" onClick={() => setShowAddForm(false)}>
                    <div className="glass-panel form-modal slide-in" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3><UserPlus size={20} /> Add New Candidate</h3>
                            <button className="close-btn" onClick={() => setShowAddForm(false)}>×</button>
                        </div>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label><UserPlus size={14} /> Full Name</label>
                                <input 
                                    name="name" 
                                    value={formData.name} 
                                    onChange={handleInputChange} 
                                    placeholder="e.g. John Doe"
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label><FileText size={14} /> Email Address</label>
                                <input 
                                    name="email" 
                                    value={formData.email} 
                                    onChange={handleInputChange} 
                                    placeholder="john@example.com"
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label><Download size={14} /> Resume (PDF)</label>
                                <div className="file-input-wrapper">
                                    <input 
                                        type="file" 
                                        accept=".pdf" 
                                        id="resume-upload"
                                        onChange={handleFileChange} 
                                        required 
                                        className="file-input"
                                    />
                                    <label htmlFor="resume-upload" className="file-label">
                                        {formData.resume ? formData.resume.name : 'Choose PDF File...'}
                                    </label>
                                </div>
                                <small style={{color: 'var(--text-secondary)', display: 'block', marginTop: '0.5rem'}}>
                                    <Star size={12} color="#fbbf24" /> AI will analyze this for match score.
                                </small>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-outline" onClick={() => setShowAddForm(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={uploading}>
                                    {uploading ? 'Analyzing...' : 'Add Candidate'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Table Layout */}
            <div className="glass-panel" style={{ overflowX: 'auto' }}>
                <table className="candidates-table">
                    <thead>
                        <tr>
                            <th width="30%">CANDIDATE</th>
                            <th width="10%">MATCH</th>
                            <th width="35%">AI SUMMARY</th>
                            <th width="25%" style={{textAlign: 'right'}}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {candidates.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="no-data">No candidates found for this job yet.</td>
                            </tr>
                        ) : (
                            candidates.map(candidate => (
                                <tr key={candidate._id}>
                                    <td>
                                        <div className="candidate-cell">
                                            <div className="avatar-placeholder">
                                                <User size={18} />
                                            </div>
                                            <div>
                                                <div className="candidate-name">{candidate.name}</div>
                                                <div className="candidate-email">{candidate.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="score-pill" style={{
                                            backgroundColor: `${getScoreColor(candidate.matchScore || 0)}15`,
                                            color: getScoreColor(candidate.matchScore || 0),
                                            borderColor: `${getScoreColor(candidate.matchScore || 0)}40`
                                        }}>
                                            <span style={{fontWeight: '800'}}>{candidate.matchScore || 0}%</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="summary-cell">
                                            {candidate.aiSummary ? (
                                                <>
                                                    <Star size={12} color="#fbbf24" style={{marginTop: '2px', flexShrink: 0}} />
                                                    <span title={candidate.aiSummary}>
                                                        {candidate.aiSummary.substring(0, 100)}...
                                                    </span>
                                                </>
                                            ) : (
                                                <span style={{color: '#94a3b8', fontStyle: 'italic'}}>Pending analysis...</span>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="action-buttons-cell">
                                            <button 
                                                className="btn-icon" 
                                                onClick={() => handleDownloadResume(candidate.resumePath)}
                                                title="Download Resume"
                                            >
                                                <Download size={18} />
                                            </button>
                                            <button 
                                                className="btn-icon primary"
                                                onClick={() => navigate(`/interviews/schedule/${candidate._id}`, {
                                                    state: { candidateName: candidate.name, jobId: jobId, jobTitle: jobTitle }
                                                })}
                                                title="Schedule Interview"
                                            >
                                                <Calendar size={18} />
                                            </button>
                                            <button 
                                                className="btn-icon danger"
                                                onClick={() => handleDeleteClick(candidate._id)}
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            
            <ConfirmationModal 
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
                onConfirm={confirmDelete}
                title="Delete Candidate"
                message="Are you sure you want to delete this candidate?"
                confirmText="Delete"
                isDangerous={true}
            />

            <style>{`
                .header-flex {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 1rem;
                }
                .text-highlight {
                    color: var(--primary);
                    position: relative;
                }
                .subtitle {
                    color: var(--text-secondary);
                    margin-top: 0.25rem;
                }
                
                /* Modal Styles */
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.6);
                    backdrop-filter: blur(4px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    animation: fadeIn 0.2s ease-out;
                }
                .form-modal {
                    width: 100%;
                    max-width: 500px;
                    padding: 0;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                    overflow: hidden;
                    animation: slideUp 0.3s ease-out;
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .modal-header {
                    padding: 1.5rem;
                    background: rgba(255, 255, 255, 0.05);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .modal-header h3 {
                    margin: 0;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 1.25rem;
                    color: var(--text-primary);
                }
                .close-btn {
                    background: none;
                    border: none;
                    color: var(--text-secondary);
                    font-size: 1.5rem;
                    cursor: pointer;
                    line-height: 1;
                }
                .form-modal form {
                    padding: 2rem;
                }
                .file-input-wrapper {
                    position: relative;
                    width: 100%;
                }
                .file-input {
                    opacity: 0;
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    cursor: pointer;
                }
                .file-label {
                    display: block;
                    padding: 0.75rem 1rem;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px dashed var(--glass-border);
                    border-radius: 8px;
                    text-align: center;
                    color: var(--text-secondary);
                    transition: all 0.2s;
                }
                .file-input:hover + .file-label {
                    border-color: var(--primary);
                    color: var(--primary);
                    background: rgba(99, 102, 241, 0.1);
                }
                .modal-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 1rem;
                    margin-top: 2rem;
                }

                /* Table Styles */
                .candidates-table {
                    width: 100%;
                    border-collapse: collapse;
                    text-align: left;
                }
                .candidates-table th {
                    padding: 1rem 1.5rem;
                    background: #f8fafc;
                    color: #64748b;
                    font-size: 0.75rem;
                    font-weight: 700;
                    letter-spacing: 0.05em;
                    border-bottom: 1px solid #e2e8f0;
                }
                .candidates-table td {
                    padding: 1rem 1.5rem;
                    border-bottom: 1px solid #f1f5f9;
                    vertical-align: middle;
                }
                .candidates-table tr:last-child td {
                    border-bottom: none;
                }
                .candidates-table tr:hover td {
                    background: #f8fafc;
                }

                .candidate-cell {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                .avatar-placeholder {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: #e0e7ff;
                    color: var(--primary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .candidate-name {
                    font-weight: 600;
                    color: var(--text-primary);
                }
                .candidate-email {
                    font-size: 0.85rem;
                    color: var(--text-secondary);
                }

                .score-pill {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0.25rem 0.75rem;
                    border-radius: 99px;
                    border: 1px solid;
                    font-size: 0.85rem;
                }

                .summary-cell {
                    display: flex;
                    gap: 0.5rem;
                    font-size: 0.9rem;
                    color: var(--text-secondary);
                    line-height: 1.4;
                }

                .action-buttons-cell {
                    display: flex;
                    justify-content: flex-end;
                    gap: 0.5rem;
                }
                .btn-icon {
                    width: 36px;
                    height: 36px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid #e2e8f0;
                    background: white;
                    color: var(--text-secondary);
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .btn-icon:hover {
                    background: #f1f5f9;
                    color: var(--text-primary);
                    border-color: #cbd5e1;
                }
                .btn-icon.primary:hover {
                    background: var(--primary);
                    color: white;
                    border-color: var(--primary);
                }
                .btn-icon.danger:hover {
                    background: #fee2e2;
                    color: #ef4444;
                    border-color: #fca5a5;
                }
                
                .no-data {
                    text-align: center;
                    color: var(--text-secondary);
                    padding: 3rem !important;
                }

                @media (max-width: 768px) {
                    .candidates-table th:nth-child(3), 
                    .candidates-table td:nth-child(3) {
                        display: none; /* Hide summary on mobile */
                    }
                }
            `}</style>
        </div>
    );
};

export default JobCandidates;
