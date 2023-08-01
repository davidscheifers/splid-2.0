import { Button, TextInput, Title } from "@mantine/core";
import { useState } from "react";

const JoinGroup = () => {
    const [code, setCode] = useState("");

    function handleSubmit() {
        console.log("Join group with code" + code);
        // navigate to group page
    }

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
