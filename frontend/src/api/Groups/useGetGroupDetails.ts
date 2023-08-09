import { useQuery } from "react-query";

import { GroupDetail } from "../../types/group";
import { apiEndPoints } from "../../utils/constants/constants";
import http from "../utils/http";

const QUERY_KEY = "Group";

export const fetchGroup = async (
    id: string
): Promise<GroupDetail | undefined> => {
    const { data } = await http.get(apiEndPoints.group.getGroup(id));

    return data;
};

export const useGetGroupDetail = (id: string) => {
    return useQuery<GroupDetail | undefined, Error>([QUERY_KEY, id], () =>
        fetchGroup(id)
    );
};
