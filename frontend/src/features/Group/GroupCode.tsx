import { Group, Paper, Title, Text, Modal, Button } from "@mantine/core";
import { useState } from "react";
import {
    generateMailtoLink,
    generateRandomCode,
} from "../../utils/functions/functions";
import { TDummyGroup } from "../../types/group";
import CopyToClipBoard from "../../components/CopyToClipBoard/CopyToClipBoard";

type GroupCodeProps = {
    /* infos about the current group */
    group: TDummyGroup | undefined;
};
const GroupCode = ({ group }: GroupCodeProps) => {
    const [open, setOpen] = useState(false);

    const code = generateRandomCode();

    return (
        <div>
            <Title mb="sm" order={2}>
                Code
            </Title>
            <Paper withBorder p="sm" mb="md" radius="md">
                <Group position="apart">
                    <Text>Code</Text>
                    <Title order={3}>{code}</Title>
                </Group>
            </Paper>
            <Button fullWidth onClick={() => setOpen(true)}>
                Einladung verschicken
            </Button>
            <Modal
                centered
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
                </a>
                <CopyToClipBoard text={group?.code || ""} />
            </Modal>
        </div>
    );
};
export default GroupCode;
