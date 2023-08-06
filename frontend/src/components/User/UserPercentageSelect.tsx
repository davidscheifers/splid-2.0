import { Group, Title } from "@mantine/core";
import { dummyUsers } from "../../utils/data/data";
import UserPreview from "./UserPreview";
import { TDummyUser } from "../../types/group";

type UserPercentageSelectProps = {
    value: UserItem[];
    onChange(value: UserItem[]): void;
};

type UserItem = {
    user: TDummyUser;
    percentage: number;
};

const UserPercentageSelect = ({
    value,
    onChange,
}: UserPercentageSelectProps) => {
    function toggleUser(user: TDummyUser, selectedUsers: UserItem[]) {
        const clonedUsers = selectedUsers ? [...selectedUsers] : [];

        const isAlreadySelected = clonedUsers.find(
            (u) => u.user.id === user.id
        );

        if (isAlreadySelected) {
            return clonedUsers.filter(
                (u) => u.user.id !== isAlreadySelected.user.id
            );
        }

        clonedUsers.push({ user, percentage: 0 });

        return clonedUsers;
    }

    console.log(value);

    function handleIsSelected(user: TDummyUser, selectedUsers: UserItem[]) {
        const foundUser = selectedUsers?.find((u) => u.user.id === user.id);
        return foundUser !== undefined;
    }

    return (
        <div>
            <Title order={3}>Selected users</Title>
            <Group>
                {value?.map((val) => {
                    return (
                        <div>
                            <UserPreview user={val.user} />
                            <Title order={3}>{val.percentage} %</Title>
                        </div>
                    );
                })}
            </Group>

            <Title order={3}>Select users</Title>
            <Group>
                {dummyUsers.map((user) => {
                    return (
                        <div onClick={() => onChange(toggleUser(user, value))}>
                            <UserPreview user={user} />
                            {handleIsSelected(user, value)
                                ? "selected"
                                : "not selected"}
                        </div>
                    );
                })}
            </Group>
        </div>
    );
};
export default UserPercentageSelect;
