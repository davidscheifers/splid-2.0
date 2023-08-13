import { Loader, Text } from "@mantine/core";

type LoadingComponentProps = {
    /* status of the data fetching */
    status: "idle" | "loading" | "success" | "error";

    /* children to be rendered when fetching is success */
    children: React.ReactNode;

    /* optional error message to be displayed when fetching is error */
    errorMessage?: string;
};

const LoadingComponent = ({
    status,
    children,
    errorMessage = "Something went wrong",
}: LoadingComponentProps) => {
    const loadingStatus: { [key: string]: React.ReactNode } = {
        loading: (
            <div
                style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <Loader />
            </div>
        ),
        error: <Text>{errorMessage}</Text>,
        success: children,
    };

    return loadingStatus[status] ?? <Text>Etwas ist schief gelaufen</Text>;
};
export default LoadingComponent;
