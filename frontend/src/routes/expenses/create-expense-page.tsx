import { Title } from "@mantine/core";
import ExpenseForm from "../../features/Expense/ExpenseForm";

const CreateExpensePage = () => {
    return (
        <div>
            <Title>Create Expense</Title>
            <ExpenseForm onSubmit={(data) => console.log(data)} />
        </div>
    );
};
export default CreateExpensePage;
