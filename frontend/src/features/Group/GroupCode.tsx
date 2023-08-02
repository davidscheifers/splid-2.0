import { Group, Paper, Title, Text, Modal, Button } from "@mantine/core";
import { useState } from "react";
import { generateMailtoLink } from "../../utils/functions/functions";
import { TDummyGroup } from "../../types/group";

type GroupCodeProps = {
    /* infos about the current group */
    group: TDummyGroup | undefined;
};
const GroupCode = ({ group }: GroupCodeProps) => {
    const [open, setOpen] = useState(false);

    return (
        <div>
            <Title mb="sm" order={2}>
                Code
            </Title>
            <Paper withBorder p="sm" mb="md" radius="md">
                <Group position="apart">
                    <Text>Code</Text>
                    <Title order={3}>{group?.code}</Title>
                </Group>
            </Paper>
            <Button onClick={() => setOpen(true)}>Einladung verschicken</Button>
            <Modal
                title="Einladung versenden"
                opened={open}
                onClose={() => setOpen(false)}
            >
                <a
                    href={generateMailtoLink(
                        "",
                        `Einladung zu "${group?.name}"`,
                        `Öffne diese Link in deinem Browser http://localhost:5173/groups/join?code${group?.code} oder gib folgenden Code ein: ${group?.code}`
                    )}
                >
                    <Button mb="md" fullWidth>
                        Email
                    </Button>
                    <Button fullWidth>Code kopieren</Button>
                </a>
            </Modal>
        </div>
    );
};
export default GroupCode;
