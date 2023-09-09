import { createStyles, rem } from "@mantine/core";

export const useBasicStyles = createStyles((theme) => ({
    container: {
        height: rem(100),
        backgroundColor: theme.colors.blue[6],
    },
}));
