export const API_URL =
    process.env.NODE_ENV === "development"
        ? "http://localhost:8080"
        : "http://195.20.227.247";

export const apiEndPoints = {
    auth: {
        login: `/api/v1/auth/login`,
    },
    group: {
        getGroupsFromUser: (userId: string) => `/api/v1/group/user/${userId}`,
        getGroup: (groupId: string) => `/api/v1/group/${groupId}`,
    },
};
