import { Route, Routes } from "react-router-dom";
import GroupNavigation from "../../features/Group/GroupNavigation";
import Expenses from "../expenses/expenses";
import ExpensePage from "../expenses/expense-page";
import GroupUserPage from "./group-user-page";
import GroupOverview from "./group-overview";
import EditExpensePage from "../expenses/edit-expense-page";
import CreateExpensePage from "../expenses/create-expense-page";
import CreateUserPage from "../users/create-user";
import EditUserPage from "../users/edit-user";
import TotalExpenses from "../expenses/total-expenses";
import EditGroupPage from "./edit-group-page";

const GroupPage = () => {
    return (
        <>
            <GroupNavigation />
            <div style={{ marginBottom: "100px" }}>
                <Routes>
                    <Route path="" element={<GroupOverview />} />
                    <Route path={`expenses`} element={<Expenses />} />
                    <Route
                        path={`expenses/:expenseId`}
                        element={<ExpensePage />}
                    />
                    <Route
                        path={`expenses/:expenseId/edit`}
                        element={<EditExpensePage />}
                    />
                    <Route path={`settings`} element={<EditGroupPage />} />
                    <Route
                        path={`expenses/create`}
                        element={<CreateExpensePage />}
                    />
                    <Route
                        path={`expenses/total`}
                        element={<TotalExpenses />}
                    />
                    <Route path={`users/create`} element={<CreateUserPage />} />
                    <Route path={`users/:userId`} element={<GroupUserPage />} />
                    <Route
                        path={`users/:userId/edit`}
                        element={<EditUserPage />}
                    />
                </Routes>
            </div>
        </>
    );
};
export default GroupPage;
