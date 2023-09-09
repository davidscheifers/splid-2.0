import { Link, useParams } from "react-router-dom";
import { Avatar, Group, Title, Text, Box, Paper } from "@mantine/core";
import {
    displayCurrency,
    getFirstCharacterFromString,
} from "../../../utils/functions/functions";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Transaction } from "../../../types/transactions";
import { IconArrowBadgeRight } from "@tabler/icons-react";

dayjs.extend(relativeTime);

type ExpenseTeaserProps = {
    expense: Transaction;
};

const ExpenseTeaser = ({ expense }: ExpenseTeaserProps) => {
    const { id } = useParams<{ id: string }>();

    return (
        <Link to={`/groups/${id}/expenses/${expense.id}`}>
            <Paper withBorder p="sm" radius="md" mb="md">
                <Group position="apart" py="sm" noWrap>
                    <Group noWrap>
                        <Avatar radius="xl">
                            {getFirstCharacterFromString(expense.description)}
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
                                <Text size="xs">{expense.senderUsername}</Text>
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
        </Link>
    );
};
export default ExpenseTeaser;
