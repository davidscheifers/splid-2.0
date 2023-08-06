import {
    Group,
    ActionIcon,
    useMantineColorScheme,
    Title,
    Container,
} from "@mantine/core";

import { IconMoon, IconSun } from "@tabler/icons-react";
import { Link } from "react-router-dom";

const TopNavigation = () => {
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
                </Group>
            </Group>
        </Container>
    );
};
export default TopNavigation;
