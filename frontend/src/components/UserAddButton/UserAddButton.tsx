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
import { useAddMember } from "../../utils/hooks/Group/useAddMember";
import { IconPlus } from "@tabler/icons-react";

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
                                        Entfernen
                                    </Button>
                                </Group>
                            </Paper>
                        );
                    })}
                </>
            ) : (
                <Text>Füge einen Nutzer hinzu</Text>
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
                title="Nutzer hinzufügen"
                opened={state.modalOpen}
                centered
                onClose={() => setState({ ...state, modalOpen: false })}
            >
                <form onSubmit={handleSubmit}>
                    <TextInput
                        mb="md"
                        label="Nutzername"
                        value={state.memberName}
                        required
                        placeholder="Nutzername eingeben..."
                        onChange={(e) =>
                            setState({ ...state, memberName: e.target.value })
                        }
                    />

                    <Button fullWidth type="submit">
                        Hinzufügen
                    </Button>
                </form>
            </Modal>
            <Button
                variant="default"
                leftIcon={<IconPlus size={20} />}
                onClick={() => setState({ ...state, modalOpen: true })}
            >
                Nutzer hinzufügen
            </Button>
        </div>
    );
}
export default UserAddButton;
