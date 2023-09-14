import { notifications } from "@mantine/notifications";
import { useState } from "react";

import { TDummyUser } from "@/types/group";

export function useCreateGroup() {
    const [name, setName] = useState("");
    const [members, setMembers] = useState<TDummyUser[]>([]);

    function handleSubmit() {
        if (members.length === 0) {
            notifications.show({
                color: "red",
                title: "Please add a Member!",
                message:
                    "You need to add at least one member to create a group",
            });
            return;
        }

        if (!name) {
            notifications.show({
                color: "red",
                title: "Please add a Group Name!",
                message: "You need to add a group name to create a group",
            });
            return;
        }
        // navigate to group page
    }

    return { name, setName, members, setMembers, handleSubmit };
}
