import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";

import AwsApiClient from "../utils/aws-api-client";

type UpdateMutationData = {
    url: string;
    entityName: string;
    invalidationProperty?: string | string[];
    navigationPathOnSuccess?: string;
};

export function useUpdateMutation<T = any>(data: UpdateMutationData) {
    const { url, entityName, invalidationProperty, navigationPathOnSuccess } =
        data;

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();

    const updateMutation = useMutation(
        async (data: T) => {
            const res = await AwsApiClient.put(url, data);
            return res.data;
        },
        {
            onSuccess: () => {
                notifications.show({
                    color: "green",
                    title: `${entityName} aktualisiert!`,
                    message: `${entityName} wurde erfolgreich aktualisiert.`,
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
                    title: "Etwas ist schief gelaufen!",
                    message: `${entityName} konnte nicht aktualisiert werden.`,
                });
                setLoading(false);
            },
        }
    );

    return {
        updateMutation,
        loading,
        setLoading,
    };
}
