import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

type PrivateRouteProps = {
    children: React.ReactNode;
};

const PrivateRoute = ({ children }: PrivateRouteProps) => {
    const auth = useSelector((state: AppState) => state.auth);

    if (!auth.isAuthenticated && !auth.loading) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};
export default PrivateRoute;
