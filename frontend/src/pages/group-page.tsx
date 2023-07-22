import { Title } from "@mantine/core";
import { Route, Routes, useParams } from "react-router-dom";
import Balance from "./balance";
import Expenses from "./expenses";

const GroupPage = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <Routes>
            <Route
                path=""
                element={
                    <div>
                        <Title order={1}>Group Overview {id}</Title>
                    </div>
                }
            />
            <Route path={`balance`} element={<Balance />} />
            <Route path={`expenses`} element={<Expenses />} />
            <Route path={`expenses/:id`} element={<div>single expense</div>} />
            <Route
                path={`expenses/create`}
                element={<div>create expense</div>}
            />
            <Route path={`settings`} element={<div>Group Settings</div>} />
        </Routes>
    );
};
export default GroupPage;
