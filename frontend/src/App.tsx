import React from "react";
import {
    ColorScheme,
    ColorSchemeProvider,
    MantineProvider,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { Notifications } from "@mantine/notifications";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "react-query";
import AppRoutes from "./router";
import store from "./app/store";
import { loadUser } from "./features/actions/auth";

const queryClient = new QueryClient();

function App() {
    const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
        key: "splid-color-scheme",
        defaultValue: "dark",
    });

    const toggleColorScheme = (value?: ColorScheme) =>
        setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

    React.useEffect(() => {
        store.dispatch(loadUser() as any);
    });

    return (
        <ColorSchemeProvider
            colorScheme={colorScheme}
            toggleColorScheme={toggleColorScheme}
        >
            <MantineProvider
                theme={{
                    colorScheme,
                }}
                withNormalizeCSS
                withGlobalStyles
            >
                <Notifications />
                <Provider store={store}>
                    <QueryClientProvider client={queryClient}>
                        <AppRoutes />
                    </QueryClientProvider>
                </Provider>
            </MantineProvider>
        </ColorSchemeProvider>
    );
}

export default App;
