import {
    TDummyBalance,
    TDummyExpense,
    TDummyGroup,
    TDummyUser,
} from "@/types/group";

export const dummyGroups: TDummyGroup[] = [
    { id: 1, name: "Group 1", currency: "EUR", code: "4ZM NSP Z5V" },
    { id: 2, name: "Group 2", currency: "EUR", code: "5ZQ NRP P5V" },
    { id: 3, name: "Group 3", currency: "EUR", code: "N2M NUB Z7V" },
];

export const dummyUsers: TDummyUser[] = [
    { id: 1, name: "User 1" },
    { id: 2, name: "User 2" },
    { id: 3, name: "User 3" },
];

export const dummyExpenses: TDummyExpense[] = [
    {
        id: 1,
        name: "Expense 1",
        category: "food",
        amount: 20,
        currency: "EUR",
        from: { id: 1, name: "User 1" },
        for: [
            { id: 2, name: "User 2" },
            { id: 3, name: "User 3" },
        ],
        buyDate: new Date(),
        createdAt: new Date(),
    },
    {
        id: 2,
        name: "Expense 2",
        category: "food",
        amount: 50,
        currency: "EUR",
        from: { id: 2, name: "User 2" },
        for: [
            { id: 1, name: "User 1" },
            { id: 3, name: "User 3" },
        ],
        buyDate: new Date(),
        createdAt: new Date(),
    },
];

export const dummyBalance: TDummyBalance[] = [
    {
        id: 1,
        amount: 20,
        currency: "EUR",
        user: { id: 1, name: "admin" },
    },
    {
        id: 2,
        amount: 200,
        currency: "EUR",
        user: { id: 2, name: "tester" },
    },
    {
        id: 3,
        amount: 52,
        currency: "EUR",
        user: { id: 3, name: "max mustermann" },
    },
];
