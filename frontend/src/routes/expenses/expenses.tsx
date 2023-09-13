import { Accordion, Title } from "@mantine/core";
import { useParams } from "react-router-dom";

import { useGetOneQuery } from "@/api/GenericCalls/useGetOneQuery";
import LoadingComponent from "@/components/LoadingComponent/LoadingComponent";
import ExpenseTeaser from "@/features/Group/Expense/ExpenseTeaser";
import { Transaction } from "@/types/transactions";
import { apiEndPoints } from "@/utils/constants/constants";
import { displayCurrency, groupBy } from "@/utils/functions/functions";

const Expenses = () => {
    const { id } = useParams<{ id: string }>();

    const { data, status } = useGetOneQuery<Transaction[]>({
        url: apiEndPoints.group.getTransactionsFromGroup(id || ""),
        id: id || "",
        invalidationProperty: "groupTransactions",
    });

    const groupedExpenses = groupBy(
        data?.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)) ||
            [],
        "description"
    );

    return (
        <>
            <LoadingComponent
                status={status}
                errorMessage="Ausgaben konnten nicht geladen werden..."
            >
                <Title mb="lg">Ausgaben</Title>
                <Accordion
                    variant="separated"
                    multiple
                    defaultValue={Object.keys(groupedExpenses)}
                >
                    {Object.keys(groupedExpenses).map((key) => {
                        const positiveTransaction = groupedExpenses[key].find(
                            (expense: Transaction) => expense.amount > 0
                        );

                        return (
                            <Accordion.Item value={key}>
                                <Accordion.Control>
                                    {key} ({positiveTransaction?.senderUsername}
                                    ,{" "}
                                    {displayCurrency(
                                        positiveTransaction?.amount || 0,
                                        "EUR"
                                    )}
                                    )
                                </Accordion.Control>
                                <Accordion.Panel>
                                    <Title order={5} mb="sm">
                                        Transaktionen
                                    </Title>
                                    {groupedExpenses[key].map(
                                        (expense: Transaction) => {
                                            return (
                                                <ExpenseTeaser
                                                    key={expense.id}
                                                    expense={expense}
                                                />
                                            );
                                        }
                                    )}
                                </Accordion.Panel>
                            </Accordion.Item>
                        );
                    })}
                </Accordion>
            </LoadingComponent>
        </>
    );
};
export default Expenses;
