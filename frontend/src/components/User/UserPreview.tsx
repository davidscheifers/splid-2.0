import { Link } from "react-router-dom";
import { TDummyUser } from "../../types/group";
import { Avatar, Group, Title } from "@mantine/core";

type UserPreviewProps = {
    /* user information */
    user: TDummyUser;

    /* optional link to user page */
    link?: string;
};

const UserPreview = ({ user, link }: UserPreviewProps) => {
    if (link) {
        return (
            <Link to={link}>
                <User user={user} />
            </Link>
        );
    }
    return <User user={user} />;
};

type UserProps = {
    user: TDummyUser;
};

function User({ user }: UserProps) {
    return (
        <Group>
            <Avatar radius="xl" />
            <Title order={4}>{user.name}</Title>
        </Group>
    );
}
export default UserPreview;
