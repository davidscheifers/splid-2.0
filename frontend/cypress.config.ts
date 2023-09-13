import { defineConfig } from "cypress";

export default defineConfig({
    env: {
        apiUrl: "https://elvip7nvnf.execute-api.eu-central-1.amazonaws.com",
        baseUrl: "http://localhost:5173",
    },
    e2e: {
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
    },
});
