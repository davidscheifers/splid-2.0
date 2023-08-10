import { z } from "zod";

export const UserFormSchema = z.object({
    name: z.string(),
});

export type TUserForm = z.infer<typeof UserFormSchema>;
