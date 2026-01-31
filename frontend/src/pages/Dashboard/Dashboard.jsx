import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { taskAPI } from '../../services/api';
import { useSidebar } from '../../context/SidebarContext';
import Sidebar from '../../components/Sidebar/Sidebar';
import TaskCard from '../../components/TaskCard/TaskCard';
import TaskModal from '../../components/TaskModal/TaskModal';
import StatsCard from '../../components/StatsCard/StatsCard';
import './Dashboard.css';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const { toggleSidebar } = useSidebar();
    const [tasks, setTasks] = useState([]);
    const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, overdue: 0 });
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchTasks();
    }, []);

    useEffect(() => {
        fetchStats();
    }, []);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchTasks = async () => {
        try {
            const params = {};
            // Fetch only 6 tasks to check if there are more than 5
            params.limit = 6;

            const response = await taskAPI.getTasks(params);
            setTasks(response.data.tasks || response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await taskAPI.getStats();
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleCreateTask = async (taskData) => {
        try {
            await taskAPI.createTask(taskData);
            fetchTasks();
            fetchStats();
            setShowModal(false);
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };

    const handleUpdateTask = async (id, taskData) => {
        try {
            await taskAPI.updateTask(id, taskData);
            fetchTasks();
            fetchStats();
            setShowModal(false);
            setEditingTask(null);
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const handleDeleteTask = async (id) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await taskAPI.deleteTask(id);
                fetchTasks();
                fetchStats();
            } catch (error) {
                console.error('Error deleting task:', error);
            }
        }
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setShowModal(true);
    };

    const handleStatusChange = async (task, newStatus) => {
        try {
            await taskAPI.updateTask(task._id, { status: newStatus });
            fetchTasks();
            fetchStats();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };



    // Limit to 5 tasks for dashboard display
    const displayTasks = tasks.slice(0, 5);
    const hasMoreTasks = tasks.length > 5;

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

                        <div className="search-bar">
                            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="M21 21l-4.35-4.35"></path>
                            </svg>
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search tasks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="header-actions">
                        <button className="notification-btn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                            </svg>
                            {stats.overdue > 0 && <span className="notification-badge">{stats.overdue}</span>}
                        </button>

                        <Link to="/profile" className="user-avatar" title="View Profile">
                            {user?.username?.charAt(0).toUpperCase() || 'U'}
                        </Link>
                    </div>
                </header>

                {/* Stats Section */}
                <section className="stats-section">
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
                        label="Pending"
                        value={stats.pending}
                        color="warning"
                    />
                    <StatsCard
                        icon="🔄"
                        label="In Progress"
                        value={stats.total - stats.completed - stats.pending}
                        color="primary"
                    />
                    <StatsCard
                        icon="⚠️"
                        label="Overdue"
                        value={stats.overdue}
                        color="danger"
                    />
                </section>

                {/* Tasks Section */}
                <section className="tasks-section">
                    <div className="tasks-header">
                        <div>
                            <h2 className="tasks-title">Tasks</h2>
                            <p className="tasks-subtitle">Your current projects and activities</p>
                        </div>

                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                setEditingTask(null);
                                setShowModal(true);
                            }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            Add Task
                        </button>
                    </div>

                    {/* Filter moved to Tasks page, simplified header */}

                    {/* Tasks Grid */}
                    {loading ? (
                        <div className="loading-container">
                            <div className="spinner"></div>
                            <p>Loading tasks...</p>
                        </div>
                    ) : tasks.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📝</div>
                            <h3>No tasks found</h3>
                            <p>Create your first task to get started!</p>
                            <button
                                className="btn btn-primary"
                                onClick={() => setShowModal(true)}
                            >
                                Create Task
                            </button>
                        </div>
                    ) : (
                        <div className="tasks-grid">
                            {displayTasks.map(task => (
                                <TaskCard
                                    key={task._id}
                                    task={task}
                                    onEdit={handleEditTask}
                                    onDelete={handleDeleteTask}
                                    onStatusChange={handleStatusChange}
                                />
                            ))}
                            {hasMoreTasks && (
                                <Link to="/tasks" className="see-all-card">
                                    <div className="see-all-content">
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M5 12h14"></path>
                                            <path d="M12 5l7 7-7 7"></path>
                                        </svg>
                                        <span>See All Tasks</span>
                                    </div>
                                </Link>
                            )}
                        </div>
                    )}
                </section>
            </main>

            {/* Floating Add Button (Mobile) */}
            <button
                className="fab"
                onClick={() => {
                    setEditingTask(null);
                    setShowModal(true);
                }}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
            </button>

            {/* Task Modal */}
            {showModal && (
                <TaskModal
                    task={editingTask}
                    onClose={() => {
                        setShowModal(false);
                        setEditingTask(null);
                    }}
                    onSubmit={editingTask ?
                        (data) => handleUpdateTask(editingTask._id, data) :
                        handleCreateTask
                    }
                />
            )}
        </div>
    );
};

export default Dashboard;
