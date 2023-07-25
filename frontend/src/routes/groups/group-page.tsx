import { Title } from "@mantine/core";
import { Route, Routes, useParams } from "react-router-dom";
import GroupNavigation from "../../features/Group/GroupNavigation";
import Balance from "../balance/balance";
import Expenses from "../expenses/expenses";
import ExpensePage from "../expenses/expense-page";

const GroupPage = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <Routes>
            <Route
                path=""
                element={
                    <div>
                        <GroupNavigation />
                        <Title order={1}>Group Overview {id}</Title>
                    </div>
                }
            />
            <Route
                path={`balance`}
                element={
                    <div>
                        <GroupNavigation />
                        <Balance />
                    </div>
                }
            />
            <Route
                path={`expenses`}
                element={
                    <div>
                        <GroupNavigation />
                        <Expenses />
                    </div>
                }
            />
            <Route
                path={`expenses/:id`}
                element={
                    <div>
                        <GroupNavigation />
                        <ExpensePage />
                    </div>
                }
            />
            <Route
                path={`expenses/create`}
                element={<div>create expense</div>}
            />
            <Route path={`users/:id`} element={<div>single group user</div>} />
            <Route path={`settings`} element={<div>Group Settings</div>} />
        </Routes>
    );
};
export default GroupPage;
