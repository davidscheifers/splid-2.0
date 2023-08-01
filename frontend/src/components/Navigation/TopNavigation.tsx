import {
    Button,
    Group,
    ActionIcon,
    useMantineColorScheme,
    Title,
    Container,
} from "@mantine/core";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";

import { IconLogout, IconMoon, IconSun } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { logout } from "../../features/actions/auth";

const TopNavigation = () => {
    const dispatch = useDispatch();
    const functions = bindActionCreators({ logout }, dispatch);
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const dark = colorScheme === "dark";

    return (
        <Container size="xl">
            <Group position="apart" style={{ width: "100%" }} py="xl">
                <Link to="/">
                    <Title order={3}>Splid 2.0</Title>
                </Link>
                <Group>
                    <ActionIcon
                        variant="outline"
                        color="yellow"
                        onClick={() => toggleColorScheme()}
                        title="Toggle color scheme"
                    >
                        {dark ? <IconSun size={18} /> : <IconMoon size={18} />}
                    </ActionIcon>
                    <Button
                        size="xs"
                        variant="default"
                        leftIcon={<IconLogout size={20} />}
                        onClick={() => functions.logout()}
                    >
                        Logout
                    </Button>
                </Group>
            </Group>
        </Container>
    );
};
export default TopNavigation;
