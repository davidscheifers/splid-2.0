import { Box, Title } from "@mantine/core";
import ExpenseForm from "../../features/Expense/ExpenseForm";
import { TExpenseForm } from "../../types/expenses";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useCreateMutation } from "../../api/GenericCalls/useCreateMutation";
import { apiEndPoints } from "../../utils/constants/constants";

const CreateExpensePage = () => {
    const { id } = useParams<{ expenseId: string; id: string }>();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const { createMutation } = useCreateMutation({
        url: apiEndPoints.transaction.createTransaction,
        entityName: "Transaktion",
        invalidationProperty: "groupTransactions",
        successNavigationPath: `/groups/${id}/expenses`,
    });

    function handleSubmit(data: TExpenseForm) {
        setIsSubmitting(true);

        createMutation.mutate(data);
    }

    return (
        <div>
            <Title mb="md">Ausgabe erstellen</Title>
            <Box mb="xl">
                <ExpenseForm
                    isSubmitting={isSubmitting}
                    onSubmit={(data) => handleSubmit(data)}
                    groupId={id || ""}
                />
            </Box>
        </div>
    );
};
export default CreateExpensePage;
