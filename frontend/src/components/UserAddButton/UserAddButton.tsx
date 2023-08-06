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
import {
    addElementToArray,
    removeElementFromArray,
} from "../../utils/functions/functions";
import { useAddMember } from "../../utils/hooks/AddMember/useAddMember";

type UserAddButtonProps = {
    members: TDummyUser[];
    setMembers: React.Dispatch<React.SetStateAction<TDummyUser[]>>;
};

export type UserAddButtonState = {
    modalOpen: boolean;
    memberName: string;
};

const UserAddButton = ({ members, setMembers }: UserAddButtonProps) => {
    return (
        <Box mb="md">
            <Box mb="md">
                <AddMemberButton
                    addMember={(item) =>
                        setMembers(addElementToArray(item, members, "name"))
                    }
                />
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
                                        onClick={() =>
                                            setMembers(
                                                removeElementFromArray(
                                                    member.id,
                                                    members,
                                                    "id"
                                                )
                                            )
                                        }
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
    addMember(item: any): void;
};

function AddMemberButton({ addMember }: AddMemberButtonProps) {
    const { state, setState, handleSubmit } = useAddMember(addMember);

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
