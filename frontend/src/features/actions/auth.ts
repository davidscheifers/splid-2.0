import axios, { AxiosResponse } from "axios";
import { Dispatch } from "redux";

import { NotificationsEvents } from "@mantine/notifications/lib/events";
import setAuthToken from "../../utils/functions/set-authtoken";
import { API_URL, apiEndPoints } from "../../utils/constants/constants";

export const loadUser = () => async (dispatch: Dispatch<AuthAction>) => {
    const token = localStorage.getItem("token");

    if (token) {
        setAuthToken(token);
    }

    try {
        /* const res: AxiosResponse<any> = await axios.get(
            `${API_URL}${API_ENDPOINTS.LOADUSER}`
        ); */

        dispatch({
            type: "USER_LOADED",
            payload: {
                user: {
                    id: "1",
                    userName: "Max Mustermann",
                },
            },
        });
    } catch (err) {
        dispatch({
            type: "AUTH_ERROR",
        });
    }
};

export const login =
    (
        loginData: { email: string; password: string },
        notifications: NotificationsEvents,
        setLoading: React.Dispatch<React.SetStateAction<boolean>>
    ) =>
    async (dispatch: Dispatch<AuthAction>) => {
        try {
            setLoading(true);
            const res: AxiosResponse<{ token: string }> = await axios.post(
                `${API_URL}${apiEndPoints.auth.login}`,
                { username: loginData.email, password: loginData.password },
                {
                    headers: {
                        Accept: "*/*",
                        "Content-Type": "application/json",
                    },
                }
            );

            const token = res.data.token;

            dispatch({
                type: "LOGIN_SUCCESS",
                payload: { token },
            });

            dispatch(loadUser() as any);
            notifications.show({
                color: "green",
                title: "Login success!",
                message: "Your login was successfull",
            });
            setLoading(false);
        } catch (err) {
            setLoading(false);
            notifications.show({
                color: "red",
                title: "Login Failed",
                message: "Seems like the login failed. Please try again.",
            });

            dispatch({
                type: "LOGIN_FAIL",
            });
        }
    };

export const logout = () => async (dispatch: Dispatch<AuthAction>) => {
    try {
        dispatch({ type: "LOGOUT" });
    } catch (err) {
        console.log("logout error");
    }
};
