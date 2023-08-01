import { Button, TextInput, Title } from "@mantine/core";
import { useState } from "react";
import { TDummyUser } from "../../types/group";
import UserAddButton from "../../components/UserAddButton/UserAddButton";
import { notifications } from "@mantine/notifications";

const CreateGroup = () => {
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

    return (
        <>
            <Title mb="md">Create a Group</Title>
            <TextInput
                mb="md"
                value={name}
                required
                placeholder="Enter Group Name"
                onChange={(e) => setName(e.target.value)}
            />
            <UserAddButton setMembers={setMembers} members={members} />
            <Button onClick={handleSubmit}>Create Group</Button>
        </>
    );
};
export default CreateGroup;
