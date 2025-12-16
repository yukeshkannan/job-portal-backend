import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import JobCard from '../components/dashboard/JobCard';
import { Search } from 'lucide-react';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const CandidateDashboard = () => {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

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

    const filteredJobs = jobs.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase()) || 
        job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) return <LoadingSpinner />;

    return (
        <div className="container" style={{paddingTop: '2rem', paddingBottom: '2rem'}}>
            <div className="dashboard-header-center">
                <h1>Find Your Next Dream Job</h1>
                <p>Browse the latest openings and check your AI Match Score</p>
                
                <div className="search-bar">
                    <Search className="search-icon" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search by role, skill, or location..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="jobs-section">
                <h2 style={{marginBottom: '1.5rem'}}>Latest Opportunities ({filteredJobs.length})</h2>
                {filteredJobs.length === 0 ? (
                    <div className="empty-state glass-panel">
                        <h3>No Jobs Found</h3>
                        <p>Try adjusting your search criteria.</p>
                    </div>
                ) : (
                    <div className="jobs-grid">
                        {filteredJobs.map(job => (
                            <JobCard 
                                key={job._id} 
                                job={job} 
                                isOwner={false} // Candidate never owns the job in this view
                                onDelete={() => {}}
                            />
                        ))}
                    </div>
                )}
            </div>

            <style>{`
                .dashboard-header-center {
                    text-align: center;
                    margin-bottom: 3rem;
                    padding: 3rem 0;
                    background: radial-gradient(circle at center, rgba(99, 102, 241, 0.1) 0%, transparent 70%);
                }
                .dashboard-header-center h1 {
                    font-size: 2.5rem;
                    margin-bottom: 1rem;
                    background: linear-gradient(to right, #fff, #94a3b8);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .search-bar {
                    max-width: 600px;
                    margin: 2rem auto 0;
                    position: relative;
                }
                .search-bar input {
                    width: 100%;
                    padding: 1rem 1rem 1rem 3rem;
                    border-radius: 50px;
                    border: 1px solid var(--glass-border);
                    background: rgba(15, 23, 42, 0.8);
                    font-size: 1rem;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
                }
                .search-bar input:focus {
                    border-color: var(--primary);
                    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
                }
                .search-icon {
                    position: absolute;
                    left: 1.25rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--text-secondary);
                }
                .jobs-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                    gap: 1.5rem;
                }
                .empty-state {
                    text-align: center;
                    padding: 3rem;
                    color: var(--text-secondary);
                }
            `}</style>
        </div>
    );
};

export default CandidateDashboard;
