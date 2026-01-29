import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import { useSidebar } from '../../context/SidebarContext';
import Sidebar from '../../components/Sidebar/Sidebar';
import './Profile.css';

const Profile = () => {
    const { user, logout } = useAuth();
    const { toggleSidebar } = useSidebar();
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError('');
        setSuccess('');
    };

    const handleLogout = () => {
        logout();
        window.location.href = '/login';
    };

    const handleDeleteAccount = async () => {
        setDeleteLoading(true);
        try {
            await authAPI.deleteAccount();
            logout();
            window.location.href = '/login';
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete account');
            setShowDeleteModal(false);
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (formData.newPassword !== formData.confirmNewPassword) {
            setError('New passwords do not match');
            return;
        }

        if (formData.newPassword.length < 6) {
            setError('New password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            await authAPI.changePassword({
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
            });
            setSuccess('Password changed successfully!');
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: '',
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-container">
            <Sidebar user={user} onLogout={logout} />

            <main className="dashboard-main">
                <div className="profile-container">
                    <header className="profile-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                            <button
                                className="mobile-menu-btn-inline"
                                onClick={toggleSidebar}
                                aria-label="Toggle Menu"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="3" y1="12" x2="21" y2="12"></line>
                                    <line x1="3" y1="6" x2="21" y2="6"></line>
                                    <line x1="3" y1="18" x2="21" y2="18"></line>
                                </svg>
                            </button>
                            <h1 className="profile-title" style={{ marginBottom: 0 }}>My Profile</h1>
                        </div>
                        <p className="profile-subtitle" style={{ marginLeft: 'calc(40px + 1rem)' }}>Manage your account settings and preferences</p>
                    </header>

                    {success && (
                        <div className="success-message">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                            {success}
                        </div>
                    )}

                    {error && (
                        <div className="error-message">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                            {error}
                        </div>
                    )}

                    <div className="profile-card">
                        <div className="card-header-row">
                            <div className="profile-avatar-large">
                                {user?.username?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="profile-info">
                                <h3>{user?.username}</h3>
                                <p>{user?.email}</p>
                            </div>
                        </div>

                        <div className="info-grid">
                            <div className="info-item">
                                <label>Username</label>
                                <div className="info-value">{user?.username}</div>
                            </div>
                            <div className="info-item">
                                <label>Email Address</label>
                                <div className="info-value">{user?.email}</div>
                            </div>
                            <div className="info-item">
                                <label>User ID</label>
                                <div className="info-value" style={{ fontFamily: 'monospace' }}>{user?.id || user?._id}</div>
                            </div>
                            <div className="info-item">
                                <label>Account Status</label>
                                <div className="info-value">
                                    <span className="badge badge-success">Active</span>
                                </div>
                            </div>
                        </div>

                        <div className="password-section">
                            <h2 className="section-title">Change Password</h2>

                            <form className="password-form" onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label className="form-label">Current Password</label>
                                    <input
                                        type="password"
                                        name="currentPassword"
                                        className="form-input"
                                        value={formData.currentPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">New Password</label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        className="form-input"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Confirm New Password</label>
                                    <input
                                        type="password"
                                        name="confirmNewPassword"
                                        className="form-input"
                                        value={formData.confirmNewPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="profile-actions">
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={loading}
                                    >
                                        {loading ? <span className="spinner"></span> : 'Update Password'}
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={handleLogout}
                                    >
                                        Log Out
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Danger Zone */}
                        <div className="danger-zone">
                            <h2 className="section-title">Danger Zone</h2>
                            <div className="danger-zone-content">
                                <div className="danger-zone-text">
                                    <h4>Delete Account</h4>
                                    <p>Once you delete your account, there is no going back. Please be certain.</p>
                                </div>
                                <button
                                    type="button"
                                    className="btn-danger"
                                    onClick={() => setShowDeleteModal(true)}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    </svg>
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Delete Account?</h3>
                        <p>
                            Are you sure you want to permanently delete your account? This action cannot be undone and all your data including tasks will be lost.
                        </p>
                        <div className="modal-actions">
                            <button
                                className="btn-cancel"
                                onClick={() => setShowDeleteModal(false)}
                                disabled={deleteLoading}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn-danger"
                                onClick={handleDeleteAccount}
                                disabled={deleteLoading}
                            >
                                {deleteLoading ? <span className="spinner"></span> : 'Yes, Delete Account'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
