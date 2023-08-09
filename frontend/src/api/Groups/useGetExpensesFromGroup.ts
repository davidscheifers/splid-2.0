import { useQuery } from "react-query";

import { GroupExpense } from "../../types/group";
import { apiEndPoints } from "../../utils/constants/constants";
import http from "../utils/http";

const QUERY_KEY = "GroupExpenses";

export const fetchGroupExpenses = async (
    id: string
): Promise<GroupExpense[]> => {
    const { data } = await http.get(
        apiEndPoints.group.getExpensesFromGroup(id)
    );

    return data;
};

export const useGetGroupExpenses = (id: string) => {
    return useQuery<GroupExpense[], Error>([QUERY_KEY, id], () =>
        fetchGroupExpenses(id)
    );
};
