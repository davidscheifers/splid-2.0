import { Button, Tooltip } from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { IconCheck, IconCopy } from "@tabler/icons-react";

type CopyToClipBoardProps = {
    text: string;
};

const CopyToClipBoard = ({ text }: CopyToClipBoardProps) => {
    const { copied, copy } = useClipboard();

    return (
        <Tooltip
            label="Code kopiert!"
            offset={5}
            position="bottom"
            radius="xl"
            transitionProps={{ duration: 100, transition: "slide-down" }}
            opened={copied}
        >
            <Button
                fullWidth
                rightIcon={
                    copied ? (
                        <IconCheck size="1.2rem" stroke={1.5} />
                    ) : (
                        <IconCopy size="1.2rem" stroke={1.5} />
                    )
                }
                onClick={() => copy(text)}
            >
                Code kopieren
            </Button>
        </Tooltip>
    );
};

export default CopyToClipBoard;
