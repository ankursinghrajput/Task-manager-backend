import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { taskAPI } from '../../services/api';
import { useSidebar } from '../../context/SidebarContext';
import Sidebar from '../../components/Sidebar/Sidebar';
import StatsCard from '../../components/StatsCard/StatsCard';
import './Statistics.css';

const Statistics = () => {
    const { user, logout } = useAuth();
    const { toggleSidebar } = useSidebar();
    const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, overdue: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await taskAPI.getStats();
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate percentages
    const getPercentage = (value) => {
        if (stats.total === 0) return 0;
        return Math.round((value / stats.total) * 100);
    };

    // Generate donut chart gradient
    const getConicGradient = () => {
        if (stats.total === 0) return 'conic-gradient(#e5e7eb 0deg 360deg)';

        const completedDeg = (stats.completed / stats.total) * 360;
        const pendingDeg = (stats.pending / stats.total) * 360;
        // In progress is implied as remainder (Total - Completed - Pending)
        // But for this logic let's keep it simple

        // Let's use simpler logic: Completed (Green), Pending (Yellow), Overdue (Red - overlaps pending technically but let's show separate segments)
        // Note: The stats object usually has total, completed, pending, overdue.
        // Pending usually means "ToDo". 
        // Let's assume In Progress = Total - Completed - Pending

        const inProgress = stats.total - stats.completed - stats.pending;
        const inProgressDeg = (inProgress / stats.total) * 360;

        let currentDeg = 0;
        const greenEnd = currentDeg + completedDeg;
        const purpleEnd = greenEnd + inProgressDeg;
        const yellowEnd = purpleEnd + pendingDeg;

        return `conic-gradient(
            var(--success) ${currentDeg}deg ${greenEnd}deg,
            var(--primary) ${greenEnd}deg ${purpleEnd}deg,
            var(--warning) ${purpleEnd}deg 360deg
        )`;
    };

    const inProgress = stats.total - stats.completed - stats.pending;

    return (
        <div className="dashboard-container">
            <Sidebar user={user} onLogout={logout} />

            <main className="dashboard-main">
                <div className="stats-header">
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
                        <h1 className="stats-page-title" style={{ marginBottom: 0 }}>Task Analytics</h1>
                    </div>
                    <p className="stats-page-subtitle" style={{ marginLeft: 'calc(40px + 1rem)' }}>Visual insights into your productivity</p>
                </div>

                {/* Stats Cards Overview */}
                <div className="stats-overview-grid">
                    <StatsCard
                        icon="📋"
                        label="Total Tasks"
                        value={stats.total}
                        color="primary"
                    />
                    <StatsCard
                        icon="✅"
                        label="Completed"
                        value={stats.completed}
                        color="success"
                    />
                    <StatsCard
                        icon="⏳"
                        label="In Progress"
                        value={inProgress}
                        color="primary"
                    />
                    <StatsCard
                        icon="⚠️"
                        label="Overdue (Danger)"
                        value={stats.overdue}
                        color="danger"
                    />
                </div>

                {/* Charts Grid */}
                <div className="charts-grid">
                    {/* Progress Chart */}
                    <div className="chart-card">
                        <h3 className="chart-title">Task Distribution</h3>
                        <div className="progress-list">
                            <div className="progress-item">
                                <div className="progress-label">
                                    <span>Completed</span>
                                    <span>{getPercentage(stats.completed)}%</span>
                                </div>
                                <div className="progress-track">
                                    <div
                                        className="progress-fill completed"
                                        style={{ width: `${getPercentage(stats.completed)}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="progress-item">
                                <div className="progress-label">
                                    <span>In Progress</span>
                                    <span>{getPercentage(inProgress)}%</span>
                                </div>
                                <div className="progress-track">
                                    <div
                                        className="progress-fill in-progress"
                                        style={{ width: `${getPercentage(inProgress)}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="progress-item">
                                <div className="progress-label">
                                    <span>Pending</span>
                                    <span>{getPercentage(stats.pending)}%</span>
                                </div>
                                <div className="progress-track">
                                    <div
                                        className="progress-fill pending"
                                        style={{ width: `${getPercentage(stats.pending)}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="progress-item">
                                <div className="progress-label">
                                    <span style={{ color: 'var(--danger)' }}>Overdue Tasks</span>
                                    <span>{stats.overdue} Tasks</span>
                                </div>
                                <div className="progress-track">
                                    <div
                                        className="progress-fill overdue"
                                        style={{ width: `${getPercentage(stats.overdue)}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Donut Chart */}
                    <div className="chart-card">
                        <h3 className="chart-title">Completion Status</h3>
                        {stats.total === 0 ? (
                            <div className="empty-state" style={{ padding: '2rem 0' }}>
                                <p>No data to display</p>
                            </div>
                        ) : (
                            <>
                                <div className="donut-chart-container">
                                    <div
                                        className="donut-chart"
                                        style={{ background: getConicGradient() }}
                                    >
                                        <div className="donut-center">
                                            <span className="donut-total">{Math.round((stats.completed / stats.total) * 100)}%</span>
                                            <span className="donut-label">Done</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="chart-legend">
                                    <div className="legend-item">
                                        <span className="legend-dot" style={{ background: 'var(--success)' }}></span>
                                        <span>Completed</span>
                                    </div>
                                    <div className="legend-item">
                                        <span className="legend-dot" style={{ background: 'var(--primary)' }}></span>
                                        <span>In Progress</span>
                                    </div>
                                    <div className="legend-item">
                                        <span className="legend-dot" style={{ background: 'var(--warning)' }}></span>
                                        <span>Pending</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Statistics;
