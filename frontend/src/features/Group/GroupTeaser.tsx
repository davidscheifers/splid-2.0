import { Avatar, Box, Group, Paper, Text, Title } from "@mantine/core";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

import { TGroup } from "../../types/group";

type GroupTeaserProps = {
    group: TGroup;
};

const GroupTeaser = ({ group }: GroupTeaserProps) => {
    return (
        <Link to={`/groups/${group.id}`}>
            <div data-cy="group-teaser">
                <Paper withBorder p="sm" mb="md" radius="md">
                    <Group position="apart">
                        <Group>
                            <Avatar radius="xl" />
                            <Box>
                                <Title order={3}>{group.name}</Title>
                                <Text>{group.description}</Text>
                            </Box>
                        </Group>
                        <Text>
                            {dayjs(group.updatedAt).format("DD.MM.YYYY")}
                        </Text>
                    </Group>
                </Paper>
            </div>
        </Link>
    );
};
export default GroupTeaser;
