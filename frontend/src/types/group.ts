export type TDummyGroup = {
    id: number;
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
    id: number;
    name: string;
};
