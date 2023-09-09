export const API_URL =
    process.env.NODE_ENV === "development"
        ? "https://elvip7nvnf.execute-api.eu-central-1.amazonaws.com"
        : "https://elvip7nvnf.execute-api.eu-central-1.amazonaws.com";

export const apiEndPoints = {
    group: {
        getGroups: "/prod/api/secure/Groups",
        getGroup: (groupId: string) =>
            `/prod/api/secure/Groups/${groupId}/details`,
        getExpensesFromUserInGroup: (groupId: string, userName: string) =>
            `/prod/api/secure/Groups/${groupId}/users/${userName}/expense`,
        getIncomesFromUserInGroup: (groupId: string, userName: string) =>
            `/prod/api/secure/Groups/${groupId}/users/${userName}/income`,
        getTransactionsFromGroup: (groupId: string) =>
            `/prod/api/secure/Groups/${groupId}/transactions`,
    },
    user: {
        getGroupsFromUser: (userName: string) =>
            `/prod/api/secure/User/${userName}/groups`,
        getUserInformations: (userName: string) =>
            `/prod/api/secure/User/${userName}`,
    },
    accounting: {
        getAccountingInformationsFromGroup: (groupId: string) =>
            `/prod/api/secure/Accounting/${groupId}`,
        getSettlingDebtsFromGroup: (groupId: string) =>
            `/prod/api/secure/Accounting/${groupId}/settle-debts`,
    },
    transaction: {
        getTransaction: (transactionId: string) =>
            `/prod/api/secure/Transactions/${transactionId}`,
        createTransaction: `/prod/api/secure/Transactions`,
        updateTransaction: (transactionId: string) =>
            `/prod/api/secure/Transactions/${transactionId}`,
        deleteTransaction: (transactionId: string) =>
            `/prod/api/secure/Transactions/${transactionId}`,
    },
};
