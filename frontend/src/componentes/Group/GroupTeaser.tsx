import { Link } from "react-router-dom";
import { TDummyGroup } from "../../types/group";
import { Avatar, Group, Title, Text, createStyles } from "@mantine/core";

type GroupTeaserProps = {
    group: TDummyGroup;
};

const useStyles = createStyles((theme) => ({
    container: {
        padding: `${theme.spacing.md} 0`,
        /* borderBottom: `1px solid ${
            theme.colorScheme === "dark"
                ? theme.colors.gray[6]
                : theme.colors.gray[4]
        }`, */
    },
}));

const GroupTeaser = ({ group }: GroupTeaserProps) => {
    const { classes } = useStyles();

    return (
        <Link to={`/groups/${group.id}`}>
            <div className={classes.container}>
                <Group position="apart">
                    <Group>
                        <Avatar radius="xl" />
                        <Title order={3}>{group.name}</Title>
                    </Group>
                    <Text>3AM</Text>
                </Group>
            </div>
        </Link>
    );
};
export default GroupTeaser;
