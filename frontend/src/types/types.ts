// Redux state
type AppState = {
    auth: AuthState;
};
// Auth reducer
type LoadUserFn = any;

type AuthDispatch = (action: AuthAction) => void;

type AuthState = {
    token: string | null;
    isAuthenticated: boolean | null;
    loading: boolean;
    user: User | null;
};

type AuthAction =
    | {
          type: "USER_LOADED";
          payload: {
              user: User;
          };
      }
    | {
          type: "REGISTER_SUCCESS";
          payload: {
              token: string;
          };
      }
    | {
          type: "LOGIN_SUCCESS";
          payload: {
              token: string;
          };
      }
    | { type: "REGISTER_FAIL" }
    | { type: "AUTH_ERROR" }
    | { type: "LOGIN_FAIL" }
    | { type: "LOGOUT" }
    | { type: "ACCOUNT_DELETED" };

type JWT = {
    type: string;
    expiresIn: number;
    accessToken: string;
};

type User = {
    id: string;
    userName: string;
};
