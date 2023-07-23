import { Container, Title } from "@mantine/core";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const Register = () => {
    const auth = useSelector((state: AppState) => state.auth);

    if (!auth.loading && auth.isAuthenticated) {
        return <Navigate to="/groups" replace />;
    }

    return (
        <Container>
            <Title>Login</Title>
        </Container>
    );
};
export default Register;
