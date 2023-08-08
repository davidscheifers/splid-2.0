import { useQuery } from "react-query";

import { TGroup } from "../../types/group";
import { apiEndPoints } from "../../utils/constants/constants";
import http from "../utils/http";

const QUERY_KEY = ["Groups"];

export const fetchGroups = async (): Promise<TGroup[]> => {
    const { data } = await http.get(apiEndPoints.group.getGroups);

    return data;
};

export const useGetGroups = () => {
    return useQuery<TGroup[], Error>(QUERY_KEY, () => fetchGroups());
};
