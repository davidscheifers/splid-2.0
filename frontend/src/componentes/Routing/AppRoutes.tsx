import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "../../pages/home";
import Login from "../../pages/login";
import NotFound from "../../pages/not-found";
import PrivateRoute from "./PrivateRoute";
import Groups from "../../pages/groups";
import CreateGroup from "../../pages/create-group";
import Register from "../../pages/register";
import GroupPage from "../../pages/group-page";
import UserSettings from "../../pages/user-settings";

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/groups"
                    element={
                        <PrivateRoute>
                            <Groups />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/groups/:id/*"
                    element={
                        <PrivateRoute>
                            <GroupPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/groups/create"
                    element={
                        <PrivateRoute>
                            <CreateGroup />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/settings"
                    element={
                        <PrivateRoute>
                            <UserSettings />
                        </PrivateRoute>
                    }
                />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
};
export default AppRoutes;
