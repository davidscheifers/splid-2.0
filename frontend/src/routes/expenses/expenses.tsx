import { Button, Group, TextInput, Title } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { Link } from "react-router-dom";

import ExpenseTeaser from "../../features/Group/Expense/ExpenseTeaser";

import { dummyExpenses } from "../../utils/data/data";
import { useFilterData } from "../../utils/hooks/useFilterData";

const Expenses = () => {
    const { setSearchQuery, searchQuery, filteredData } = useFilterData(
        dummyExpenses,
        "name"
    );

    return (
        <>
            <Group position="apart" mb="lg">
                <Title>Expenses</Title>
                <Link to="create">
                    <Button variant="default">Create Expense</Button>
                </Link>
            </Group>
            <TextInput
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.currentTarget.value)}
                mb="md"
                placeholder="Search Expenses"
                icon={<IconSearch size={20} />}
            />
            {filteredData.map((expense) => {
                return <ExpenseTeaser key={expense.id} expense={expense} />;
            })}
        </>
    );
};
export default Expenses;
