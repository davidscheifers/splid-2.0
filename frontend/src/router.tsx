import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import AppShell from "./components/Routing/AppShell";
import PrivateRoute from "./components/Routing/PrivateRoute";
import CreateGroup from "./routes/groups/create-group";
import GroupPage from "./routes/groups/group-page";
import Groups from "./routes/groups/groups";
import JoinGroup from "./routes/groups/join-group";
import HomePage from "./routes/home";
import Login from "./routes/login";
import NotFound from "./routes/not-found";
import Register from "./routes/register";
import UserSettings from "./routes/users/user-settings";

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
                    path="/groups/join"
                    element={
                        <PrivateRoute>
                            <AppShell>
                                <JoinGroup />
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
