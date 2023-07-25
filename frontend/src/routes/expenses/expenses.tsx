import { Button, Group, TextInput, Title } from "@mantine/core";
import { Link } from "react-router-dom";
import { IconSearch } from "@tabler/icons-react";
import { useState } from "react";
import ExpenseTeaser from "../../features/Group/Expense/ExpenseTeaser";
import { filterDatasetByStringName } from "../../utils/functions/functions";
import { dummyExpenses } from "../../utils/data/data";

const Expenses = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredGroups = filterDatasetByStringName(
        dummyExpenses,
        "name",
        searchQuery
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
            {filteredGroups.map((expense) => {
                return <ExpenseTeaser key={expense.id} expense={expense} />;
            })}
        </>
    );
};
export default Expenses;
