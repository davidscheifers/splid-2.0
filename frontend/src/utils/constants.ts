export const API_URL =
    process.env.NODE_ENV === "development"
        ? "http://localhost:8080"
        : "http://195.20.227.247";

export const apiEndPoints = {
    group: {
        getGroupsFromUser: (userId: string) => `/api/v1/group/user/${userId}`,
        getGroup: (groupId: string) => `/api/v1/group/${groupId}`,
    },
};
