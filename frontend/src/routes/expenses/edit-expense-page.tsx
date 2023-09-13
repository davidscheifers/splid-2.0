import { Box, Title } from "@mantine/core";
import { useParams } from "react-router-dom";

import { useGetOneQuery } from "@/api/GenericCalls/useGetOneQuery";
import { useUpdateMutation } from "@/api/GenericCalls/useUpdate";
import LoadingComponent from "@/components/LoadingComponent/LoadingComponent";
import TransactionForm from "@/features/Expense/TransactionForm";
import { TExpenseForm } from "@/types/expenses";
import { Transaction } from "@/types/transactions";
import { apiEndPoints } from "@/utils/constants/constants";

const EditExpensePage = () => {
    const { expenseId, id } = useParams<{ expenseId: string; id: string }>();

    const { data, status } = useGetOneQuery<Transaction>({
        url: apiEndPoints.transaction.getTransaction(expenseId || ""),
        id: expenseId || "",
        invalidationProperty: "transaction",
    });

    const { updateMutation, loading, setLoading } = useUpdateMutation({
        url: apiEndPoints.transaction.updateTransaction(expenseId || ""),
        entityName: "Transaktion",
        invalidationProperty: "transaction",
    });

    function handleSubmit(data: TExpenseForm) {
        setLoading(true);

        const obj = {
            ...data,
            id: expenseId || "",
            createdAt: new Date().toISOString(),
        };

        console.log(obj);

        updateMutation.mutate(obj);
    }

    return (
        <LoadingComponent status={status}>
            <Title mb="md">Ausgabe bearbeiten</Title>
            <Box mb="xl">
                <TransactionForm
                    isSubmitting={loading}
                    onSubmit={(data) => handleSubmit(data)}
                    defaultValues={data}
                    groupId={id || ""}
                />
            </Box>
        </LoadingComponent>
    );
};
export default EditExpensePage;
