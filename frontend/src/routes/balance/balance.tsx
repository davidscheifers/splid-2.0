import { Button, Group, Paper, Title } from "@mantine/core";
import UserPreview from "../../components/User/UserPreview";
import { TDummyBalance } from "../../types/group";
import { dummyBalance } from "../../utils/data/data";
import { displayCurrency } from "../../utils/functions/functions";
import { Link } from "react-router-dom";

type BalanceProps = {
    /* id of the group for this balance */
    groudId: number;
};

//  Shows a list of balances for a group
const Balance = ({ groudId }: BalanceProps) => {
    const userBalances = dummyBalance.map((balance) => {
        return (
            <BalancePreview
                groudId={groudId}
                balance={balance}
                key={balance.id}
            />
        );
    });

    return (
        <>
            <Title mb="sm" order={2}>
                Balance
            </Title>
            {userBalances}
            <Link to={`/groups/${groudId}/expenses/total`}>
                <Button fullWidth mb="md">
                    Gesamtkosten
                </Button>
            </Link>
        </>
    );
};

type BalancePreviewProps = {
    /* balance to display */
    balance: TDummyBalance;

    /* id of the group for this balance */
    groudId: number;
};

export function BalancePreview({ balance, groudId }: BalancePreviewProps) {
    return (
        <Paper withBorder p="sm" mb="md" radius="md">
            <Group position="apart">
                <UserPreview
                    key={balance.id}
                    link={`/groups/${groudId}/users/${balance.user.id}`}
                    user={balance.user}
                />
                <Title order={4}>
                    {displayCurrency(balance.amount, balance.currency)}
                </Title>
            </Group>
        </Paper>
    );
}
export default Balance;
