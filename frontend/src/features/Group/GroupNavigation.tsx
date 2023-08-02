import { Group } from "@mantine/core";
import { NavLink, useLocation, useParams } from "react-router-dom";

const GroupNavigation = () => {
    const { id } = useParams<{ id: string }>();
    const { pathname } = useLocation();

    const expensePath = `/groups/${id}/expenses`;
    const settingsPath = `/groups/${id}/settings`;
    const overviewPath = `/groups/${id}`;

    return (
        <Group>
            <NavLink
                className={pathname === overviewPath ? "active" : ""}
                to={overviewPath}
            >
                Übersicht
            </NavLink>
            <NavLink
                className={pathname === expensePath ? "active" : ""}
                to={expensePath}
            >
                Ausgaben
            </NavLink>
            <NavLink
                className={pathname === settingsPath ? "active" : ""}
                to={settingsPath}
            >
                Einstellungen
            </NavLink>
        </Group>
    );
};
export default GroupNavigation;
