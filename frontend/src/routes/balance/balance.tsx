import { Button, Group, Paper, Title } from "@mantine/core";
import UserPreview from "../../components/User/UserPreview";
import { displayCurrency } from "../../utils/functions/functions";
import { Link } from "react-router-dom";
import { useGetOneQuery } from "../../api/GenericCalls/useGetOneQuery";
import { apiEndPoints } from "../../utils/constants/constants";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";

type BalanceProps = {
    /* id of the group for this balance */
    groupId: string;
};

//  Shows a list of balances for a group
const Balance = ({ groupId }: BalanceProps) => {
    const { data, status } = useGetOneQuery<Balance[]>({
        url: apiEndPoints.accounting.getAccountingInformationsFromGroup(
            groupId
        ),
        id: groupId,
        invalidationProperty: "goupAccounting",
    });

    return (
        <LoadingComponent status={status}>
            <Title mb="sm" order={2}>
                Balance
            </Title>
            {data?.map((balance) => {
                return (
                    <BalancePreview key={balance.username} balance={balance} />
                );
            })}
            <Link to={`/groups/${groupId}/expenses/total`}>
                <Button fullWidth mb="md">
                    Gesamtkosten
                </Button>
            </Link>
        </LoadingComponent>
    );
};

type Balance = {
    username: string;
    balance: number;
    groupId: string;
};

type BalancePreviewProps = {
    /* balance to display */
    balance: Balance;
};

export function BalancePreview({ balance }: BalancePreviewProps) {
    return (
        <Paper withBorder p="sm" mb="md" radius="md">
            <Group position="apart">
                <UserPreview
                    key={balance.username}
                    link={`/groups/${balance.groupId}/users/${balance.username}`}
                    user={{ name: balance.username, id: balance.username }}
                />
                <Title order={4}>
                    {displayCurrency(balance.balance, "EUR")}
                </Title>
            </Group>
        </Paper>
    );
}
export default Balance;
