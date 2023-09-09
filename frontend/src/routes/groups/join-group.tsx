import { Button, TextInput, Title } from "@mantine/core";
import { useJoinGroup } from "../../utils/hooks/Group/useJoinGroup";

const JoinGroup = () => {
    const { code, setCode, handleSubmit } = useJoinGroup();
    return (
        <>
            <Title mb="md">Gruppe beitreten</Title>
            <form onSubmit={handleSubmit}>
                <TextInput
                    mb="md"
                    value={code}
                    required
                    placeholder="Gruppen Code eingeben"
                    onChange={(e) => setCode(e.target.value)}
                    size="md"
                />
                <Button size="md" fullWidth type="submit">
                    Beitreten
                </Button>
            </form>
        </>
    );
};
export default JoinGroup;
