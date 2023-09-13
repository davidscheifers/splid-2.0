import { Box, Title } from "@mantine/core";
import { useState } from "react";
import { useParams } from "react-router-dom";

import UserForm from "@/features/User/UserForm";
import { TUserForm } from "@/types/user";

const EditUserPage = () => {
    const { userId } = useParams<{ userId: string }>();
    const [isSubmitting, setIsSubmitting] = useState(false);

    function handleSubmit(data: TUserForm) {
        setIsSubmitting(true);

        setTimeout(() => {
            setIsSubmitting(false);
        }, 2000);

        console.log(data);
    }
    return (
        <div>
            <Title mb="md">Benutzer bearbeiten</Title>
            <Box mb="xl">
                <UserForm
                    isSubmitting={isSubmitting}
                    onSubmit={(data) => handleSubmit(data)}
                    defaultValues={{ name: userId || "" }}
                />
            </Box>
        </div>
    );
};
export default EditUserPage;
