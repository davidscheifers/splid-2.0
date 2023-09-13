import { Group, Paper, Title, Text } from "@mantine/core";
import { useParams } from "react-router-dom";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import { useGetOneQuery } from "../../api/GenericCalls/useGetOneQuery";
import { apiEndPoints } from "../../utils/constants/constants";
import { SettlingDebtsResponse } from "../../types/accounting";
import { displayCurrency } from "../../utils/functions/functions";
import UserPreview from "../../components/User/UserPreview";
import { IconArrowRight } from "@tabler/icons-react";

const GroupSettlingDebts = () => {
    const { id } = useParams<{ id: string }>();

    const { data, status } = useGetOneQuery<SettlingDebtsResponse[]>({
        url: apiEndPoints.accounting.getSettlingDebtsFromGroup(id || ""),
        id: id || "",
        invalidationProperty: "settlingDebts",
    });

    const debtsExist = data && data.length > 0;

    return (
        <LoadingComponent status={status}>
            <Title order={1}>Ausgleichen</Title>
            <Text mb="md">
                Hier kannst du sehen, wer wem wie viel bezahlen muss, um seine
                Schulden auszugleichen.
            </Text>
            {debtsExist ? (
                <>
                    {data?.map((debt) => {
                        return <DebtPreview key={debt.id} debt={debt} />;
                    })}
                </>
            ) : (
                <Text>
                    Es gibt keine Schulden, die beglichen werden müssen.
                </Text>
            )}
        </LoadingComponent>
    );
};

type DebtPreviewProps = {
    debt: SettlingDebtsResponse;
};

const DebtPreview = ({ debt }: DebtPreviewProps) => {
    const { id } = useParams<{ id: string }>();

    const amount = displayCurrency(debt.amount || 0, "EUR");

    return (
        <Paper withBorder p="sm" mb="md" radius="md">
            <Group position="apart">
                <Group>
                    <UserPreview
                        key={debt.senderUsername}
                        link={`/groups/${id}/users/${debt.senderUsername}`}
                        user={{
                            name: debt.senderUsername,
                            id: debt.senderUsername,
                        }}
                    />
                    <IconArrowRight size={20} stroke={1.5} />
                    <UserPreview
                        key={debt.receiverUsername}
                        link={`/groups/${id}/users/${debt.receiverUsername}`}
                        user={{
                            name: debt.receiverUsername,
                            id: debt.receiverUsername,
                        }}
                    />
                </Group>
                <Title order={4}>{amount}</Title>
            </Group>
        </Paper>
    );
};
export default GroupSettlingDebts;
