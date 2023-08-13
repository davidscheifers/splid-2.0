import { Box, Title } from "@mantine/core";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { TExpenseForm } from "../../types/expenses";
import ExpenseForm from "../../features/Expense/ExpenseForm";
import { useGetOneQuery } from "../../api/GenericCalls/useGetOneQuery";
import { Transaction } from "../../types/transactions";
import { apiEndPoints } from "../../utils/constants/constants";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import { useUpdateMutation } from "../../api/GenericCalls/useUpdate";

const EditExpensePage = () => {
    const { expenseId, id } = useParams<{ expenseId: string; id: string }>();

    const { data, status } = useGetOneQuery<Transaction>({
        url: apiEndPoints.transaction.getTransaction(expenseId || ""),
        id: expenseId || "",
        invalidationProperty: "transaction",
    });

    const { updateMutation } = useUpdateMutation({
        url: apiEndPoints.transaction.updateTransaction(expenseId || ""),
        entityName: "Transaktion",
        invalidationProperty: "transaction",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    function handleSubmit(data: TExpenseForm) {
        setIsSubmitting(true);

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
                <ExpenseForm
                    isSubmitting={isSubmitting}
                    onSubmit={(data) => handleSubmit(data)}
                    defaultValues={data}
                    groupId={id || ""}
                />
            </Box>
        </LoadingComponent>
    );
};
export default EditExpensePage;
