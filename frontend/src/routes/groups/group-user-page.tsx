import { Link, useParams } from "react-router-dom";
import { dummyExpenses, dummyUsers } from "../../utils/data/data";
import { Avatar, Group, Paper, TextInput, Title } from "@mantine/core";
import { useFilterData } from "../../utils/hooks/useFilterData";
import { IconSearch } from "@tabler/icons-react";
import ExpenseTeaser from "../../features/Group/Expense/ExpenseTeaser";

const GroupUserPage = () => {
    const { userId } = useParams<{ userId: string }>();

    const user = dummyUsers.find((user) => user.id === parseInt(userId || ""));

    const filteredExpenses = dummyExpenses.filter(
        (expense) => expense.from.id === parseInt(userId || "")
    );

    const { setSearchQuery, searchQuery, filteredData } = useFilterData(
        filteredExpenses,
        "name"
    );

    return (
        <div>
            <Link to="edit">Benutzer bearbeiten</Link>
            <Group my="md">
                <Avatar radius="xl" />
                <Title order={2}>{user?.name}</Title>
            </Group>

            <Paper withBorder p="sm" mb="md" radius="md">
                <Group position="apart">
                    <Title order={3}>Saldo</Title>
                    <Title order={3}>200 €</Title>
                </Group>
            </Paper>
            <Title order={4} mb="md">
                Nutzer Ausgaben
            </Title>
            <TextInput
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.currentTarget.value)}
                mb="md"
                placeholder="Search Expenses"
                icon={<IconSearch size={20} />}
            />
            {filteredData.map((expense) => {
                return <ExpenseTeaser key={expense.id} expense={expense} />;
            })}
        </div>
    );
};
export default GroupUserPage;
