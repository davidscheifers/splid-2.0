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
import AppShell from "./AppShell";

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
                            <AppShell>
                                <Groups />
                            </AppShell>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/groups/:id/*"
                    element={
                        <PrivateRoute>
                            <AppShell>
                                <GroupPage />
                            </AppShell>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/groups/create"
                    element={
                        <PrivateRoute>
                            <AppShell>
                                <CreateGroup />
                            </AppShell>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/settings"
                    element={
                        <PrivateRoute>
                            <AppShell>
                                <UserSettings />
                            </AppShell>
                        </PrivateRoute>
                    }
                />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
};
export default AppRoutes;
