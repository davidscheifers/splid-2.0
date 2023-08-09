import { Button, TextInput, Title } from "@mantine/core";
import { useCreateGroup } from "../../utils/hooks/Group/useCreateGroup";
import UserAddButton from "../../components/UserAddButton/UserAddButton";

const CreateGroup = () => {
    const { name, setName, members, setMembers, handleSubmit } =
        useCreateGroup();

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
