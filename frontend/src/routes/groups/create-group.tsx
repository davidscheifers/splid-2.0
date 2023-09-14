import { Button, TextInput, Title } from "@mantine/core";

import UserAddButton from "@/components/UserAddButton/UserAddButton";
import { useCreateGroup } from "@/utils/hooks/Group/useCreateGroup";

const CreateGroup = () => {
    const { name, setName, members, setMembers, handleSubmit } =
        useCreateGroup();

    return (
        <>
            <Title mb="md">Gruppe erstellen</Title>
            <TextInput
                mb="md"
                value={name}
                required
                size="md"
                placeholder="Name der Gruppe eingeben..."
                onChange={(e) => setName(e.target.value)}
            />
            <UserAddButton setMembers={setMembers} members={members} />
            <Button fullWidth size="md" onClick={handleSubmit}>
                Erstellen
            </Button>
        </>
    );
};
export default CreateGroup;
