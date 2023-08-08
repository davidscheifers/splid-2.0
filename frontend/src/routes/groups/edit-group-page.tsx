import { Box, Title } from "@mantine/core";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { TDummyGroup, TGroupForm } from "../../types/group";
import GroupForm from "../../features/Group/GroupForm";

const dummyGroup: TDummyGroup = {
    id: 1,
    code: "123456",
    name: "Dummy Group",
    currency: "EUR",
};

const EditGroupPage = () => {
    const { id } = useParams<{ id: string }>();
    const [isSubmitting, setIsSubmitting] = useState(false);

    function handleSubmit(data: TGroupForm) {
        setIsSubmitting(true);

        setTimeout(() => {
            setIsSubmitting(false);
        }, 2000);

        console.log(data);
    }
    return (
        <div>
            <Title mb="sm">Settings</Title>
            <Box mb="xl">
                <GroupForm
                    isSubmitting={isSubmitting}
                    onSubmit={(data) => handleSubmit(data)}
                    defaultValues={dummyGroup}
                />
            </Box>
        </div>
    );
};
export default EditGroupPage;
