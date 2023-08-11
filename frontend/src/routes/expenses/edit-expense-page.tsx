import { Box, Title } from "@mantine/core";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { TExpenseForm } from "../../types/expenses";
import ExpenseForm from "../../features/Expense/ExpenseForm";

const dummyExpense: TExpenseForm = {
    name: "Dummy Expense",
    category: "food",
    amount: 100,
    currency: "EUR",
    from: "1",
    for: [
        { user: { id: 2, name: "User 2" }, percentage: 50 },
        { user: { id: 3, name: "User 3" }, percentage: 50 },
    ],
    buyDate: new Date(),
    createdAt: new Date(),
};

const EditExpensePage = () => {
    const { expenseId } = useParams<{ expenseId: string; id: string }>();

    const [isSubmitting, setIsSubmitting] = useState(false);
    function handleSubmit(data: TExpenseForm) {
        setIsSubmitting(true);

        setTimeout(() => {
            setIsSubmitting(false);
        }, 2000);

        console.log(data);
    }
    return (
        <div>
            <Title mb="md">Ausgabe bearbeiten</Title>
            <Box mb="xl">
                <ExpenseForm
                    isSubmitting={isSubmitting}
                    onSubmit={(data) => handleSubmit(data)}
                    defaultValues={dummyExpense}
                />
            </Box>
        </div>
    );
};
export default EditExpensePage;
