import { useQuery } from "react-query";
import AwsApiClient from "../utils/aws-api-client";

type GetAllQueryData = {
    url: string;
    invalidationProperty: string;
};

export function useGetAllQuery<T = any>(data: GetAllQueryData) {
    const { url, invalidationProperty } = data;

    return useQuery<T, Error>([`${invalidationProperty}`], async () => {
        const { data } = await AwsApiClient.get(url);
        return data;
    });
}
