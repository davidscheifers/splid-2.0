import { z } from "zod";

export type TDummyGroup = {
    id: number | string;
    name: string;
    code: string;
    currency: CurrencyType;
};

export type CurrencyType = "EUR" | "USD" | "GBP" | "YEN";

export type ExpenseCategoryType = "food" | "no category";

export type TDummyExpense = {
    id: number;
    name: string;
    category: ExpenseCategoryType;
    amount: number;
    currency: CurrencyType;
    from: TDummyUser;
    for: TDummyUser[];
    buyDate: Date;
    createdAt: Date;
};

export type TDummyBalance = {
    id: number;
    amount: number;
    currency: CurrencyType;
    user: TDummyUser;
};

export type TDummyUser = {
    id: number | string;
    name: string;
};

export const GroupFormSchema = z.object({
    name: z.string(),
    currency: z.string(),
});

export type TGroupForm = z.infer<typeof GroupFormSchema>;

// api types
export type TGroup = {
    id: string;
    name: string;
    picturePath: string;
    description: string;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
};

export type GroupDetail = {
    id: string;
    name: string;
    picturePath: string;
    description: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    users: User[];
    accountings: Accounting[];
};

export interface User {
    username: string;
    password: string;
    mail: string;
    number: string;
}

export interface Accounting {
    username: string;
    balance: number;
    groupId: string;
}

export type GroupExpense = {
    id: string;
    description: string;
    amount: number;
    createdAt: string;
};
