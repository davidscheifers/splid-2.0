import { Link } from "react-router-dom";
import { TDummyExpense } from "../../../types/group";
import { Avatar, Group, Title, Text } from "@mantine/core";
import { displayCurrency } from "../../../utils/utils";

type ExpenseTeaserProps = {
    expense: TDummyExpense;
};

const ExpenseTeaser = ({ expense }: ExpenseTeaserProps) => {
    return (
        <Link to={`${expense.id}`}>
            <Group position="apart" py="sm">
                <Group>
                    <Avatar radius="xl" />
                    <div>
                        <Title order={4}>{expense.name}</Title>
                        <Text>{expense.from.name}</Text>
                    </div>
                </Group>
                <Title order={4}>
                    {displayCurrency(expense.amount, expense.currency)}
                </Title>
            </Group>
        </Link>
    );
};
export default ExpenseTeaser;
