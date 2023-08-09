import { Link, useParams } from "react-router-dom";
import { GroupExpense } from "../../../types/group";
import { Avatar, Group, Title, Text } from "@mantine/core";
import { displayCurrency } from "../../../utils/functions/functions";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

type ExpenseTeaserProps = {
    expense: GroupExpense;
};

const ExpenseTeaser = ({ expense }: ExpenseTeaserProps) => {
    const { id } = useParams<{ id: string }>();

    return (
        <Link to={`/groups/${id}/expenses/${expense.id}`}>
            <Group position="apart" py="sm">
                <Group>
                    <Avatar radius="xl" />
                    <div>
                        <Title order={4}>{expense.description}</Title>
                        <Text>{dayjs().to(dayjs(expense.createdAt))}</Text>
                    </div>
                </Group>
                <Title order={4}>
                    {displayCurrency(expense.amount, "EUR")}
                </Title>
            </Group>
        </Link>
    );
};
export default ExpenseTeaser;
