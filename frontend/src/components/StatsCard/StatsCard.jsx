import './StatsCard.css';

const StatsCard = ({ icon, label, value, color }) => {
    const getColorClass = () => {
        switch (color) {
            case 'primary': return 'stats-primary';
            case 'success': return 'stats-success';
            case 'warning': return 'stats-warning';
            case 'danger': return 'stats-danger';
            default: return 'stats-primary';
        }
    };

    return (
        <div className={`stats-card ${getColorClass()}`}>
            <div className="stats-icon">{icon}</div>
            <div className="stats-content">
                <span className="stats-value">{value}</span>
                <span className="stats-label">{label}</span>
            </div>
        </div>
    );
};

export default StatsCard;
