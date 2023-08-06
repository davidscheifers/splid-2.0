import { Box, Group, Title } from "@mantine/core";
import PieChartComponent from "../../components/Charts/PieChart";
import { BalancePreview } from "../balance/balance";
import { dummyBalance } from "../../utils/data/data";
import { useParams } from "react-router-dom";

const data = [
    { name: "User 1", value: 400 },
    { name: "User 2", value: 300 },
    { name: "User 3", value: 300 },
];

const TotalExpenses = () => {
    const { id } = useParams<{ id: string }>();

    const userBalances = dummyBalance.map((balance) => {
        return (
            <BalancePreview
                groudId={parseInt(id || "-1")}
                balance={balance}
                key={balance.id}
            />
        );
    });
    return (
        <div>
            <Title>Total Expenses</Title>
            <div style={{ display: "flex", justifyContent: "center" }}>
                <div style={{ width: "300px", height: "300px" }}>
                    <PieChartComponent data={data} />
                </div>
            </div>
            <Group position="apart" mb="md">
                <Title order={3}>Total Expenses</Title>
                <Title order={2}>1000 €</Title>
            </Group>

            <Box>
                <Title order={3} mb="md">
                    Total User Expenses
                </Title>
                {userBalances}
            </Box>
        </div>
    );
};
export default TotalExpenses;
