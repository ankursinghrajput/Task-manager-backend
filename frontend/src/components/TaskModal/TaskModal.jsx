import { useState, useEffect } from 'react';
import './TaskModal.css';

const TaskModal = ({ task, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        dueDate: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title || '',
                description: task.description || '',
                status: task.status || 'todo',
                priority: task.priority || 'medium',
                dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
            });
        }
    }, [task]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            setError('Title is required');
            return;
        }

        setLoading(true);
        try {
            await onSubmit(formData);
        } catch (err) {
            setError('Failed to save task. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-container">
                <div className="modal-header">
                    <h2 className="modal-title">
                        {task ? 'Edit Task' : 'Create New Task'}
                    </h2>
                    <button className="modal-close" onClick={onClose}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                {error && <div className="modal-error">{error}</div>}

                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Title *</label>
                        <input
                            type="text"
                            name="title"
                            className="form-input"
                            placeholder="Enter task title"
                            value={formData.title}
                            onChange={handleChange}
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                            name="description"
                            className="form-input form-textarea"
                            placeholder="Enter task description (optional)"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Status</label>
                            <select
                                name="status"
                                className="form-select"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="todo">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="done">Completed</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Priority</label>
                            <select
                                name="priority"
                                className="form-select"
                                value={formData.priority}
                                onChange={handleChange}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Due Date</label>
                        <input
                            type="date"
                            name="dueDate"
                            className="form-input"
                            value={formData.dueDate}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="modal-actions">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    Saving...
                                </>
                            ) : (
                                task ? 'Update Task' : 'Create Task'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;
