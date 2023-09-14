import { useState } from "react";

import { UserItem } from "@/components/User/UserPercentageSelect";
import { TDummyUser } from "@/types/group";

export function useCreateExpenseUserPercentage() {
    const [modalOpen, setModalOpen] = useState(false);

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

    function handlePreviewSelectedUsers(selectedUsers: UserItem[]) {
        if (!selectedUsers || selectedUsers.length === 0) {
            return "No users selected";
        }

        if (selectedUsers.length === 1) {
            return selectedUsers[0].user.name;
        }

        return `${selectedUsers.length} People`;
    }

    function handleIsSelected(user: TDummyUser, selectedUsers: UserItem[]) {
        const foundUser = selectedUsers?.find((u) => u.user.id === user.id);
        return foundUser !== undefined;
    }

    function handleChangePercentage(
        value: UserItem,
        e: number | "",
        selectedUsers: UserItem[]
    ) {
        const clonedUsers = selectedUsers ? [...selectedUsers] : [];

        const changeUserIndex = clonedUsers.findIndex(
            (u) => u.user.id === value.user.id
        );

        if (changeUserIndex !== -1) {
            clonedUsers[changeUserIndex].percentage = e as number;
        }

        return clonedUsers;
    }

    return {
        handleIsSelected,
        handleChangePercentage,
        handlePreviewSelectedUsers,
        toggleUser,
        modalOpen,
        setModalOpen,
    };
}
