import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Save } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const CreateJob = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        jobType: 'Full-time',
        minExperience: 0,
        skills: ''
    });
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEditMode) {
            fetchJobDetails();
        }
    }, [id]);

    const fetchJobDetails = async () => {
        try {
            const res = await api.get(`/jobs/${id}`);
            const job = res.data.data;
            setFormData({
                title: job.title,
                description: job.description,
                location: job.location,
                jobType: job.jobType,
                minExperience: job.minExperience,
                skills: Array.isArray(job.skills) ? job.skills.join(', ') : job.skills
            });
        } catch (error) {
            console.error("Failed to fetch job", error);
            alert("Failed to load job details");
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Convert skills string to array
            const jobData = {
                ...formData,
                skills: formData.skills.split(',').map(s => s.trim())
            };
            
            if (isEditMode) {
                await api.put(`/jobs/${id}`, jobData);
                addToast('Job Updated Successfully', 'success');
            } else {
                await api.post('/jobs', jobData);
                addToast('Job Posted Successfully', 'success');
            }
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            addToast(isEditMode ? 'Failed to update job' : 'Failed to create job', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{paddingTop: '2rem', paddingBottom: '3rem'}}>
            <button onClick={() => navigate(-1)} className="btn btn-outline back-btn" style={{marginBottom: '1rem'}}>
                <ArrowLeft size={16} /> Back
            </button>

            <div className="glass-panel form-card">
                <h2>{isEditMode ? 'Edit Job' : 'Post a New Job'}</h2>
                <p>{isEditMode ? 'Update job details' : 'Find your next great hire'}</p>
                
                <form onSubmit={handleSubmit} style={{marginTop: '2rem'}}>
                    <div className="form-group">
                        <label>Job Title</label>
                        <input name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Senior React Developer" />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Location</label>
                            <input name="location" value={formData.location} onChange={handleChange} required placeholder="Remote, New York, etc." />
                        </div>
                        <div className="form-group">
                            <label>Job Type</label>
                            <select name="jobType" value={formData.jobType} onChange={handleChange}>
                                <option>Full-time</option>
                                <option>Part-time</option>
                                <option>Contract</option>
                                <option>Freelance</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Minimum Experience (Years)</label>
                        <input type="number" name="minExperience" value={formData.minExperience} onChange={handleChange} min="0" required />
                    </div>

                     <div className="form-group">
                        <label>Skills Required (Comma separated)</label>
                        <input name="skills" value={formData.skills} onChange={handleChange} placeholder="React, Node.js, MongoDB" required />
                    </div>

                    <div className="form-group">
                        <label>Job Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows="6" required placeholder="Describe the role and responsibilities..." />
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            <Save size={18} /> {loading ? (isEditMode ? 'Updating...' : 'Publishing...') : (isEditMode ? 'Update Job' : 'Publish Job')}
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
                .form-card {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 2.5rem;
                }
                .form-group {
                    margin-bottom: 1.5rem;
                }
                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                }
                textarea {
                    font-family: 'Inter', sans-serif;
                    resize: vertical;
                }
                .form-actions {
                    display: flex;
                    justify-content: flex-end;
                    margin-top: 2rem;
                }
                @media (max-width: 640px) {
                    .form-row {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
};

export default CreateJob;
