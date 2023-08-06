import { Title } from "@mantine/core";
import { useParams } from "react-router-dom";

const EditExpensePage = () => {
    const { expenseId, id } = useParams<{ expenseId: string; id: string }>();

    return (
        <div>
            <Title>Edit expense with id {expenseId}</Title>
        </div>
    );
};
export default EditExpensePage;
