import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { Calendar, Clock, Video, MapPin, ArrowLeft } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const ScheduleInterview = () => {
    const { candidateId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const { addToast } = useToast();
    
    // Attempt to get candidate/job info from navigation state, or fetch if needed
    const { candidateName: stateCandidateName, jobId: stateJobId, jobTitle: stateJobTitle } = location.state || {};

    const [fetchedData, setFetchedData] = useState({
        candidateName: '',
        jobId: '',
        jobTitle: ''
    });

    useEffect(() => {
        if (!stateJobId && candidateId) {
            const fetchCandidate = async () => {
                try {
                    const res = await api.get(`/candidates/${candidateId}`);
                    const candidate = res.data.data;
                    setFetchedData({
                        candidateName: candidate.name,
                        jobId: candidate.jobId._id || candidate.jobId, // Handle populated or unpopulated
                        jobTitle: candidate.jobId.title || 'Job'
                    });
                } catch (error) {
                    console.error("Failed to fetch candidate details", error);
                    addToast("Failed to load candidate details", 'error');
                    navigate('/dashboard');
                }
            };
            fetchCandidate();
        }
    }, [candidateId, stateJobId]);

    const jobId = stateJobId || fetchedData.jobId;
    const candidateName = stateCandidateName || fetchedData.candidateName;
    const jobTitle = stateJobTitle || fetchedData.jobTitle;

    const [formData, setFormData] = useState({
        scheduledAt: '',
        mode: 'Online', // matches backend enum ['Online', 'Offline']
        meetingLink: '',
        location: ''
    });

    // Basic fetch if state is missing (direct link access)
    // For simplicity, we assume we came from the Candidates list for now.
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post('/interviews', {
                jobId,
                candidateId,
                scheduledAt: formData.scheduledAt,
                mode: formData.mode,
                meetingLink: formData.mode === 'Online' ? formData.meetingLink : formData.location
            });
            addToast('Interview Scheduled Successfully!', 'success');
            navigate('/dashboard'); // or /interviews
        } catch (error) {
            console.error(error);
            const errorMsg = error.response?.data?.error || 'Failed to schedule interview';
            addToast(`Error: ${errorMsg}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="container" style={{paddingTop: '2rem'}}>
             <button onClick={() => navigate(-1)} className="btn btn-outline back-btn" style={{marginBottom: '1rem'}}>
                <ArrowLeft size={16} /> Back
            </button>

            <div className="glass-panel form-card">
                <h2>Schedule Interview</h2>
                <p>For <span className="text-highlight">{candidateName || 'Candidate'}</span> - {jobTitle}</p>

                <form onSubmit={handleSubmit} style={{marginTop: '2rem'}}>
                    <div className="form-group">
                        <label>Date & Time</label>
                        <div className="input-wrapper">
                            <Calendar size={18} className="input-icon" />
                            <input 
                                type="datetime-local" 
                                name="scheduledAt" 
                                value={formData.scheduledAt} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Interview Mode</label>
                        <select name="mode" value={formData.mode} onChange={handleChange}>
                            <option value="Online">Online (Video Call)</option>
                            <option value="Offline">Offline (In-person)</option>
                        </select>
                    </div>

                    {formData.mode === 'Online' ? (
                         <div className="form-group">
                            <label>Meeting Link (Zoom/Meet)</label>
                            <div className="input-wrapper">
                                <Video size={18} className="input-icon" />
                                <input 
                                    type="url" 
                                    name="meetingLink" 
                                    value={formData.meetingLink} 
                                    onChange={handleChange} 
                                    placeholder="https://zoom.us/j/..." 
                                    required 
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="form-group">
                            <label>Office Location</label>
                            <div className="input-wrapper">
                                <MapPin size={18} className="input-icon" />
                                <input 
                                    type="text" 
                                    name="location" 
                                    value={formData.location} 
                                    onChange={handleChange} 
                                    placeholder="Floor 4, Conference Room B..." 
                                    required 
                                />
                            </div>
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary full-width" disabled={loading}>
                        {loading ? 'Scheduling...' : 'Send Invitation'}
                    </button>
                </form>
            </div>

            <style>{`
                .form-card {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 2.5rem;
                }
                .text-highlight {
                    color: var(--primary);
                    font-weight: 600;
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
                input[type="datetime-local"] {
                    padding-left: 3rem;
                }
                input[type="url"], input[type="text"] {
                    padding-left: 3rem;
                }
            `}</style>
        </div>
    );
};

export default ScheduleInterview;
