import { Button, Tooltip } from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { IconCopy, IconCheck } from "@tabler/icons-react";

type CopyToClipBoardProps = {
    text: string;
};

const CopyToClipBoard = ({ text }: CopyToClipBoardProps) => {
    const clipboard = useClipboard();
    return (
        <Tooltip
            label="Code kopiert!"
            offset={5}
            position="bottom"
            radius="xl"
            transitionProps={{ duration: 100, transition: "slide-down" }}
            opened={clipboard.copied}
        >
            <Button
                fullWidth
                rightIcon={
                    clipboard.copied ? (
                        <IconCheck size="1.2rem" stroke={1.5} />
                    ) : (
                        <IconCopy size="1.2rem" stroke={1.5} />
                    )
                }
                onClick={() => clipboard.copy(text)}
            >
                Code kopieren
            </Button>
        </Tooltip>
    );
};

export default CopyToClipBoard;
