import { selectStatus } from '@/state/valkey-features/connection/connectionSelectors.ts';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router';

const RequireConnection = () => {
    const isConnected = useSelector(selectStatus) === "Connected";
    console.log('Connected:', isConnected);

    return isConnected ? <Outlet /> : <Navigate to="/connect" replace />;
};

export default RequireConnection;