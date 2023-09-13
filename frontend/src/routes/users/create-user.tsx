import { Box, Title } from "@mantine/core";
import { useState } from "react";

import UserForm from "@/features/User/UserForm";
import { TUserForm } from "@/types/user";

const CreateUserPage = () => {
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
            <Title mb="md">Benutzer erstellen</Title>
            <Box mb="xl">
                <UserForm
                    isSubmitting={isSubmitting}
                    onSubmit={(data) => handleSubmit(data)}
                />
            </Box>
        </div>
    );
};
export default CreateUserPage;
