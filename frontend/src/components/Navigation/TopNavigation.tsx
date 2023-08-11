import {
    Group,
    ActionIcon,
    useMantineColorScheme,
    Title,
    Container,
    Drawer,
    Burger,
    useMantineTheme,
    Box,
    Divider,
} from "@mantine/core";

import {
    IconMoon,
    IconSettings,
    IconSun,
    IconUsers,
} from "@tabler/icons-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const navItems = [
    {
        name: "Gruppen",
        link: "/groups",
        icon: IconUsers,
    },
    {
        name: "Einstellungen",
        link: "/settings",
        icon: IconSettings,
    },
];

const TopNavigation = () => {
    const [opened, setOpened] = useState(false);
    const { colors } = useMantineTheme();
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const dark = colorScheme === "dark";
    const navigate = useNavigate();

    return (
        <Container size="md">
            <Group position="apart" style={{ width: "100%" }} py="xl">
                <Link to="/">
                    <Title order={3}>Splid 2.0</Title>
                </Link>
                <Group>
                    <Drawer
                        opened={opened}
                        onClose={() => setOpened(false)}
                        title="Splid 2.0"
                        zIndex={1001}
                    >
                        <Box mt="xl">
                            {navItems.map((item) => {
                                return (
                                    <Box mb="xl">
                                        <div
                                            style={{ cursor: "pointer" }}
                                            onClick={() => {
                                                setOpened(false);
                                                navigate(item.link);
                                            }}
                                        >
                                            <Group>
                                                <item.icon
                                                    size={24}
                                                    color={colors.blue[6]}
                                                />
                                                <Title order={4}>
                                                    {item.name}
                                                </Title>
                                            </Group>
                                        </div>
                                    </Box>
                                );
                            })}
                        </Box>
                        <Divider my="xl" />
                        <Group position="apart">
                            <Title order={4}>Farbschema</Title>

                            <ActionIcon
                                variant="outline"
                                color="yellow"
                                onClick={() => toggleColorScheme()}
                                title="Toggle color scheme"
                            >
                                {dark ? (
                                    <IconSun size={18} />
                                ) : (
                                    <IconMoon size={18} />
                                )}
                            </ActionIcon>
                        </Group>
                    </Drawer>

                    <Burger
                        opened={opened}
                        onClick={() => setOpened(!opened)}
                    />
                </Group>
            </Group>
        </Container>
    );
};
export default TopNavigation;
