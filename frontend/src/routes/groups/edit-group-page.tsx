import { Box, Title } from "@mantine/core";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { TGroupForm } from "../../types/group";
import GroupForm from "../../features/Group/GroupForm";
import { useGetGroupDetail } from "../../api/Groups/useGetGroupDetails";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";

const EditGroupPage = () => {
    const { id } = useParams<{ id: string }>();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data, status } = useGetGroupDetail(id || "");

    function handleSubmit(data: TGroupForm) {
        setIsSubmitting(true);

        setTimeout(() => {
            setIsSubmitting(false);
        }, 2000);

        console.log(data);
    }
    return (
        <LoadingComponent status={status}>
            <Title mb="sm">Einstellungen</Title>
            <Box mb="xl">
                <GroupForm
                    isSubmitting={isSubmitting}
                    onSubmit={(data) => handleSubmit(data)}
                    defaultValues={{ name: data?.name || "", currency: "EUR" }}
                />
            </Box>
        </LoadingComponent>
    );
};
export default EditGroupPage;
