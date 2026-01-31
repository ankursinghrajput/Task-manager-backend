import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { taskAPI } from '../../services/api';
import { useSidebar } from '../../context/SidebarContext';
import Sidebar from '../../components/Sidebar/Sidebar';
import TaskCard from '../../components/TaskCard/TaskCard';
import TaskModal from '../../components/TaskModal/TaskModal';
import './Tasks.css';

const Tasks = () => {
    const { user, logout } = useAuth();
    const { toggleSidebar } = useSidebar();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({ totalPages: 1, totalTasks: 0 });

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchTasks();
        }, 500);

        return () => clearTimeout(timer);
    }, [statusFilter, priorityFilter, searchQuery, currentPage]);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const params = { limit: 6, page: currentPage };
            if (statusFilter !== 'all') params.status = statusFilter;
            if (priorityFilter) params.priority = priorityFilter;
            if (searchQuery) params.search = searchQuery;

            const response = await taskAPI.getTasks(params);
            setTasks(response.data.tasks || response.data);
            if (response.data.pagination) {
                setPagination(response.data.pagination);
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTask = async (taskData) => {
        try {
            await taskAPI.createTask(taskData);
            fetchTasks();
            setShowModal(false);
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };

    const handleUpdateTask = async (id, taskData) => {
        try {
            await taskAPI.updateTask(id, taskData);
            fetchTasks();
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
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    return (
        <div className="tasks-page-container">
            <Sidebar user={user} onLogout={logout} />

            <main className="tasks-page-main">
                {/* Header */}
                <header className="tasks-page-header">
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
                        <Link to="/profile" className="user-avatar" title="View Profile">
                            {user?.username?.charAt(0).toUpperCase() || 'U'}
                        </Link>
                    </div>
                </header>

                {/* Tasks Section */}
                <section className="tasks-content">
                    <div className="tasks-content-header">
                        <div>
                            <h2 className="tasks-page-title">My Tasks</h2>
                            <p className="tasks-page-subtitle">All tasks you have created</p>
                        </div>

                        <div className="header-right">
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

                            <div className="view-toggle">
                                <button
                                    className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                                    onClick={() => setViewMode('grid')}
                                    title="Grid View"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="3" width="7" height="7"></rect>
                                        <rect x="14" y="3" width="7" height="7"></rect>
                                        <rect x="14" y="14" width="7" height="7"></rect>
                                        <rect x="3" y="14" width="7" height="7"></rect>
                                    </svg>
                                </button>
                                <button
                                    className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                                    onClick={() => setViewMode('list')}
                                    title="List View"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="8" y1="6" x2="21" y2="6"></line>
                                        <line x1="8" y1="12" x2="21" y2="12"></line>
                                        <line x1="8" y1="18" x2="21" y2="18"></line>
                                        <line x1="3" y1="6" x2="3.01" y2="6"></line>
                                        <line x1="3" y1="12" x2="3.01" y2="12"></line>
                                        <line x1="3" y1="18" x2="3.01" y2="18"></line>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Filter Dropdowns */}
                    <div className="filter-dropdowns">
                        <select
                            className="status-filter-select"
                            value={statusFilter}
                            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                        >
                            <option value="all">All Status</option>
                            <option value="todo">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="done">Completed</option>
                        </select>

                        <select
                            className="priority-filter-select"
                            value={priorityFilter}
                            onChange={(e) => { setPriorityFilter(e.target.value); setCurrentPage(1); }}
                        >
                            <option value="">All Priorities</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                    </div>

                    {/* Tasks List */}
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
                        <>
                            <div className={viewMode === 'grid' ? 'tasks-list-grid' : 'tasks-list-view'}>
                                {tasks.map(task => (
                                    <TaskCard
                                        key={task._id}
                                        task={task}
                                        onEdit={handleEditTask}
                                        onDelete={handleDeleteTask}
                                        onStatusChange={handleStatusChange}
                                        compact={viewMode === 'list'}
                                    />
                                ))}
                            </div>

                            {/* Pagination */}
                            {pagination.totalPages > 1 && (
                                <div className="pagination">
                                    <button
                                        className="pagination-btn"
                                        onClick={() => setCurrentPage(prev => prev - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M15 18l-6-6 6-6"></path>
                                        </svg>
                                        Prev
                                    </button>

                                    <div className="pagination-pages">
                                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                                            <button
                                                key={page}
                                                className={`pagination-page ${currentPage === page ? 'active' : ''}`}
                                                onClick={() => setCurrentPage(page)}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        className="pagination-btn"
                                        onClick={() => setCurrentPage(prev => prev + 1)}
                                        disabled={currentPage === pagination.totalPages}
                                    >
                                        Next
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M9 18l6-6-6-6"></path>
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </>
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

export default Tasks;
