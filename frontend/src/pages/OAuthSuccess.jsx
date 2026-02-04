import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OAuthSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { loginWithToken } = useAuth(); // Assuming useAuth has a method to set token directly, or we handle it manually here

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            // If useAuth exposes a method to set user/token, use it.
            // Otherwise, manually setting localStorage and reloading/updating state might be needed.
            // Let's assume standard behavior:
            localStorage.setItem('accessToken', token);
            // Ideally call a restoreUser or similar function if AuthContext depends on it
            // For now, let's try to navigate to dashboard
            navigate('/dashboard');
            window.location.reload(); // Force reload to trigger auth check in App/Context if it reads from localStorage on mount. 
            // Better solution is to have a setToken method in context.
        } else {
            navigate('/login');
        }
    }, [searchParams, navigate]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <h2>Logging you in...</h2>
        </div>
    );
};

export default OAuthSuccess;
