import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Briefcase, MapPin, Calendar, CheckCircle, Clock, XCircle, ChevronRight, Building } from 'lucide-react';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const MyApplications = () => {
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const res = await api.get('/candidates/my-applications');
            setApplications(res.data.data);
        } catch (error) {
            console.error("Error fetching applications:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Hired':
                return <span className="badge success"><CheckCircle size={14} /> Hired</span>;
            case 'Shortlisted':
                return <span className="badge warning"><Clock size={14} /> Shortlisted</span>;
            case 'Rejected':
                return <span className="badge danger"><XCircle size={14} /> Rejected</span>;
            default:
                return <span className="badge neutral"><Briefcase size={14} /> Applied</span>;
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="container video-bg-page">
             <div className="content-wrapper" style={{paddingTop: '2rem'}}>
                <h1 className="page-title">My Applications</h1>
                <p className="page-subtitle">Track the status of your job applications</p>

                {applications.length === 0 ? (
                    <div className="empty-state glass-panel">
                        <Briefcase size={48} color="var(--text-secondary)" />
                        <h3>No Applications Yet</h3>
                        <p>Start exploring jobs and apply to your dream role.</p>
                        <button className="btn btn-primary" onClick={() => navigate('/jobs')}>
                            Explore Jobs
                        </button>
                    </div>
                ) : (
                    <div className="applications-list">
                        {applications.map(app => (
                            <div key={app._id} className="glass-panel app-card">
                                <div className="app-main-info">
                                    <h3 onClick={() => navigate(`/jobs/${app.jobId?._id}`)} className="job-title-link">
                                        {app.jobId?.title || "Unknown Job"}
                                    </h3>
                                    <div className="company-info">
                                        <Building size={16} />
                                        <span>{app.jobId?.company || "Company Confidential"}</span>
                                    </div>
                                    <div className="meta-row">
                                        <div className="meta-item">
                                            <MapPin size={14} /> {app.jobId?.location || "Remote"}
                                        </div>
                                        <div className="meta-item">
                                            <Calendar size={14} /> Applied on {new Date(app.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>

                                <div className="app-status-section">
                                    <div className="status-label">Current Status</div>
                                    {getStatusBadge(app.status)}
                                </div>

                                <div className="app-actions">
                                    <button 
                                        className="btn btn-outline btn-sm icon-btn"
                                        onClick={() => navigate(`/jobs/${app.jobId?._id}`)}
                                    >
                                        View Job <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style>{`
                .video-bg-page {
                    background: var(--bg-dark);
                    min-height: 80vh; /* Push footer down */
                    padding-bottom: 6rem; /* Space before footer */
                }
                .page-title {
                    font-size: 2rem;
                    margin-bottom: 0.5rem;
                    color: var(--text-primary);
                    font-weight: 800;
                    letter-spacing: -0.5px;
                }
                .page-subtitle {
                    color: var(--text-secondary);
                    margin-bottom: 2rem;
                    font-size: 1.1rem;
                }
                .applications-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                .app-card {
                    display: grid;
                    grid-template-columns: 2fr 1fr 1fr;
                    align-items: center;
                    padding: 1.5rem 2rem;
                    gap: 1.5rem;
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                    transition: all 0.2s ease;
                }
                .app-card:hover {
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                    border-color: var(--primary);
                    transform: translateY(-2px);
                }
                .app-main-info {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .job-title-link {
                    margin: 0;
                    cursor: pointer;
                    color: var(--text-primary);
                    font-size: 1.25rem;
                    font-weight: 700;
                    transition: color 0.2s;
                    text-decoration: none;
                }
                .job-title-link:hover {
                    color: var(--primary);
                }
                .company-info {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: var(--text-secondary);
                    font-weight: 600;
                    font-size: 0.95rem;
                }
                .meta-row {
                    display: flex;
                    gap: 1.5rem;
                    margin-top: 0.5rem;
                }
                .meta-item {
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                    font-size: 0.85rem;
                    color: var(--text-secondary);
                    font-weight: 500;
                }
                .status-label {
                    font-size: 0.75rem;
                    color: var(--text-secondary);
                    margin-bottom: 0.5rem;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    font-weight: 700;
                }
                .badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    border-radius: 6px;
                    font-size: 0.85rem;
                    font-weight: 600;
                    border: 1px solid transparent;
                }
                .badge.neutral { background: #f1f5f9; color: #64748b; border-color: #e2e8f0; }
                .badge.success { background: #ecfdf5; color: #059669; border-color: #a7f3d0; }
                .badge.warning { background: #fffbeb; color: #d97706; border-color: #fde68a; }
                .badge.danger  { background: #fef2f2; color: #dc2626; border-color: #fecaca; }

                .app-actions {
                    text-align: right;
                }
                .icon-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-weight: 600;
                }
                .empty-state {
                    text-align: center;
                    padding: 4rem 2rem;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1.5rem;
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                }
                .empty-state h3 {
                    color: var(--text-primary);
                    margin: 0;
                }
                .empty-state p {
                    color: var(--text-secondary);
                    max-width: 400px;
                }

                @media (max-width: 768px) {
                    .app-card {
                        grid-template-columns: 1fr;
                        align-items: flex-start;
                        gap: 1.5rem;
                        padding: 1.5rem;
                    }
                    .app-actions {
                        text-align: left;
                    }
                }
            `}</style>
        </div>
    );
};

export default MyApplications;
