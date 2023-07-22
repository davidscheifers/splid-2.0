export const API_URL =
    process.env.NODE_ENV === "development"
        ? "http://localhost:8080"
        : "http://195.20.227.247";

export const API_ENDPOINTS = {
    LOGIN: "/api/login",
    LOGOUT: "/api/logout",
    LOADUSER: "/api/me",
    GET_ALL_USERROLES: "/api/v1/user-roles",
    GET_ALL_USERS: "/api/v1/users",
    GET_ALL_COMPANIES: "/api/v1/companies",
    GET_ALL_SUVRVEYS: "/api/v1/surveys",
    GET_ALL_SUVRVEY_CONTENTS: "/api/v1/surveyContents",
    SURVEYANSWERS: "/api/v1/surveyAnswers",
};
