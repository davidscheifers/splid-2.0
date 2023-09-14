import { Avatar, Group, Paper, TextInput, Title } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { Link, useParams } from "react-router-dom";

import Balance from "../balance/balance";

import { useGetOneQuery } from "@/api/GenericCalls/useGetOneQuery";
import LoadingComponent from "@/components/LoadingComponent/LoadingComponent";
import ExpenseTeaser from "@/features/Group/Expense/ExpenseTeaser";
import { Transaction } from "@/types/transactions";
import { apiEndPoints } from "@/utils/constants/constants";
import { displayCurrency } from "@/utils/functions/functions";
import { useFilterData } from "@/utils/hooks/useFilterData";

const GroupUserPage = () => {
    const { userId, id } = useParams<{ userId: string; id: string }>();

    const { data, status } = useGetOneQuery({
        url: apiEndPoints.user.getUserInformations(userId || ""),
        id: userId || "",
        invalidationProperty: "groupUser",
    });

    const transactions = useGetOneQuery<Transaction[]>({
        url: apiEndPoints.group.getTransactionsFromGroup(id || ""),
        id: id || "",
        invalidationProperty: "groupTransactions",
    });

    const balances = useGetOneQuery<Balance[]>({
        url: apiEndPoints.accounting.getAccountingInformationsFromGroup(
            id || ""
        ),
        id: id || "",
        invalidationProperty: "goupAccounting",
    });

    const filteredBalance = balances?.data?.find(
        (balance) => balance.username === userId
    );

    const filteredExpenses = transactions?.data?.filter(
        (transaction) => transaction.senderUsername === userId
    );

    const { setSearchQuery, searchQuery, filteredData } = useFilterData(
        filteredExpenses || [],
        "senderUsername"
    );

    return (
        <LoadingComponent status={status}>
            <Link to="edit">Benutzer bearbeiten</Link>
            <Group my="md">
                <Avatar radius="xl" />
                <Title order={2}>{data?.username}</Title>
            </Group>

            <Paper withBorder p="sm" mb="md" radius="md">
                <Group position="apart">
                    <Title order={3}>Balance</Title>
                    <Title order={3}>
                        {displayCurrency(filteredBalance?.balance || 0, "EUR")}
                    </Title>
                </Group>
            </Paper>
            <Title order={4} mb="md">
                Nutzer Transaktionen
            </Title>
            <TextInput
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.currentTarget.value)}
                mb="md"
                placeholder="Nutzertransaktionen suchen"
                icon={<IconSearch size={20} />}
            />
            {filteredData.map((expense) => {
                return <ExpenseTeaser key={expense.id} expense={expense} />;
            })}
        </LoadingComponent>
    );
};
export default GroupUserPage;
