import { Route, Routes } from "react-router-dom";

import EditGroupPage from "./edit-group-page";
import GroupOverview from "./group-overview";
import GroupSettlingDebts from "./group-settling-debts";
import GroupUserPage from "./group-user-page";

import CreateExpensePage from "../expenses/create-expense-page";
import EditExpensePage from "../expenses/edit-expense-page";
import ExpensePage from "../expenses/expense-page";
import Expenses from "../expenses/expenses";
import TotalExpenses from "../expenses/total-expenses";
import CreateUserPage from "../users/create-user";
import EditUserPage from "../users/edit-user";

import GroupNavigation from "@/features/Group/GroupNavigation";

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
                        path={`accounting`}
                        element={<GroupSettlingDebts />}
                    />
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
