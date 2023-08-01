import { useState } from "react";
import { TDummyUser } from "../../types/group";
import UserPreview from "../User/UserPreview";
import {
    Box,
    Button,
    Group,
    Modal,
    Paper,
    TextInput,
    Text,
} from "@mantine/core";

type UserAddButtonProps = {
    members: TDummyUser[];
    setMembers: React.Dispatch<React.SetStateAction<TDummyUser[]>>;
};

type UserAddButtonState = {
    modalOpen: boolean;
    memberName: string;
};

const UserAddButton = ({ members, setMembers }: UserAddButtonProps) => {
    function removeMember(id: number) {
        let clonedMembers = [...members];

        const memberIndex = clonedMembers.findIndex((m) => m.id === id);

        clonedMembers.splice(memberIndex, 1);
        setMembers(clonedMembers);
    }

    function addMember(name: string) {
        let clonedMembers = [...members];

        const existingName = clonedMembers.find((m) => m.name === name);

        if (existingName) {
            alert("User already added");
            return;
        }

        const isFirstMember = clonedMembers.length === 0;

        const highestId = Math.max(...clonedMembers.map((m) => m.id));

        clonedMembers.push({
            id: isFirstMember ? 1 : highestId + 1,
            name,
        });

        setMembers(clonedMembers);
    }

    return (
        <Box mb="md">
            <Box mb="md">
                <AddMemberButton addMember={addMember} />
            </Box>
            {members.length > 0 ? (
                <>
                    {members.map((member) => {
                        return (
                            <Paper withBorder p="sm" mb="md">
                                <Group position="apart">
                                    <UserPreview
                                        user={member}
                                        key={member.id}
                                    />
                                    <Button
                                        variant="default"
                                        onClick={() => removeMember(member.id)}
                                    >
                                        Remove
                                    </Button>
                                </Group>
                            </Paper>
                        );
                    })}
                </>
            ) : (
                <Text>Start to add a Member to your group</Text>
            )}
        </Box>
    );
};

type AddMemberButtonProps = {
    addMember(name: string): void;
};

function AddMemberButton({ addMember }: AddMemberButtonProps) {
    const [state, setState] = useState<UserAddButtonState>({
        modalOpen: false,
        memberName: "",
    });

    function handleSubmit() {
        addMember(state.memberName);
        setState({ ...state, modalOpen: false, memberName: "" });
    }

    return (
        <div>
            <Modal
                title="Add Member"
                opened={state.modalOpen}
                onClose={() => setState({ ...state, modalOpen: false })}
            >
                <form onSubmit={handleSubmit}>
                    <TextInput
                        mb="md"
                        value={state.memberName}
                        required
                        placeholder="Enter Member Name"
                        onChange={(e) =>
                            setState({ ...state, memberName: e.target.value })
                        }
                    />

                    <Button type="submit">Add</Button>
                </form>
            </Modal>
            <Button
                variant="default"
                onClick={() => setState({ ...state, modalOpen: true })}
            >
                Add Member
            </Button>
        </div>
    );
}
export default UserAddButton;
