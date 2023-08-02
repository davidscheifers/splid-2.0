import { Route, Routes } from "react-router-dom";
import GroupNavigation from "../../features/Group/GroupNavigation";
import Expenses from "../expenses/expenses";
import ExpensePage from "../expenses/expense-page";
import GroupUserPage from "./group-user-page";
import GroupOverview from "./group-overview";

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
                path={`expenses/create`}
                element={<div>create expense</div>}
            />
            <Route
                path={`expenses/total`}
                element={<div>total expense overview</div>}
            />
            <Route
                path={`users/create`}
                element={<div>create user in group</div>}
            />
            <Route path={`users/:userId`} element={<GroupUserPage />} />
            <Route path={`settings`} element={<div>Group Settings</div>} />
        </Routes>
    );
};
export default GroupPage;
