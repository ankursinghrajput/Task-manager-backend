import './TaskCard.css';

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
    const formatDate = (dateString) => {
        if (!dateString) return 'No due date';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const getPriorityClass = (priority) => {
        switch (priority) {
            case 'high': return 'priority-high';
            case 'medium': return 'priority-medium';
            case 'low': return 'priority-low';
            default: return 'priority-medium';
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'done':
                return <span className="status-badge completed">Completed</span>;
            case 'in-progress':
                return <span className="status-badge in-progress">In Progress</span>;
            default:
                return <span className="status-badge pending">Pending</span>;
        }
    };

    const statusOptions = [
        { value: 'todo', label: 'Pending' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'done', label: 'Completed' },
    ];

    return (
        <div className={`task-card ${task.isOverdue ? 'overdue' : ''}`}>
            <div className="task-card-header">
                <h3 className="task-title">{task.title}</h3>
                <div className="priority-indicator">
                    <span className={`priority-dot ${getPriorityClass(task.priority)}`}></span>
                    <span className="priority-label">{task.priority}</span>
                </div>
            </div>

            {task.description && (
                <p className="task-description">{task.description}</p>
            )}

            <div className="task-meta">
                {getStatusBadge(task.status)}

                <div className="task-date">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span>Due: {formatDate(task.dueDate)}</span>
                </div>
            </div>

            {task.isOverdue && (
                <div className="overdue-badge">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    Overdue
                </div>
            )}

            <div className="task-actions">
                <select
                    className="status-select"
                    value={task.status}
                    onChange={(e) => onStatusChange(task, e.target.value)}
                >
                    {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                <div className="action-buttons">
                    <button
                        className="action-btn edit"
                        onClick={() => onEdit(task)}
                        title="Edit task"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>

                    <button
                        className="action-btn delete"
                        onClick={() => onDelete(task._id)}
                        title="Delete task"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskCard;
