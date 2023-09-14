import { Avatar, Box, Group, Paper, Text, Title } from "@mantine/core";
import { IconArrowBadgeRight } from "@tabler/icons-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Link, useParams } from "react-router-dom";

import { Transaction } from "@/types/transactions";
import {
    displayCurrency,
    getFirstCharacterFromString,
} from "@/utils/functions/functions";

dayjs.extend(relativeTime);

type ExpenseTeaserProps = {
    expense: Transaction;
};

const ExpenseTeaser = ({ expense }: ExpenseTeaserProps) => {
    const { id } = useParams<{ id: string }>();

    return (
        <Link to={`/groups/${id}/expenses/${expense.id}`}>
            <div data-cy="expense-teaser">
                <Paper withBorder p="sm" radius="md" mb="md">
                    <Group position="apart" py="sm" noWrap>
                        <Group noWrap>
                            <Avatar radius="xl">
                                {getFirstCharacterFromString(
                                    expense.description
                                )}
                            </Avatar>
                            <Box>
                                <Title order={5}>{expense.description} </Title>
                                <Text size="sm">
                                    {dayjs().to(dayjs(expense.createdAt))}
                                </Text>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <Text size="xs">
                                        {expense.senderUsername}
                                    </Text>
                                    <IconArrowBadgeRight
                                        size={15}
                                        style={{ margin: "0 10px" }}
                                    />
                                    <Text size="xs">
                                        {expense.receiverUsername}
                                    </Text>
                                </div>
                            </Box>
                        </Group>
                        <Title order={5}>
                            {displayCurrency(expense.amount, "EUR")}
                        </Title>
                    </Group>
                </Paper>
            </div>
        </Link>
    );
};
export default ExpenseTeaser;
