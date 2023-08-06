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

const GroupPage = () => {
    return (
        <Routes>
            <Route
                path=""
                element={
                    <>
                        <GroupNavigation />
                        <GroupOverview />
                    </>
                }
            />
            <Route
                path={`expenses`}
                element={
                    <>
                        <GroupNavigation />
                        <Expenses />
                    </>
                }
            />
            <Route
                path={`expenses/:expenseId`}
                element={
                    <>
                        <GroupNavigation />
                        <ExpensePage />
                    </>
                }
            />
            <Route
                path={`expenses/:expenseId/edit`}
                element={
                    <>
                        <GroupNavigation />
                        <EditExpensePage />
                    </>
                }
            />
            <Route path={`expenses/create`} element={<CreateExpensePage />} />
            <Route path={`expenses/total`} element={<TotalExpenses />} />
            <Route path={`users/create`} element={<CreateUserPage />} />
            <Route path={`users/:userId`} element={<GroupUserPage />} />
            <Route path={`users/:userId/edit`} element={<EditUserPage />} />
            <Route path={`settings`} element={<div>Group Settings</div>} />
        </Routes>
    );
};
export default GroupPage;
