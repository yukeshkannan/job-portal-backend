import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Shield, Check, X, Search, User } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const AdminPanel = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { addToast } = useToast();

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/dashboard');
            return;
        }
        fetchUsers();
    }, [user]);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/users');
            setUsers(res.data.data);
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleUpdate = async (userId, newRole) => {
        try {
            await api.put(`/users/${userId}/role`, { role: newRole });
            // Optimistic update
            setUsers(users.map(u => 
                u._id === userId ? { ...u, role: newRole } : u
            ));
            addToast(`Role updated to ${newRole}`, 'success');
        } catch (error) {
            addToast("Failed to update role", 'error');
            console.error(error);
        }
    };

    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <LoadingSpinner />;

    return (
        <div className="container" style={{paddingTop: '3rem', paddingBottom: '3rem'}}>
            <div className="admin-header" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>Admin Panel</h1>
                    <p style={{color: 'var(--text-secondary)'}}>Manage users and roles ({users.length} total users)</p>
                </div>
                <div style={{ position: 'relative', width: '300px' }}>
                    <Search size={18} style={{position: 'absolute', left: '12px', top: '12px', color: '#94a3b8'}} />
                    <input 
                        type="text" 
                        placeholder="Search users..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{paddingLeft: '2.5rem'}}
                    />
                </div>
            </div>

            <div className="glass-panel" style={{ overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: '#f1f5f9', borderBottom: '1px solid #e2e8f0' }}>
                        <tr>
                            <th style={{ padding: '1rem', fontSize: '0.85rem', color: '#64748b' }}>USER</th>
                            <th style={{ padding: '1rem', fontSize: '0.85rem', color: '#64748b' }}>EMAIL</th>
                            <th style={{ padding: '1rem', fontSize: '0.85rem', color: '#64748b' }}>ROLE</th>
                            <th style={{ padding: '1rem', fontSize: '0.85rem', color: '#64748b', textAlign: 'right' }}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(userItem => (
                            <tr key={userItem._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '1rem', fontWeight: '600' }}>
                                    <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                                        <div style={{background: '#e0e7ff', padding: '0.5rem', borderRadius: '50%', color: '#4f46e5'}}>
                                            <User size={16} />
                                        </div>
                                        {userItem.name}
                                    </div>
                                </td>
                                <td style={{ padding: '1rem', color: '#64748b' }}>{userItem.email}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '0.35rem 0.75rem',
                                        borderRadius: '99px',
                                        fontSize: '0.8rem',
                                        fontWeight: '600',
                                        background: userItem.role === 'admin' ? '#f3e8ff' : userItem.role === 'recruiter' ? '#ecfccb' : '#f1f5f9',
                                        color: userItem.role === 'admin' ? '#7e22ce' : userItem.role === 'recruiter' ? '#3f6212' : '#475569',
                                        textTransform: 'capitalize'
                                    }}>
                                        {userItem.role}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                    {userItem.role !== 'admin' && (
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                            {userItem.role === 'user' && (
                                                <button 
                                                    onClick={() => handleRoleUpdate(userItem._id, 'recruiter')}
                                                    className="btn btn-sm"
                                                    style={{background: 'var(--primary)', color: 'white', fontSize: '0.8rem', padding: '0.4rem 0.8rem'}}
                                                >
                                                    Make Recruiter
                                                </button>
                                            )}
                                            {userItem.role === 'recruiter' && (
                                                <button 
                                                    onClick={() => handleRoleUpdate(userItem._id, 'user')}
                                                    className="btn btn-sm btn-outline"
                                                    style={{fontSize: '0.8rem', padding: '0.4rem 0.8rem'}}
                                                >
                                                    Demote to Candidate
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredUsers.length === 0 && (
                    <div style={{padding: '3rem', textAlign: 'center', color: '#94a3b8'}}>
                        No users found matching "{searchTerm}"
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPanel;
