export const API_URL =
    process.env.NODE_ENV === "development"
        ? "https://uy72e7fwd6.execute-api.eu-central-1.amazonaws.com"
        : "https://uy72e7fwd6.execute-api.eu-central-1.amazonaws.com";

export const apiEndPoints = {
    group: {
        getGroups: "/prod/api/secure/Groups",
        getGroup: (groupId: string) =>
            `/prod/api/secure/Groups/${groupId}/details`,
        getExpensesFromUserInGroup: (groupId: string, userName: string) =>
            `/prod/api/secure/Groups/${groupId}/users/${userName}/expense`,
    },
};
