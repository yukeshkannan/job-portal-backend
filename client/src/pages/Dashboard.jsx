import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import JobCard from '../components/dashboard/JobCard';
import { PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import ConfirmationModal from '../components/ui/ConfirmationModal';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Dashboard = () => {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState(user?.role === 'recruiter' ? 'my' : 'all'); // Default 'my' for recruiters
    
    // UI State
    const { addToast } = useToast();
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, jobId: null });

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await api.get('/jobs');
            setJobs(res.data.data);
        } catch (error) {
            console.error("Error fetching jobs:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (id) => {
        setDeleteModal({ isOpen: true, jobId: id });
    };

    const confirmDelete = async () => {
        const { jobId } = deleteModal;
        try {
            await api.delete(`/jobs/${jobId}`);
            setJobs(jobs.filter(job => job._id !== jobId));
            addToast('Job deleted successfully', 'success');
        } catch (error) {
            console.error("Error deleting job:", error);
            addToast("Failed to delete job", 'error');
        }
    };

    // Filter Logic
    const displayedJobs = filter === 'my' 
        ? jobs.filter(job => job.createdBy?._id === user?._id || job.createdBy === user?._id) 
        : jobs;

    if (loading) return <LoadingSpinner />;

    return (
        <div className="container" style={{paddingTop: '3rem', paddingBottom: '4rem', minHeight: '80vh'}}>
            <div className="dashboard-header">
                <div>
                    <h1>{user?.role === 'recruiter' ? 'Jobs Dashboard' : 'Explore Jobs'}</h1>
                    <p>Find your next opportunity from our curated list of jobs.</p>
                </div>
                
                {user?.role && ['recruiter', 'admin'].includes(user.role) && (
                    <Link to="/create-job" className="btn btn-primary">
                        <PlusCircle size={18} /> Post New Job
                    </Link>
                )}
            </div>

            <div className="filters">
                <button 
                    className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    All Jobs
                </button>
                {user?.role && ['recruiter', 'admin'].includes(user.role) && (
                    <button 
                        className={`filter-btn ${filter === 'my' ? 'active' : ''}`}
                        onClick={() => setFilter('my')}
                    >
                        My Jobs
                    </button>
                )}
            </div>

            {displayedJobs.length === 0 ? (
                <div className="empty-state">
                    <h3>No Jobs Found</h3>
                    <p>Check back later for new opportunities.</p>
                </div>
            ) : (
                <div className="jobs-grid">
                    {displayedJobs.map(job => (
                        <JobCard 
                            key={job._id} 
                            job={job} 
                            isOwner={job.createdBy?._id === user?._id || job.createdBy === user?._id}

                            onDelete={handleDeleteClick}
                        />
                    ))}
                </div>
            )}
            
            <ConfirmationModal 
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
                onConfirm={confirmDelete}
                title="Delete Job"
                message="Are you sure you want to delete this job? This will remove all applications associated with it."
                confirmText="Delete Job"
                isDangerous={true}
            />

            <style>{`
                .dashboard-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2.5rem;
                }
                .dashboard-header h1 {
                    font-size: 2.25rem;
                    color: var(--text-primary);
                    margin-bottom: 0.5rem;
                    font-weight: 800;
                    letter-spacing: -1px;
                }
                .dashboard-header p {
                    color: var(--text-secondary);
                    font-size: 1.1rem;
                }
                .filters {
                    display: flex;
                    gap: 2rem;
                    margin-bottom: 3rem;
                    padding-bottom: 0;
                    border-bottom: 1px solid #e2e8f0;
                }
                .filter-btn {
                    background: transparent;
                    border: none;
                    color: var(--text-secondary);
                    font-family: inherit;
                    font-weight: 600;
                    padding-bottom: 1rem;
                    cursor: pointer;
                    position: relative;
                    font-size: 1rem;
                    transition: color 0.2s;
                }
                .filter-btn:hover {
                    color: var(--primary);
                }
                .filter-btn.active {
                    color: var(--primary);
                }
                .filter-btn.active::after {
                    content: '';
                    position: absolute;
                    bottom: -1px; /* Overlap border */
                    left: 0;
                    width: 100%;
                    height: 2px;
                    background: var(--primary);
                }
                .jobs-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
                    gap: 2rem;
                }
                .empty-state {
                    text-align: center;
                    padding: 4rem 2rem;
                    color: var(--text-secondary);
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                }
                .empty-state h3 {
                    color: var(--text-primary);
                    margin-bottom: 0.5rem;
                }
            `}</style>
        </div>
    );
};

export default Dashboard;
