import { useQuery } from "react-query";

import AwsApiClient from "../utils/aws-api-client";

type GetOneQueryData = {
    url: string;
    id: string;
    invalidationProperty?: string;
};

export function useGetOneQuery<T = any>(data: GetOneQueryData) {
    const { url, id, invalidationProperty } = data;

    return useQuery<T, Error>(
        [`${invalidationProperty}`, id],
        async () => {
            const { data } = await AwsApiClient.get(url);
            return data;
        },
        {
            enabled: !!id,
        }
    );
}
