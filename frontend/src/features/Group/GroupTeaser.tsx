import { Link } from "react-router-dom";
import { TGroup } from "../../types/group";
import { Avatar, Group, Title, Text, Box, Paper } from "@mantine/core";
import dayjs from "dayjs";

type GroupTeaserProps = {
    group: TGroup;
};

const GroupTeaser = ({ group }: GroupTeaserProps) => {
    return (
        <Link to={`/groups/${group.id}`}>
            <Paper withBorder p="sm" mb="md" radius="md">
                <Group position="apart">
                    <Group>
                        <Avatar radius="xl" />
                        <Box>
                            <Title order={3}>{group.name}</Title>
                            <Text>{group.description}</Text>
                        </Box>
                    </Group>
                    <Text>{dayjs(group.updatedAt).format("DD.MM.YYYY")}</Text>
                </Group>
            </Paper>
        </Link>
    );
};
export default GroupTeaser;
