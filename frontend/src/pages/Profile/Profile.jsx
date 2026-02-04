import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import { useSidebar } from '../../context/SidebarContext';
import Sidebar from '../../components/Sidebar/Sidebar';
import './Profile.css';

const Profile = () => {
    const { user, logout } = useAuth();
    const { toggleSidebar } = useSidebar();
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handlePasswordChange = (e) => {
        setPasswordForm({
            ...passwordForm,
            [e.target.name]: e.target.value
        });
        setErrorMessage('');
        setSuccessMessage('');
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setErrorMessage('New passwords do not match');
            return;
        }
        if (passwordForm.newPassword.length < 6) {
            setErrorMessage('New password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            await authAPI.changePassword({
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword
            });
            setSuccessMessage('Password changed successfully');
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        try {
            await authAPI.deleteAccount();
            logout();
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Failed to delete account');
            setShowDeleteModal(false);
        }
    };

    return (
        <div className="dashboard-container">
            <Sidebar user={user} onLogout={logout} />

            <main className="dashboard-main">
                {/* Header */}
                <header className="dashboard-header">
                    <div className="search-bar-container">
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
                    </div>

                    <div className="header-actions">
                        <Link to="/profile" className="user-avatar" title="View Profile">
                            {user?.username?.charAt(0).toUpperCase() || 'U'}
                        </Link>
                    </div>
                </header>

                <div className="profile-container">
                    <div className="profile-header">
                        <h1 className="profile-title">Profile</h1>
                        <p className="profile-subtitle">Manage your account settings</p>
                    </div>

                    {/* Profile Card */}
                    <div className="profile-card">
                        <div className="card-header-row">
                            <div className="profile-avatar-large">
                                {user?.username?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="profile-info">
                                <h3>{user?.username || 'User'}</h3>
                                <p>{user?.email || 'user@example.com'}</p>
                            </div>
                        </div>

                        <div className="info-grid">
                            <div className="info-item">
                                <label>Username</label>
                                <span className="info-value">{user?.username || 'Not set'}</span>
                            </div>
                            <div className="info-item">
                                <label>Email</label>
                                <span className="info-value">{user?.email || 'Not set'}</span>
                            </div>
                        </div>

                        {/* Change Password Section */}
                        <div className="password-section">
                            <h3 className="section-title">Change Password</h3>

                            {successMessage && (
                                <div className="success-message">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M20 6L9 17l-5-5"></path>
                                    </svg>
                                    {successMessage}
                                </div>
                            )}

                            {errorMessage && (
                                <div className="error-message">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line x1="15" y1="9" x2="9" y2="15"></line>
                                        <line x1="9" y1="9" x2="15" y2="15"></line>
                                    </svg>
                                    {errorMessage}
                                </div>
                            )}

                            <form className="password-form" onSubmit={handlePasswordSubmit}>
                                <div className="form-group">
                                    <label className="form-label">Current Password</label>
                                    <input
                                        type="password"
                                        name="currentPassword"
                                        className="form-input"
                                        value={passwordForm.currentPassword}
                                        onChange={handlePasswordChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">New Password</label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        className="form-input"
                                        value={passwordForm.newPassword}
                                        onChange={handlePasswordChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Confirm New Password</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        className="form-input"
                                        value={passwordForm.confirmPassword}
                                        onChange={handlePasswordChange}
                                        required
                                    />
                                </div>
                                <div className="profile-actions">
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={loading}
                                    >
                                        {loading ? 'Updating...' : 'Update Password'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Danger Zone */}
                        <div className="danger-zone">
                            <h3 className="section-title">Danger Zone</h3>
                            <div className="danger-zone-content">
                                <div className="danger-zone-text">
                                    <h4>Delete Account</h4>
                                    <p>Once you delete your account, there is no going back. Please be certain.</p>
                                </div>
                                <button
                                    className="btn-danger"
                                    onClick={() => setShowDeleteModal(true)}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Delete Account</h3>
                        <p>Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.</p>
                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>
                                Cancel
                            </button>
                            <button className="btn-danger" onClick={handleDeleteAccount}>
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
