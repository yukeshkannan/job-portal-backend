import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { Calendar, Video, MapPin, User, CheckCircle } from 'lucide-react';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const InterviewsList = () => {
    const { user } = useAuth();
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInterviews();
    }, []);

    const fetchInterviews = async () => {
        try {
            const res = await api.get('/interviews');
            setInterviews(res.data.data);
        } catch (error) {
            console.error("Error fetching interviews:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="container" style={{paddingTop: '3rem', paddingBottom: '4rem', minHeight: '80vh'}}>
            <h1 style={{marginBottom: '0.5rem', color: 'var(--text-primary)', fontWeight: '800'}}>My Schedule</h1>
            <p style={{color: 'var(--text-secondary)', marginBottom: '2rem'}}>
                {user.role === 'recruiter' 
                    ? 'Upcoming interviews with candidates' 
                    : 'Your scheduled interviews'}
            </p>

            {interviews.length === 0 ? (
                <div className="empty-state glass-panel">
                    <h3>Ready to Interview?</h3>
                    <p>You haven't scheduled any interviews yet...</p>
                    {user.role === 'recruiter' && (
                        <Link to="/dashboard" className="btn btn-primary" style={{marginTop: '1rem', display: 'inline-flex'}}>
                           Browse Candidates
                        </Link>
                    )}
                </div>
            ) : (
                <div className="interviews-grid">
                    {interviews.map(interview => (
                        <div key={interview._id} className="glass-panel interview-card">
                            <div className="interview-date">
                                <span className="month">{new Date(interview.scheduledAt).toLocaleString('default', { month: 'short' })}</span>
                                <span className="day">{new Date(interview.scheduledAt).getDate()}</span>
                                <span className="time">{new Date(interview.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>

                            <div className="interview-details">
                                <h3>{interview.jobId?.title || 'Unknown Role'}</h3>
                                <div className="detail-row">
                                    <User size={16} color="var(--primary)" />
                                    <span>
                                        {user.role === 'recruiter' 
                                            ? `Candidate: ${interview.candidateId?.name}` 
                                            : `Interviewer: Recruiter`} {/* Could populate interviewer name if available */}
                                    </span>
                                </div>
                                
                                <div className="detail-row">
                                    {interview.mode === 'Virtual' ? <Video size={16} /> : <MapPin size={16} />}
                                    <span>{interview.mode}</span>
                                </div>

                                {interview.meetingLink && (
                                    <>
                                        {interview.mode === 'Online' ? (
                                            <a href={interview.meetingLink} target="_blank" rel="noreferrer" className="meeting-link">
                                                Join Meeting
                                            </a>
                                        ) : (
                                            <div style={{marginTop: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem'}}>
                                                <span style={{fontWeight: '600', color: 'var(--primary)'}}>Location: </span>
                                                {interview.meetingLink}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            <div className="interview-status">
                                {interview.status === 'Scheduled' && <span className="badge warning">Scheduled</span>}
                                {interview.status === 'Completed' && <span className="badge success"><CheckCircle size={12}/> Completed</span>}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <style>{`
                .interviews-grid {
                    display: grid;
                    gap: 1.5rem;
                }
                .interview-card {
                    display: flex;
                    align-items: center;
                    padding: 1.5rem;
                    gap: 2rem;
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    transition: all 0.2s ease;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                }
                .interview-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                    border-color: var(--primary);
                }
                .interview-date {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    background: #eef2ff; /* Indigo 50 */
                    padding: 1rem 1.5rem;
                    border-radius: 12px;
                    border: 1px solid #e0e7ff;
                    min-width: 100px;
                }
                .month {
                    font-size: 0.85rem;
                    text-transform: uppercase;
                    color: var(--primary);
                    font-weight: 700;
                    letter-spacing: 0.5px;
                }
                .day {
                    font-size: 2.25rem;
                    font-weight: 800;
                    line-height: 1;
                    margin: 0.25rem 0;
                    color: var(--text-primary);
                }
                .time {
                    font-size: 0.85rem;
                    color: var(--text-secondary);
                    font-weight: 500;
                }
                .interview-details {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .interview-details h3 {
                    font-size: 1.25rem;
                    margin: 0;
                    color: var(--text-primary);
                    font-weight: 700;
                }
                .detail-row {
                    display: flex;
                    align-items: center;
                    gap: 0.6rem;
                    font-size: 0.95rem;
                    color: var(--text-secondary);
                    font-weight: 500;
                }
                .meeting-link {
                    display: inline-block;
                    margin-top: 0.5rem;
                    color: var(--primary);
                    font-weight: 600;
                    font-size: 0.9rem;
                    text-decoration: none;
                }
                .meeting-link:hover {
                    text-decoration: underline;
                    color: var(--primary-hover);
                }
                .interview-status {
                    min-width: 120px;
                    text-align: right;
                }
                .badge {
                    padding: 0.5rem 1rem;
                    border-radius: 8px;
                    font-size: 0.8rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.4rem;
                    letter-spacing: 0.5px;
                }
                .badge.warning {
                    background: #fffbeb;
                    color: #d97706;
                    border: 1px solid #fde68a;
                }
                .badge.success {
                    background: #ecfdf5;
                    color: #059669;
                    border: 1px solid #a7f3d0;
                }
                .empty-state {
                    text-align: center;
                    padding: 4rem;
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1rem;
                }
                .empty-state h3 {
                    color: var(--text-primary);
                    margin: 0;
                }
                .empty-state p {
                    color: var(--text-secondary);
                }
                @media (max-width: 640px) {
                    .interview-card {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 1.5rem;
                    }
                    .interview-date {
                        width: 100%;
                        flex-direction: row;
                        justify-content: space-between;
                        padding: 1rem;
                    }
                    .day {
                        font-size: 1.5rem;
                    }
                    .interview-status {
                        width: 100%;
                        text-align: left;
                    }
                }
            `}</style>
        </div>
    );
};

export default InterviewsList;
