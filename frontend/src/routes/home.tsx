import { Button, Container, Group, Text, Title } from "@mantine/core";
import { useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";

const HomePage = () => {
    const auth = useSelector((state: AppState) => state.auth);

    if (!auth.loading && auth.isAuthenticated) {
        return <Navigate to="/groups" replace />;
    }

    return (
        <Container size="xl">
            <Title>Home</Title>
            <Text mb="sm">
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                diam nonumy eirmod tempor invidunt ut labore et dolore magna
                aliquyam erat, sed diam voluptua. At vero eos et accusam et
                justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea
                takimata sanctus est Lorem ipsum dolor sit amet
            </Text>
            <Group>
                <Link to="/login">
                    <Button variant="filled">Login</Button>
                </Link>
                <Link to="/register">
                    <Button variant="filled">Register</Button>
                </Link>
            </Group>
        </Container>
    );
};
export default HomePage;
