export const API_URL =
    process.env.NODE_ENV === "development"
        ? "https://uy72e7fwd6.execute-api.eu-central-1.amazonaws.com"
        : "https://uy72e7fwd6.execute-api.eu-central-1.amazonaws.com";

export const apiEndPoints = {
    auth: {
        login: `/api/v1/auth/login`,
    },
    group: {
        getGroups: "/prod/api/secure/Groups",
        getGroupsFromUser: (userId: string) => `/api/v1/group/user/${userId}`,
        getGroup: (groupId: string) => `/api/v1/group/${groupId}`,
    },
};
