import { Avatar, Group, Title, Text } from "@mantine/core";
import { Link, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { dummyExpenses } from "../../utils/data/data";
import { displayCurrency } from "../../utils/functions/functions";

const ExpensePage = () => {
    const { expenseId, id } = useParams<{ expenseId: string; id: string }>();

    const expense = dummyExpenses.find(
        (expense) => expense.id === parseInt(expenseId || "")
    );

    return (
        <>
            {expense ? (
                <>
                    <Title>{expense.name}</Title>
                    <Text mb="md">{expense.category}</Text>
                    <Group position="apart" mb="md">
                        <Title order={3}>Amount</Title>
                        <Title order={3}>
                            {displayCurrency(expense.amount, expense.currency)}
                        </Title>
                    </Group>
                    <Group position="apart" mb="md">
                        <Title order={3}>Curency</Title>
                        <Title order={3}>{expense.currency}</Title>
                    </Group>
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
                                <Link to={`/groups/${id}/users/${user.id}`}>
                                    <Group key={user.id}>
                                        <Avatar radius="xl" />
                                        <Title order={4}>{user.name}</Title>
                                    </Group>
                                </Link>
                            );
                        })}
                    </Group>
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
                </>
            ) : (
                <Text>Expense not found</Text>
            )}
        </>
    );
};
export default ExpensePage;
