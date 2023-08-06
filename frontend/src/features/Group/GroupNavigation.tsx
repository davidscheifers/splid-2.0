import { Group } from "@mantine/core";
import { NavLink, useLocation, useParams } from "react-router-dom";

const navItems = [
    {
        name: "Übersicht",
        link: (id: string) => `/groups/${id}`,
    },
    {
        name: "Ausgaben",
        link: (id: string) => `/groups/${id}/expenses`,
    },
    {
        name: "Einstellungen",
        link: (id: string) => `/groups/${id}/settings`,
    },
];

const GroupNavigation = () => {
    const { id } = useParams<{ id: string }>();
    const { pathname } = useLocation();

    return (
        <Group>
            {navItems.map((item, i) => {
                const link = item.link(id || "");

                return (
                    <NavLink
                        key={i}
                        className={pathname === link ? "active" : ""}
                        to={link}
                    >
                        {item.name}
                    </NavLink>
                );
            })}
        </Group>
    );
};
export default GroupNavigation;
