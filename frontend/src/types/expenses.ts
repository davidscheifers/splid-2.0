import { z } from "zod";

export const ExpenseFormSchema = z.object({
    name: z.string(),
    category: z.string(),
    amount: z.number(),
    currency: z.string(),
    from: z.string(),
    for: z.array(
        z.object({
            user: z.object({ id: z.number(), name: z.string() }),
            percentage: z.number(),
        })
    ),
    buyDate: z.date(),
    createdAt: z.date(),
});

export type TExpenseForm = z.infer<typeof ExpenseFormSchema>;
