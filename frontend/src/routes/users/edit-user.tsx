import { Box, Title } from "@mantine/core";
import { useState } from "react";
import UserForm from "../../features/User/UserForm";
import { TUserForm } from "../../types/user";
import { useParams } from "react-router-dom";
import { dummyUsers } from "../../utils/data/data";

const EditUserPage = () => {
    const { userId } = useParams<{ userId: string }>();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const user = dummyUsers.find((user) => user.id === parseInt(userId || ""));

    function handleSubmit(data: TUserForm) {
        setIsSubmitting(true);

        setTimeout(() => {
            setIsSubmitting(false);
        }, 2000);

        console.log(data);
    }
    return (
        <div>
            <Title mb="md">Edit User</Title>
            <Box mb="xl">
                <UserForm
                    isSubmitting={isSubmitting}
                    onSubmit={(data) => handleSubmit(data)}
                    defaultValues={{ name: user?.name || "" }}
                />
            </Box>
        </div>
    );
};
export default EditUserPage;
