import { Box, Group, Title } from "@mantine/core";
import PieChartComponent from "../../components/Charts/PieChart";
import { BalancePreview } from "../balance/balance";

const data = [
    { username: "admin", balance: 249, groupId: "1" },
    { username: "tester", balance: 300, groupId: "1" },
    { username: "max", balance: 120, groupId: "1" },
];

const totalExpenses = data.reduce((acc, curr) => acc + curr.balance, 0);

const chartData = [
    { name: "admin", value: 249 },
    { name: "tester", value: 300 },
    { name: "max", value: 120 },
];

const TotalExpenses = () => {
    const userBalances = data.map((balance) => {
        return <BalancePreview balance={balance} key={balance.username} />;
    });
    return (
        <div>
            <Title>Gesamtausgaben</Title>
            <div style={{ display: "flex", justifyContent: "center" }}>
                <div style={{ width: "300px", height: "300px" }}>
                    <PieChartComponent data={chartData} />
                </div>
            </div>
            <Group position="apart" mb="md">
                <Title order={3}>Gesamtausgaben:</Title>
                <Title order={2}>{totalExpenses} €</Title>
            </Group>

            <Box>
                <Title order={3} mb="md">
                    Ausgaben pro Person:
                </Title>
                {userBalances}
            </Box>
        </div>
    );
};
export default TotalExpenses;
