import { MapPin, Briefcase, Users, Edit, Trash } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';

const JobCard = ({ job, isOwner, onDelete }) => {
    // Job Card Component
    const { user } = useAuth();
    return (
        <div className="glass-panel job-card">
            <div className="job-header">
                <h3>{job.title}</h3>
                <span className="job-type">{job.jobType}</span>
            </div>
            
            <p className="job-description">
                {job.description.substring(0, 100)}...
            </p>

            <div className="job-meta">
                <div className="meta-item">
                    <MapPin size={16} />
                    <span>{job.location}</span>
                </div>
                 <div className="meta-item">
                    <Briefcase size={16} />
                    <span>{job.minExperience}+ Years</span>
                </div>
            </div>

            <div className="job-skills">
                {job.skills.slice(0, 3).map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                ))}
                {job.skills.length > 3 && <span className="skill-tag">+{job.skills.length - 3}</span>}
            </div>

            <div className="job-actions">
                {isOwner ? (
                    <div className="owner-actions-container">
                        <Link to={`/jobs/${job._id}/candidates`} className="btn btn-primary btn-sm candidate-btn">
                            <Users size={16} /> Candidates
                        </Link>
                        <div className="action-icons">
                            <Link to={`/edit-job/${job._id}`} className="icon-btn edit" title="Edit Job">
                                <Edit size={16} />
                            </Link>
                            <button className="icon-btn delete" onClick={() => onDelete(job._id)} title="Delete Job">
                                <Trash size={16} />
                            </button>
                        </div>
                    </div>
                ) : (
                    // Hide "Apply" if user is recruiter (but not owner)
                     (user?.role === 'recruiter' || user?.role === 'admin') ? null : (
                        <div className="card-actions">
                            <Link to={`/jobs/${job._id}`} className="btn btn-outline btn-sm">View Details</Link>
                            <Link to={`/jobs/${job._id}/apply`} className="btn btn-primary btn-sm">Apply Now</Link>
                        </div>
                     )
                )}
            </div>

            <style>{`
                .job-card {
                    padding: 1.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    transition: transform 0.2s;
                    background: white;
                    border: 1px solid #e2e8f0;
                    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
                }
                .job-card:hover {
                    transform: translateY(-5px);
                    background: white;
                    border-color: var(--primary);
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                }
                .job-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: start;
                }
                .job-header h3 {
                    font-size: 1.25rem;
                    margin: 0;
                    line-height: 1.4;
                    color: var(--text-primary);
                }
                .job-type {
                    background: rgba(99, 102, 241, 0.1);
                    color: var(--primary);
                    padding: 0.25rem 0.5rem;
                    border-radius: 4px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    white-space: nowrap;
                    margin-left: 0.5rem;
                }
                .job-description {
                    font-size: 0.9rem;
                    color: var(--text-secondary);
                    flex-grow: 1;
                }
                .card-actions {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }
                .btn {
                    padding: 0.75rem;
                    text-align: center;
                    font-size: 0.95rem;
                }
                .job-meta {
                    display: flex;
                    gap: 1rem;
                    color: var(--text-secondary);
                    font-size: 0.85rem;
                }
                .meta-item {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                }
                .job-skills {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                }
                .skill-tag {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid var(--glass-border);
                    padding: 0.25rem 0.5rem;
                    border-radius: 4px;
                    font-size: 0.75rem;
                    color: var(--text-primary);
                }
                .job-actions {
                    margin-top: auto;
                    padding-top: 1rem;
                    border-top: 1px solid var(--glass-border);
                }
                .card-actions {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                    width: 100%;
                }
                .owner-actions-container {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                }
                .candidate-btn {
                    flex-grow: 1;
                    margin-right: 1rem;
                    text-align: center;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                }
                .action-icons {
                    display: flex;
                    gap: 0.5rem;
                }
                .icon-btn {
                    background: #f1f5f9;
                    border: 1px solid #e2e8f0;
                    color: #64748b;
                    cursor: pointer;
                    padding: 0.6rem;
                    border-radius: 8px;
                    transition: all 0.2s;
                    display: flex; 
                    align-items: center; 
                    justify-content: center;
                }
                .icon-btn:hover {
                    background: #e2e8f0;
                    color: #0f172a;
                    transform: translateY(-2px);
                }
                .icon-btn.edit:hover {
                    color: #2563eb;
                    background: #dbeafe;
                    border-color: #bfdbfe;
                }
                .icon-btn.delete:hover {
                    color: #ef4444;
                    background: #fee2e2;
                    border-color: #fecaca;
                }
            `}</style>
        </div>
    );
};

export default JobCard;
