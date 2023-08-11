import { Avatar, Group, Title, Text, Paper, Box, Button } from "@mantine/core";
import { Link, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { dummyExpenses } from "../../utils/data/data";
import { displayCurrency } from "../../utils/functions/functions";
import UserPreview from "../../components/User/UserPreview";

const ExpensePage = () => {
    const { expenseId, id } = useParams<{ expenseId: string; id: string }>();

    const expense = dummyExpenses.find(
        (expense) => expense.id === parseInt(expenseId || "")
    );

    return (
        <>
            {expense ? (
                <>
                    <Box mb="md">
                        <Title>{expense.name}</Title>
                        <Text>{expense.category}</Text>
                        <Link to={`/groups/${id}/expenses/${expenseId}/edit`}>
                            <Button variant="outline" size="sm">
                                Bearbeiten
                            </Button>
                        </Link>
                    </Box>

                    <Paper withBorder p="sm" mb="md" radius="md">
                        <Group position="apart" mb="md">
                            <Title order={3}>Amount</Title>
                            <Title order={3}>
                                {displayCurrency(
                                    expense.amount,
                                    expense.currency
                                )}
                            </Title>
                        </Group>
                        <Group position="apart">
                            <Title order={3}>Curency</Title>
                            <Title order={3}>{expense.currency}</Title>
                        </Group>
                    </Paper>

                    <Paper withBorder p="sm" mb="md" radius="md">
                        <Group position="apart" mb="md">
                            <Title order={3}>From</Title>
                            <Group>
                                <Avatar radius="xl" />
                                <Title order={4}>{expense.from.name}</Title>
                            </Group>
                        </Group>
                        <Title mb="md" order={3}>
                            For
                        </Title>
                        <Group mb="md">
                            {expense.for.map((user) => {
                                return (
                                    <UserPreview
                                        key={user.id}
                                        user={user}
                                        link={`/groups/${id}/users/${user.id}`}
                                    />
                                );
                            })}
                        </Group>
                    </Paper>

                    <Paper withBorder p="sm" mb="md" radius="md">
                        <Group position="apart" mb="md">
                            <Title order={3}>Bought At</Title>
                            <Title order={4}>
                                {dayjs(expense.buyDate).format("DD.MM.YYYY")}
                            </Title>
                        </Group>
                        <Group position="apart" mb="md">
                            <Title order={3}>Created At</Title>
                            <Title order={4}>
                                {dayjs(expense.createdAt).format("DD.MM.YYYY")}
                            </Title>
                        </Group>
                    </Paper>
                </>
            ) : (
                <Text>Expense not found</Text>
            )}
        </>
    );
};
export default ExpensePage;
