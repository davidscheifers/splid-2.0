import {
    Button,
    Divider,
    Group,
    Modal,
    NumberInput,
    Text,
    TextInput,
    Title,
    createStyles,
    rem,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

import UserPreview from "./UserPreview";

import { TDummyUser } from "@/types/group";
import { dummyUsers } from "@/utils/data/data";
import { classNames } from "@/utils/functions/functions";
import { useCreateExpenseUserPercentage } from "@/utils/hooks/Expense/useCreateExpenseUserPercentage";
import { useFilterData } from "@/utils/hooks/useFilterData";

type UserPercentageSelectProps = {
    value: UserItem[];
    onChange(value: UserItem[]): void;
};

export type UserItem = {
    user: TDummyUser;
    percentage: number;
};

export const useStyles = createStyles((theme) => ({
    user: {
        padding: theme.spacing.sm,
        borderRadius: rem(5),
    },
    userActive: {
        border: `1px solid ${theme.colors.blue[6]}`,
    },
}));

const UserPercentageSelect = ({
    value,
    onChange,
}: UserPercentageSelectProps) => {
    const { classes } = useStyles();

    const { setSearchQuery, searchQuery, filteredData } = useFilterData(
        dummyUsers,
        "name"
    );

    const {
        handleIsSelected,
        handlePreviewSelectedUsers,
        handleChangePercentage,
        modalOpen,
        setModalOpen,
        toggleUser,
    } = useCreateExpenseUserPercentage();

    return (
        <div>
            <Title order={4}>For</Title>
            <Text></Text>
            <Button variant="default" onClick={() => setModalOpen(true)}>
                {handlePreviewSelectedUsers(value)}
            </Button>
            <Modal
                title="Expense for"
                opened={modalOpen}
                onClose={() => setModalOpen(false)}
                fullScreen
            >
                <Title order={4} mb="md">
                    Select Users
                </Title>
                <TextInput
                    value={searchQuery}
                    onChange={(event) =>
                        setSearchQuery(event.currentTarget.value)
                    }
                    mb="md"
                    placeholder="Search Users"
                    icon={<IconSearch size={20} />}
                />
                <Group>
                    {filteredData.map((user) => {
                        return (
                            <div
                                key={user.id}
                                onClick={() =>
                                    onChange(toggleUser(user, value))
                                }
                                className={classNames(
                                    classes.user,
                                    handleIsSelected(user, value) &&
                                        classes.userActive
                                )}
                            >
                                <UserPreview user={user} />
                            </div>
                        );
                    })}
                </Group>
                <Divider my="xl" />

                <Group>
                    <Title order={4}>Selected users</Title>
                    {value?.map((val) => {
                        return (
                            <Group key={val.user.id}>
                                <UserPreview user={val.user} />
                                <NumberInput
                                    width={20}
                                    value={val.percentage}
                                    onChange={(num) =>
                                        onChange(
                                            handleChangePercentage(
                                                val,
                                                num,
                                                value
                                            )
                                        )
                                    }
                                />
                            </Group>
                        );
                    })}
                </Group>
            </Modal>
        </div>
    );
};
export default UserPercentageSelect;
