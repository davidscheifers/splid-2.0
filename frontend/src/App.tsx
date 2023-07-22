import React from "react";
import "./App.css";
import AppRoutes from "./componentes/Routing/AppRoutes";
import store from "./store";
import { loadUser } from "./actions/auth";
import {
    ColorScheme,
    ColorSchemeProvider,
    MantineProvider,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { Notifications } from "@mantine/notifications";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

function App() {
    const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
        key: "crisis-os-color-scheme",
        defaultValue: "light",
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
                    colors: {
                        brand: [
                            "#FFD652",
                            "#FFD447",
                            "#FFD23D",
                            "#FFCF33",
                            "#FFCD29",
                            "#FFCB1F",
                            "#FFC914",
                            "#FFC60A",
                            "#FFC400",
                            "#F5BC00",
                        ],
                    },
                    primaryColor: "brand",
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
