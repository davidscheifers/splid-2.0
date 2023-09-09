import {
    Group,
    Modal,
    createStyles,
    Text,
    Box,
    Title,
    useMantineTheme,
    Container,
} from "@mantine/core";
import {
    IconDevicesDollar,
    IconGraph,
    IconPlus,
    IconSettings,
    IconUser,
} from "@tabler/icons-react";
import { useState } from "react";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";

const useStyles = createStyles((theme) => ({
    wrapper: {
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        padding: theme.spacing.md,
        zIndex: 1000,
        backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    },
}));

const navItems = [
    {
        name: "Übersicht",
        link: (id: string) => `/groups/${id}`,
        icon: IconGraph,
    },
    {
        name: "Ausgaben",
        link: (id: string) => `/groups/${id}/expenses`,
        icon: IconDevicesDollar,
    },
    {
        name: "Einstellungen",
        link: (id: string) => `/groups/${id}/settings`,
        icon: IconSettings,
    },
];

const modalItems = [
    {
        title: "Neue Ausgabe",
        link: (id: string) => `/groups/${id}/expenses/create`,
        icon: IconDevicesDollar,
        description: "Eine neue Ausgabe erstellen",
    },
    {
        title: "Neue Person",
        link: (id: string) => `/groups/${id}/users/create`,
        icon: IconUser,
        description: "Eine neue Person erstellen",
    },
];

const GroupNavigation = () => {
    const { id } = useParams<{ id: string }>();
    const { pathname } = useLocation();
    const { classes } = useStyles();
    const { colors } = useMantineTheme();
    const [modalOpen, setModalOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <div className={classes.wrapper}>
            <Container size="md">
                <Modal
                    title="Hinzufügen"
                    opened={modalOpen}
                    onClose={() => setModalOpen(false)}
                    centered
                >
                    {modalItems.map((item, i) => {
                        return (
                            <div
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                    setModalOpen(false);
                                    navigate(item.link(id || ""));
                                }}
                                key={i}
                            >
                                <Group mb="md">
                                    <item.icon
                                        size={24}
                                        color={colors.blue[6]}
                                    />
                                    <Box>
                                        <Title order={4}>{item.title}</Title>
                                        <Text>{item.description}</Text>
                                    </Box>
                                </Group>
                            </div>
                        );
                    })}
                </Modal>

                <Group position="apart">
                    {navItems.map((item, i) => {
                        const link = item.link(id || "");
                        const isActive = pathname === link;

                        return (
                            <NavLink to={link} key={i}>
                                <div style={{ textAlign: "center" }}>
                                    <item.icon
                                        size={24}
                                        color={
                                            isActive
                                                ? colors.blue[6]
                                                : colors.gray[4]
                                        }
                                    />
                                    <Text
                                        color={
                                            isActive
                                                ? colors.blue[6]
                                                : colors.gray[4]
                                        }
                                        style={{
                                            margin: "0",
                                            fontSize: "12px",
                                        }}
                                    >
                                        {item.name}
                                    </Text>
                                </div>
                            </NavLink>
                        );
                    })}
                    <div
                        style={{ textAlign: "center", cursor: "pointer" }}
                        onClick={() => setModalOpen(true)}
                    >
                        <IconPlus size={24} color={colors.gray[6]} />
                        <Text style={{ margin: "0", fontSize: "12px" }}>
                            Hinzufügen
                        </Text>
                    </div>
                </Group>
            </Container>
        </div>
    );
};
export default GroupNavigation;
