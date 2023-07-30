import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./routes/home";
import Login from "./routes/login";
import Register from "./routes/register";
import Groups from "./routes/groups/groups";
import GroupPage from "./routes/groups/group-page";
import CreateGroup from "./routes/groups/create-group";
import UserSettings from "./routes/users/user-settings";
import NotFound from "./routes/not-found";
import PrivateRoute from "./components/Routing/PrivateRoute";
import AppShell from "./components/Routing/AppShell";

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
