import { Group } from "@mantine/core";
import { NavLink, useLocation, useParams } from "react-router-dom";

const GroupNavigation = () => {
    const { id } = useParams<{ id: string }>();
    const { pathname } = useLocation();

    const expensePath = `/groups/${id}/expenses`;
    const balancePath = `/groups/${id}/balance`;
    const overviewPath = `/groups/${id}/`;

    return (
        <Group>
            <NavLink
                className={pathname === expensePath ? "active" : ""}
                to={expensePath}
            >
                Ausgaben
            </NavLink>
            <NavLink
                className={pathname === overviewPath ? "active" : ""}
                to={overviewPath}
            >
                Übersicht
            </NavLink>
            <NavLink
                className={pathname === balancePath ? "active" : ""}
                to={balancePath}
            >
                Balance
            </NavLink>
        </Group>
    );
};
export default GroupNavigation;
