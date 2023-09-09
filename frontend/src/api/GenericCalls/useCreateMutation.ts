import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";

import AwsApiClient from "../utils/aws-api-client";

type CreateMutationData = {
    url: string;
    entityName: string;
    invalidationProperty?: string;
    successNavigationPath?: string;
};

export function useCreateMutation<T = any>(data: CreateMutationData) {
    const { url, entityName, invalidationProperty, successNavigationPath } =
        data;
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();

    const createMutation = useMutation(
        async (data: T) => {
            const res = await AwsApiClient.post(url, data);
            return res.data;
        },
        {
            onSuccess: () => {
                notifications.show({
                    color: "green",
                    title: `${entityName} erstellt!`,
                    message: `${entityName} wurde erfolgreich erstellt.`,
                });
                setLoading(false);
                if (invalidationProperty) {
                    queryClient.invalidateQueries(invalidationProperty);
                }

                if (successNavigationPath) {
                    navigate(successNavigationPath);
                }
            },
            onError: () => {
                notifications.show({
                    color: "red",
                    title: "Etwas ist schiefgelaufen!",
                    message: `${entityName} Konnte nicht erstellt werden.`,
                });
                setLoading(false);
            },
        }
    );

    return {
        createMutation,
        loading,
        setLoading,
    };
}
