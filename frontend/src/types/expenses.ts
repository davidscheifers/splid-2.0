import { z } from "zod";

export const ExpenseFormSchema = z.object({
    description: z.string(),
    senderUsername: z.string(),
    receiverUsername: z.string(),
    amount: z.number(),
    groupId: z.string(),
});

export type TExpenseForm = z.infer<typeof ExpenseFormSchema>;
