import { Box, Title } from "@mantine/core";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { TGroupForm } from "../../types/group";
import GroupForm from "../../features/Group/GroupForm";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import { useGetOneQuery } from "../../api/GenericCalls/useGetOneQuery";
import { apiEndPoints } from "../../utils/constants/constants";

const EditGroupPage = () => {
    const { id } = useParams<{ id: string }>();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data, status } = useGetOneQuery({
        url: apiEndPoints.group.getGroup(id || ""),
        id: id || "",
        invalidationProperty: "group",
    });

    function handleSubmit(data: TGroupForm) {
        setIsSubmitting(true);

        setTimeout(() => {
            setIsSubmitting(false);
        }, 2000);

        console.log(data);
    }
    return (
        <LoadingComponent status={status}>
            <Title mb="sm">Gruppeneinstellungen</Title>
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
