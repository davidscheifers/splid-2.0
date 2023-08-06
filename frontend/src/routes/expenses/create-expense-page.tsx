import { Box, Title } from "@mantine/core";
import ExpenseForm from "../../features/Expense/ExpenseForm";
import { TExpenseForm } from "../../types/expenses";
import { useState } from "react";

const CreateExpensePage = () => {
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
            <Title mb="md">Create Expense</Title>
            <Box mb="xl">
                <ExpenseForm
                    isSubmitting={isSubmitting}
                    onSubmit={(data) => handleSubmit(data)}
                />
            </Box>
        </div>
    );
};
export default CreateExpensePage;
