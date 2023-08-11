import { TextInput, Title } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

import ExpenseTeaser from "../../features/Group/Expense/ExpenseTeaser";

import { useFilterData } from "../../utils/hooks/useFilterData";
import { useParams } from "react-router-dom";
import { useGetGroupExpenses } from "../../api/Groups/useGetExpensesFromGroup";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";

const Expenses = () => {
    const { id } = useParams<{ id: string }>();

    const { data, status } = useGetGroupExpenses(id || "");

    const { setSearchQuery, searchQuery, filteredData } = useFilterData(
        data || [],
        "description"
    );

    console.log(data);

    return (
        <>
            <LoadingComponent
                status={status}
                errorMessage="Ausgaben konnten nicht geladen werden..."
            >
                <Title mb="lg">Ausgaben</Title>
                <TextInput
                    value={searchQuery}
                    onChange={(event) =>
                        setSearchQuery(event.currentTarget.value)
                    }
                    mb="md"
                    placeholder="Search Expenses"
                    icon={<IconSearch size={20} />}
                />
                {filteredData.length > 0 ? (
                    <>
                        {filteredData.map((expense) => {
                            return (
                                <ExpenseTeaser
                                    key={expense.id}
                                    expense={expense}
                                />
                            );
                        })}
                    </>
                ) : (
                    <Title order={4}>Keine ausgaben gefunden</Title>
                )}
            </LoadingComponent>
        </>
    );
};
export default Expenses;
