import { Box, Title } from "@mantine/core";
import { useParams } from "react-router-dom";

import { useCreateMutation } from "@/api/GenericCalls/useCreateMutation";
import ExpenseForm from "@/features/Expense/ExpenseForm";
import { TExpenseForm } from "@/types/expenses";
import { apiEndPoints } from "@/utils/constants/constants";

const CreateExpensePage = () => {
    const { id } = useParams<{ expenseId: string; id: string }>();

    const { createMutation, loading, setLoading } = useCreateMutation({
        url: apiEndPoints.transaction.createTransaction,
        entityName: "Transaktion",
        invalidationProperty: "groupTransactions",
        successNavigationPath: `/groups/${id}/expenses`,
    });

    function handleSubmit(
        data: TExpenseForm,
        receiverPercentage: number,
        senderPercentage: number
    ) {
        setLoading(true);

        if (receiverPercentage + senderPercentage !== 100) {
            alert("Die Summe der Anteile muss 100% ergeben");
        }

        if (senderPercentage === 100) {
            // handle payment
            const dto = [
                // first complete amount to sender
                {
                    description: data.description,
                    amount: data.amount,
                    groupId: data.groupId,
                    senderUsername: data.senderUsername,
                    receiverUsername: data.senderUsername,
                },
                // then minus amount to the receiver
                {
                    description: data.description,
                    amount: data.amount * -1,
                    groupId: data.groupId,
                    senderUsername: data.senderUsername,
                    receiverUsername: data.receiverUsername,
                },
            ];
            createMutation.mutate(dto);
            return;
        }

        if (receiverPercentage === 100) {
            // handle later
            setLoading(false);
            return;
        }

        const dto = [
            // first complete amount to sender
            {
                description: data.description,
                amount: data.amount,
                groupId: data.groupId,
                senderUsername: data.senderUsername,
                receiverUsername: data.senderUsername,
            },
            // then minus percentage amount to the receiver
            {
                description: data.description,
                amount: (senderPercentage / 100) * data.amount * -1,
                groupId: data.groupId,
                senderUsername: data.senderUsername,
                receiverUsername: data.receiverUsername,
            },
            // then minus percentage amount to the sender
            {
                description: data.description,
                amount: (receiverPercentage / 100) * data.amount * -1,
                groupId: data.groupId,
                senderUsername: data.senderUsername,
                receiverUsername: data.senderUsername,
            },
        ];
        createMutation.mutate(dto);
    }

    return (
        <div>
            <Title mb="md">Ausgabe erstellen</Title>
            <Box mb="xl">
                <ExpenseForm
                    isSubmitting={loading}
                    onSubmit={(data, receiverPercentage, senderPercentage) =>
                        handleSubmit(data, receiverPercentage, senderPercentage)
                    }
                    groupId={id || ""}
                />
            </Box>
        </div>
    );
};
export default CreateExpensePage;
