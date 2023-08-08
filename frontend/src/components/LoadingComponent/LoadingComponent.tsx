type LoadingComponentProps = {
    /* status of the data fetching */
    status: "idle" | "loading" | "success" | "error";

    /* children to be rendered when fetching is success */
    children: React.ReactNode;

    /* optional error message to be displayed when fetching is error */
    errorMessage?: string;

    /* optional loading message to be displayed when fetching is loading */
    loadingMessage?: string;
};

const LoadingComponent = ({
    status,
    children,
    errorMessage = "Something went wrong",
    loadingMessage = "loading...",
}: LoadingComponentProps) => {
    const loadingStatus: { [key: string]: React.ReactNode } = {
        loading: <p>{loadingMessage}</p>,
        error: <p>{errorMessage}</p>,
        success: children,
    };

    return loadingStatus[status] ?? <p>Something went wrong</p>;
};
export default LoadingComponent;
