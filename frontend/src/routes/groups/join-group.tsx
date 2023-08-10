import { Button, TextInput, Title } from "@mantine/core";
import { useJoinGroup } from "../../utils/hooks/Group/useJoinGroup";

const JoinGroup = () => {
    const { code, setCode, handleSubmit } = useJoinGroup();
    return (
        <>
            <Title mb="md">Join a Group</Title>
            <form onSubmit={handleSubmit}>
                <TextInput
                    mb="md"
                    value={code}
                    required
                    placeholder="Enter Group Code"
                    onChange={(e) => setCode(e.target.value)}
                />
                <Button type="submit">Join Group</Button>
            </form>
        </>
    );
};
export default JoinGroup;
