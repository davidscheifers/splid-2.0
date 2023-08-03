import { Container } from "@mantine/core";
import TopNavigation from "../Navigation/TopNavigation";

type AppShellProps = {
    children: React.ReactNode;
};

const AppShell = ({ children }: AppShellProps) => {
    return (
        <>
            <TopNavigation />
            <Container size="xl">{children}</Container>
        </>
    );
};
export default AppShell;
