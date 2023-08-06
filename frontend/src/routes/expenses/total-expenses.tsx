import { Title } from "@mantine/core";
import PieChartComponent from "../../components/Charts/PieChart";

const data = [
    { name: "User 1", value: 400 },
    { name: "User 2", value: 300 },
    { name: "User 3", value: 300 },
];

const TotalExpenses = () => {
    return (
        <div>
            <Title>Total Expenses</Title>
            <div style={{ width: "500px", height: "500px" }}>
                <PieChartComponent data={data} />
            </div>
        </div>
    );
};
export default TotalExpenses;
