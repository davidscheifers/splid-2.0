import { Link } from "react-router-dom";
import { TDummyGroup } from "../../types/group";
import { Avatar, Group, Title, Text, Box, Paper } from "@mantine/core";

type GroupTeaserProps = {
    group: TDummyGroup;
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
                            <Text>2 Persons</Text>
                        </Box>
                    </Group>
                    <Text>3AM</Text>
                </Group>
            </Paper>
        </Link>
    );
};
export default GroupTeaser;
