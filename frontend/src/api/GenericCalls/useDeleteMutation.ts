import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";

import AwsApiClient from "../utils/aws-api-client";

type DeleteMutationData = {
    entityName: string;
    invalidationProperty?: string;
    navigationPathOnSuccess?: string;
};

export function useDeleteMutation(data: DeleteMutationData) {
    const { entityName, invalidationProperty, navigationPathOnSuccess } = data;

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();

    const deleteMutation = useMutation(
        async (url: string) => {
            const { data } = await AwsApiClient.delete(url);
            return data;
        },
        {
            onSuccess: () => {
                notifications.show({
                    color: "green",
                    title: `${entityName} gelöscht!`,
                    message: `${entityName} wurde erfolgreich gelöscht.`,
                });
                setLoading(false);

                if (invalidationProperty) {
                    queryClient.invalidateQueries(invalidationProperty);
                }

                if (navigationPathOnSuccess) {
                    navigate(navigationPathOnSuccess);
                }
            },
            onError: () => {
                notifications.show({
                    color: "red",
                    title: "Etwas ist schiefgelaufen!",
                    message: `${entityName} konnte nicht gelöscht werden.`,
                });
                setLoading(false);
            },
        }
    );

    return {
        deleteMutation,
        loading,
        setLoading,
    };
}
